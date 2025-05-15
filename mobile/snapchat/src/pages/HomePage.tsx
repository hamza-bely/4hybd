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
  const { fetchNearbyStories, isLoading, error } = useStoryStore();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [usersMap, setUsersMap] = useState<Record<string, UserType>>({});
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    // Fetch stories from API
    const getStories = async () => {
      try {
        // Using mock data from the example
        const response = {
          message: "All stories retrieved successfully",
          data: [
            {
              id: 1,
              userId: "string",
              mediaUrl: "https://res.cloudinary.com/dvbuw88x7/image/upload/v1747224561/story_50af8063-e9b1-4923-88a4-db7aa0afcd36.png",
              mediaType: "image",
              latitude: 0.1,
              longitude: 0.1,
              createdAt: "2025-05-14T14:09:23.336116",
              expiresAt: "2025-05-15T14:09:23.336116"
            }
          ]
        };

        setStories(response.data);

        // You could also use the actual fetchNearbyStories function instead:
        // const fetchedStories = await fetchNearbyStories();
        // setStories(fetchedStories);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    getStories();
  }, []);

  // Fetch user data for stories
  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = [...new Set(stories.map(story => story.userId))];
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

    if (stories.length > 0) {
      fetchUsers();
    }
  }, [stories]);

  const handleRefresh = async (event: CustomEvent) => {
    try {
      // Using mock data from the example
      const response = {
        message: "All stories retrieved successfully",
        data: [
          {
            id: 1,
            userId: "string",
            mediaUrl: "https://res.cloudinary.com/dvbuw88x7/image/upload/v1747224561/story_50af8063-e9b1-4923-88a4-db7aa0afcd36.png",
            mediaType: "image",
            latitude: 0.1,
            longitude: 0.1,
            createdAt: "2025-05-14T14:09:23.336116",
            expiresAt: "2025-05-15T14:09:23.336116"
          }
        ]
      };

      setStories(response.data);

      // You could also use the actual fetchNearbyStories function:
      // await fetchNearbyStories();
    } catch (err) {
      console.error("Error refreshing stories:", err);
    }

    event.detail.complete();
  };

  const openStory = (index: number) => {
    setSelectedStoryIndex(index);
    setViewerOpen(true);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          ) : stories.length === 0 ? (
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
                  {stories.map((story, index) => (
                      <StoryCircle
                          key={story.id}
                          story={story}
                          user={usersMap[story.userId]}
                          onClick={() => openStory(index)}
                      />
                  ))}
                </div>

                {/* Display the fetched story details */}
                <div className="mt-6 mb-8">
                  <h2 className="text-lg font-semibold mb-4">Story Details</h2>
                  {stories.map(story => (
                      <div key={story.id} className="bg-gray-100 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-medium">User ID: {story.userId}</p>
                            <p className="text-xs text-gray-500">Posted at {formatDate(story.createdAt)}</p>
                          </div>
                        </div>

                        <div className="rounded-lg overflow-hidden mb-3">
                          {story.mediaType === 'image' ? (
                              <img
                                  src={story.mediaUrl}
                                  alt="Story"
                                  className="w-full h-64 object-cover"
                              />
                          ) : story.mediaType === 'video' ? (
                              <div className="w-full h-64 bg-black flex items-center justify-center text-white">
                                Video Content
                              </div>
                          ) : (
                              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                Unknown Media Type
                              </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>Location: {story.latitude}, {story.longitude}</p>
                          <p>Expires: {new Date(story.expiresAt).toLocaleString()}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          <StoryViewer
              stories={stories}
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