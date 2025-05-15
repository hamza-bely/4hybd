import React, { useEffect, useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { add, chatbubbleEllipses, refreshOutline } from 'ionicons/icons';
import { useMessageStore } from '../store/messageStore';
import { useAuthStore } from '../store/authStore';
import ConversationItem from '../components/ConversationItem';
import { User } from '../types';
import { getUserById } from '../services/auth';

const ConversationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { conversations, fetchConversations, isLoading, error } = useMessageStore();
  const [usersMap, setUsersMap] = useState<Record<number, User>>({});
  const [searchText, setSearchText] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchConversations(user.id);
    }
  }, [fetchConversations, user]);
  
  // Fetch user data for conversations
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      // Create a set of all participant IDs to avoid duplicates
      const participantIds = new Set<number>();
      
      conversations.forEach(conversation => {
        conversation.participantIds.forEach(id => {
          if (id !== user.id) {
            participantIds.add(id);
          }
        });
      });
      
      const users: Record<number, User> = {};
      
      for (const userId of participantIds) {
        try {
          const userData = await getUserById(userId);
          users[userId] = userData;
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
        }
      }
      
      setUsersMap(users);
    };
    
    if (conversations.length > 0 && user) {
      fetchUsers();
    }
  }, [conversations, user]);
  
  const handleRefresh = async (event: CustomEvent) => {
    if (user) {
      await fetchConversations(user.id);
    }
    event.detail.complete();
  };
  
  // Filter conversations based on search text
  const filteredConversations = searchText
    ? conversations.filter(conversation => {
        const otherParticipantIds = conversation.participantIds.filter(id => id !== user?.id);
        return otherParticipantIds.some(id => {
          const userName = usersMap[id]?.name || '';
          return userName.toLowerCase().includes(searchText.toLowerCase());
        });
      })
    : conversations;
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chats</IonTitle>
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
        
        <div className="p-4">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value || '')}
            placeholder="Search"
            className="mb-4"
          />
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-56">
            <IonSpinner name="dots" />
            <p className="text-sm text-gray-500 mt-2">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <IonButton onClick={() => user && fetchConversations(user.id)} className="mt-4">
              Try Again
            </IonButton>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 p-4 text-center">
            {searchText ? (
              <p className="text-gray-500">No conversations matching your search</p>
            ) : (
              <>
                <IonIcon icon={chatbubbleEllipses} className="w-16 h-16 text-gray-300 mb-4" />
                <p className="mb-2 text-lg font-semibold">No conversations yet</p>
                <p className="text-gray-500 mb-4">Start chatting with your friends!</p>
                <IonButton shape="round">
                  <IonIcon slot="start" icon={add} />
                  New Chat
                </IonButton>
              </>
            )}
          </div>
        ) : (
          <IonList>
            {filteredConversations.map(conversation => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                users={usersMap}
                currentUserId={user?.id || 0}
                onClick={() => {
                  // Navigate to chat page with this conversation
                  window.location.href = `/chat/${conversation.id}`;
                }}
              />
            ))}
          </IonList>
        )}
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ConversationsPage;