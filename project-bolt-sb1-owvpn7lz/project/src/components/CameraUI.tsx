import React, { useState, useRef } from 'react';
import { 
  IonButton,
  IonIcon,
  IonSpinner,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { 
  cameraOutline, 
  videocamOutline, 
  closeCircleOutline, 
  checkmarkCircleOutline,
  refreshOutline
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraDirection } from '@capacitor/camera';

interface CameraUIProps {
  onCapture: (file: File) => void;
  isLoading: boolean;
}

const CameraUI: React.FC<CameraUIProps> = ({
  onCapture,
  isLoading
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraDirection, setCameraDirection] = useState(CameraDirection.Rear);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const toggleCameraDirection = () => {
    setCameraDirection(prev => 
      prev === CameraDirection.Rear ? CameraDirection.Front : CameraDirection.Rear
    );
  };
  
  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        direction: cameraDirection
      });
      
      if (image.webPath) {
        setCapturedImage(image.webPath);
        
        // Convert to File
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        
        // Pass to parent
        onCapture(file);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };
  
  // For future implementation of video recording
  // This is a placeholder as the actual implementation would require more complex logic
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic would go here
    } else {
      setIsRecording(true);
      // Start recording logic would go here
    }
  };
  
  const retakeCapture = () => {
    setCapturedImage(null);
    setIsRecording(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-between h-full bg-black">
      {capturedImage ? (
        // Preview captured image
        <div className="relative h-full w-full">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="h-full w-full object-cover"
          />
          
          <div className="absolute bottom-8 w-full flex justify-center space-x-4">
            <IonButton 
              shape="round" 
              color="light" 
              onClick={retakeCapture}
              disabled={isLoading}
            >
              <IonIcon slot="icon-only" icon={refreshOutline} />
            </IonButton>
            
            <IonButton 
              shape="round" 
              color="primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <IonSpinner name="dots" />
              ) : (
                <IonIcon slot="icon-only" icon={checkmarkCircleOutline} />
              )}
            </IonButton>
          </div>
        </div>
      ) : (
        // Camera view
        <div className="relative h-full w-full bg-black flex items-center justify-center">
          {/* Camera preview would normally go here */}
          <div className="text-white text-center">
            <p>Camera Preview</p>
            <p className="text-sm text-gray-400">
              (Actual camera preview requires native capabilities)
            </p>
          </div>
          
          <IonFab vertical="top" horizontal="end" slot="fixed">
            <IonFabButton color="light" onClick={toggleCameraDirection}>
              <IonIcon icon={refreshOutline} />
            </IonFabButton>
          </IonFab>
          
          <div className="absolute bottom-8 w-full flex justify-center">
            <div className="flex space-x-4 items-center">
              <IonButton 
                shape="round" 
                color="dark" 
                fill="clear"
                onClick={() => setIsVideo(false)}
                className={!isVideo ? 'font-bold' : ''}
              >
                Photo
              </IonButton>
              
              <IonButton 
                onClick={isVideo ? toggleRecording : takePicture} 
                className="w-20 h-20 rounded-full overflow-hidden"
                style={{ 
                  background: isRecording ? '#f03e3e' : '#ffffff',
                  boxShadow: '0 0 0 6px rgba(255,255,255,0.3)'
                }}
              >
                <IonIcon 
                  icon={isVideo ? videocamOutline : cameraOutline} 
                  style={{ fontSize: '32px', color: isVideo ? '#ffffff' : '#000000' }}
                />
              </IonButton>
              
              <IonButton 
                shape="round" 
                color="dark" 
                fill="clear"
                onClick={() => setIsVideo(true)}
                className={isVideo ? 'font-bold' : ''}
              >
                Video
              </IonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraUI;