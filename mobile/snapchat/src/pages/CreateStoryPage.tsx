import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonFooter,
  IonToast
} from '@ionic/react';
import { close } from 'ionicons/icons';
import CameraUI from '../components/CameraUI';
import { useStoryStore } from '../store/storyStore';
import { useAuthStore } from '../store/authStore';

const CreateStoryPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuthStore();
  const { createStory, isLoading, error, clearError } = useStoryStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const handleCapture = async (file: File) => {
    if (!user) {
      setToastMessage('You must be logged in to create a story');
      setShowToast(true);
      return;
    }
    
    try {
      await createStory(file, user.id.toString());
      setToastMessage('Story created successfully!');
      setShowToast(true);
      // Navigate back to home after a short delay
      setTimeout(() => {
        history.push('/home');
      }, 1500);
    } catch (err) {
      setToastMessage('Failed to create story');
      setShowToast(true);
    }
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/home')}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Create Story</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-no-padding">
        <CameraUI onCapture={handleCapture} isLoading={isLoading} />
      </IonContent>
      
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
      />
      
      <IonToast
        isOpen={!!error}
        onDidDismiss={() => clearError()}
        message={error || ''}
        duration={2000}
        position="top"
        color="danger"
      />
    </IonPage>
  );
};

export default CreateStoryPage;