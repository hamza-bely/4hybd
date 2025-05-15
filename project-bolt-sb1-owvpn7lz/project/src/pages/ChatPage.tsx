import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonButton,
  IonIcon,
  IonSpinner,
  IonItem,
  IonAvatar,
  IonLabel
} from '@ionic/react';
import { 
  camera, 
  send, 
  image as imageIcon, 
  happy, 
  mic, 
  videocam
} from 'ionicons/icons';
import { useMessageStore } from '../store/messageStore';
import { useAuthStore } from '../store/authStore';
import MessageBubble from '../components/MessageBubble';
import { User } from '../types';
import { getUserById } from '../services/auth';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuthStore();
  const { 
    messages, 
    fetchMessages, 
    sendNewMessage, 
    isLoading, 
    error 
  } = useMessageStore();
  
  const [usersMap, setUsersMap] = useState<Record<number, User>>({});
  const [messageText, setMessageText] = useState('');
  const contentRef = useRef<HTMLIonContentElement>(null);
  
  // Parse conversation ID to get participant IDs
  const participantIds = conversationId.split('-').map(Number);
  const otherParticipantIds = user ? participantIds.filter(id => id !== user.id) : [];
  const isSingleChat = otherParticipantIds.length === 1;
  
  useEffect(() => {
    if (user) {
      fetchMessages(user.id, otherParticipantIds);
    }
  }, [fetchMessages, user, otherParticipantIds]);
  
  // Fetch user data for participants
  useEffect(() => {
    const fetchUsers = async () => {
      const users: Record<number, User> = {};
      
      for (const userId of otherParticipantIds) {
        try {
          const userData = await getUserById(userId);
          users[userId] = userData;
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
        }
      }
      
      setUsersMap(users);
    };
    
    if (otherParticipantIds.length > 0) {
      fetchUsers();
    }
  }, [otherParticipantIds]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollToBottom(300);
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!user || !messageText.trim()) return;
    
    try {
      await sendNewMessage(user.id, otherParticipantIds, messageText);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  // Generate title for the chat
  const chatTitle = () => {
    if (isSingleChat) {
      const otherUser = usersMap[otherParticipantIds[0]];
      return otherUser?.name || 'Chat';
    }
    
    const participants = Object.values(usersMap)
      .map(u => u.name)
      .join(', ');
    
    return participants || `Group (${otherParticipantIds.length + 1})`;
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/conversations" />
          </IonButtons>
          
          {isSingleChat && Object.keys(usersMap).length > 0 ? (
            <IonItem lines="none" detail={false} routerLink={`/profile/${otherParticipantIds[0]}`}>
              <IonAvatar slot="start" className="w-8 h-8">
                <div className="bg-gray-300 w-full h-full flex items-center justify-center rounded-full">
                  <span className="text-xs font-bold">
                    {usersMap[otherParticipantIds[0]]?.name.substring(0, 1).toUpperCase()}
                  </span>
                </div>
              </IonAvatar>
              <IonLabel>{chatTitle()}</IonLabel>
            </IonItem>
          ) : (
            <IonTitle>{chatTitle()}</IonTitle>
          )}
          
          <IonButtons slot="end">
            {isSingleChat && (
              <IonButton>
                <IonIcon slot="icon-only" icon={videocam} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent ref={contentRef} className="ion-padding">
        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <IonSpinner name="dots" />
            <p className="text-sm text-gray-500 mt-2">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <IonButton 
              onClick={() => user && fetchMessages(user.id, otherParticipantIds)} 
              className="mt-4"
            >
              Try Again
            </IonButton>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === user?.id}
                sender={usersMap[message.senderId]}
              />
            ))}
          </div>
        )}
      </IonContent>
      
      <IonFooter>
        <div className="p-2 bg-white border-t">
          <div className="flex items-center">
            <IonButton fill="clear" size="small">
              <IonIcon slot="icon-only" icon={happy} />
            </IonButton>
            
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 mx-1">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Message"
                className="w-full bg-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </div>
            
            {messageText ? (
              <IonButton 
                fill="clear" 
                size="small"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <IonSpinner name="dots" />
                ) : (
                  <IonIcon slot="icon-only" icon={send} />
                )}
              </IonButton>
            ) : (
              <>
                <IonButton fill="clear" size="small">
                  <IonIcon slot="icon-only" icon={camera} />
                </IonButton>
                <IonButton fill="clear" size="small">
                  <IonIcon slot="icon-only" icon={mic} />
                </IonButton>
              </>
            )}
          </div>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;