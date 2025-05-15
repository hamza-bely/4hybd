import React from 'react';
import { Message, User } from '../types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  sender?: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  sender
}) => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[75%] rounded-lg px-4 py-2 ${
          isCurrentUser 
            ? 'bg-chat-bubble-sent text-black rounded-tr-none' 
            : 'bg-chat-bubble-received text-black rounded-tl-none'
        }`}
      >
        {!isCurrentUser && sender && (
          <p className="text-xs text-gray-600 mb-1">{sender.name}</p>
        )}
        
        {message.type === 'IMAGE' && message.mediaUrl && (
          <div className="mb-2">
            <img 
              src={message.mediaUrl} 
              alt="Shared image" 
              className="rounded max-w-full max-h-60 object-contain"
            />
          </div>
        )}
        
        {message.content && (
          <p className="text-sm break-words">{message.content}</p>
        )}
        
        <p className="text-xs text-gray-500 mt-1 text-right">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;