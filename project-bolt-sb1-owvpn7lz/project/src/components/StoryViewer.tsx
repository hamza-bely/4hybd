import React, { useState, useEffect } from 'react';
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton,
  IonContent, 
  IonIcon,
  IonProgressBar
} from '@ionic/react';
import { close, chevronBack, chevronForward } from 'ionicons/icons';
import { Story, User } from '../types';

interface StoryViewerProps {
  stories: Story[];
  users: Record<string, User>;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  users,
  isOpen,
  onClose,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  
  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.mediaType.includes('video') ? 10000 : 5000; // 10s for videos, 5s for images
  
  // Reset progress when current story changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);
  
  // Progress bar effect
  useEffect(() => {
    if (!isOpen || paused) return;
    
    const interval = 100; // Update every 100ms
    const step = interval / storyDuration;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + step;
        if (newProgress >= 1) {
          // Move to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
          } else {
            // End of stories
            clearInterval(timer);
            onClose();
          }
          return 0;
        }
        return newProgress;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [isOpen, paused, currentIndex, storyDuration, stories.length, onClose]);
  
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const togglePause = () => {
    setPaused(!paused);
  };
  
  if (!currentStory) return null;
  
  const user = users[currentStory.userId];
  
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="story-viewer">
      <IonHeader className="bg-transparent">
        <IonToolbar color="transparent">
          <IonProgressBar value={progress} color="light" />
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} color="light" />
            </IonButton>
          </IonButtons>
          <IonTitle color="light" size="small">
            {user?.name || 'User'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent 
        className="ion-text-center" 
        fullscreen 
        onClick={togglePause}
        style={{ 
          background: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {currentStory.mediaType.includes('image') ? (
            <img 
              src={currentStory.mediaUrl} 
              alt="Story" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video 
              src={currentStory.mediaUrl} 
              autoPlay 
              muted={false} 
              controls={false}
              className="max-h-full max-w-full object-contain"
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              loop={false}
            />
          )}
        </div>
        
        {/* Navigation overlay */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div 
            className="w-1/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            style={{ pointerEvents: 'auto' }}
          />
          <div 
            className="w-1/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              togglePause();
            }}
            style={{ pointerEvents: 'auto' }}
          />
          <div 
            className="w-1/3 h-full"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{ pointerEvents: 'auto' }}
          />
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          {currentIndex > 0 && (
            <IonButton 
              fill="clear" 
              onClick={handlePrevious}
              className="h-full"
            >
              <IonIcon icon={chevronBack} color="light" size="large" />
            </IonButton>
          )}
        </div>
        
        <div className="absolute inset-y-0 right-4 flex items-center">
          {currentIndex < stories.length - 1 && (
            <IonButton 
              fill="clear" 
              onClick={handleNext}
              className="h-full"
            >
              <IonIcon icon={chevronForward} color="light" size="large" />
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default StoryViewer;