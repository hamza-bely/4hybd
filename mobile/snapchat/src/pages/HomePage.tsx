import React, { useEffect, useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner
} from '@ionic/react';
import { add, refreshOutline } from 'ionicons/icons';
import { User } from 'lucide-react';
import StoryCircle from '../components/StoryCircle';
import StoryViewer from '../components/StoryViewer';
import { useStoryStore } from '../store/storyStore';
import { useAuthStore } from '../store/authStore';
import { Story, User as UserType } from '../types';
import { getUserById } from '../services/auth';

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { nearbyStories, fetchNearbyStories, isLoading, error } = useStoryStore();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [usersMap, setUsersMap] = useState<Record<string, UserType>>({});
  
  useEffect(() => {
    fetchNearbyStories();
  }, [fetchNearbyStories]);
  
  // Fetch user data for stories
  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(nearbyStories.map(story => story.userId))];
      const users: Record<string, UserType> = {};
      
      for (const userId of userIds) {
        try {
          const userData = await getUserById(Number(userId));
          users[userId] = userData;
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
        }
      }
      
      setUsersMap(users);
    };
    
    if (nearbyStories.length > 0) {
      fetchUsers();
    }
  }, [nearbyStories]);
  
  const handleRefresh = async (event: CustomEvent) => {
    await fetchNearbyStories();
    event.detail.complete();
  };
  
  const openStory = (index: number) => {
    setSelectedStoryIndex(index);
    setViewerOpen(true);
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex items-center p-2" slot="start">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
          <IonTitle>Stories</IonTitle>
          <IonButton fill="clear" slot="end" routerLink="/create-story">
            <IonIcon icon={add} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent 
            pullingIcon={refreshOutline} 
            pullingText="Pull to refresh" 
            refreshingSpinner="circles" 
            refreshingText="Refreshing..."
          />
        </IonRefresher>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <IonSpinner name="dots" />
            <p className="text-sm text-gray-500 mt-2">Loading stories near you...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <IonButton onClick={() => fetchNearbyStories()} className="mt-4">
              Try Again
            </IonButton>
          </div>
        ) : nearbyStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="mb-2 text-lg font-semibold">No stories nearby</p>
            <p className="text-gray-500 mb-4">Be the first to share a moment!</p>
            <IonButton routerLink="/create-story">
              Create Story
            </IonButton>
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Stories Near You</h2>
            
            <div className="flex overflow-x-auto pb-4 -mx-2">
              {nearbyStories.map((story, index) => (
                <StoryCircle 
                  key={story.id}
                  story={story}
                  user={usersMap[story.userId]}
                  onClick={() => openStory(index)}
                />
              ))}
            </div>
            
            <h2 className="text-lg font-semibold my-4">Discover</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* This would normally show content from publishers or sponsored content */}
              <div className="rounded-lg overflow-hidden aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Publisher Content</p>
              </div>
              <div className="rounded-lg overflow-hidden aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Publisher Content</p>
              </div>
              <div className="rounded-lg overflow-hidden aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Publisher Content</p>
              </div>
              <div className="rounded-lg overflow-hidden aspect-square bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Publisher Content</p>
              </div>
            </div>
          </div>
        )}
        
        <StoryViewer 
          stories={nearbyStories}
          users={usersMap}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          initialIndex={selectedStoryIndex}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;