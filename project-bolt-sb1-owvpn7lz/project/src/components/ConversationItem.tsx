import React from 'react';
import { IonItem, IonAvatar, IonLabel, IonNote, IonBadge } from '@ionic/react';
import { Conversation, Message, User } from '../types';
import { format, isToday, isYesterday } from 'date-fns';

interface ConversationItemProps {
  conversation: Conversation;
  users: Record<number, User>;
  currentUserId: number;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  users,
  currentUserId,
  onClick
}) => {
  const lastMessage = conversation.lastMessage;
  
  // Get the other participants (excluding current user)
  const otherParticipants = conversation.participantIds
    .filter(id => id !== currentUserId)
    .map(id => users[id])
    .filter(Boolean);
  
  // Generate conversation name
  const conversationName = otherParticipants.length > 0
    ? otherParticipants.map(user => user.name).join(', ')
    : 'Unknown User';
  
  // Format the timestamp
  const formatTimestamp = (message?: Message) => {
    if (!message) return '';
    
    const timestamp = new Date(message.timestamp);
    if (isToday(timestamp)) {
      return format(timestamp, 'h:mm a');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM d');
    }
  };
  
  // Generate preview text for last message
  const getMessagePreview = (message?: Message) => {
    if (!message) return 'No messages yet';
    
    if (message.type === 'IMAGE') {
      return '📷 Photo';
    }
    
    return message.content.length > 30
      ? `${message.content.substring(0, 30)}...`
      : message.content;
  };
  
  // Check if the last message is from the current user
  const isLastMessageFromCurrentUser = lastMessage?.senderId === currentUserId;
  
  return (
    <IonItem detail={false} button onClick={onClick} lines="full">
      <IonAvatar slot="start" className="w-12 h-12">
        {/* Placeholder avatar - should be replaced with real user avatar */}
        <div className="bg-gray-300 w-full h-full flex items-center justify-center rounded-full">
          <span className="text-lg font-bold">
            {conversationName.substring(0, 1).toUpperCase()}
          </span>
        </div>
      </IonAvatar>
      
      <IonLabel>
        <h2 className="font-semibold">{conversationName}</h2>
        <p className="text-sm text-gray-500">
          {isLastMessageFromCurrentUser && 'You: '}
          {getMessagePreview(lastMessage)}
        </p>
      </IonLabel>
      
      <div slot="end" className="flex flex-col items-end">
        {lastMessage && (
          <IonNote color="medium" className="text-xs">
            {formatTimestamp(lastMessage)}
          </IonNote>
        )}
        
        {conversation.unreadCount > 0 && (
          <IonBadge color="primary" className="mt-1">
            {conversation.unreadCount}
          </IonBadge>
        )}
      </div>
    </IonItem>
  );
};

export default ConversationItem;