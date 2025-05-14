import { messageApi, apiRequest } from './api';
import { 
  Message, 
  MessageRequest, 
  ApiResponse, 
  Conversation 
} from '../types';

// Send a message
export const sendMessage = async (messageData: MessageRequest): Promise<Message> => {
  try {
    const response = await apiRequest<ApiResponse<Message>>(messageApi, {
      method: 'POST',
      url: '/messages/send',
      data: messageData,
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

// Get messages received by a user
export const getMessagesForUser = async (userId: number): Promise<Message[]> => {
  try {
    const response = await apiRequest<ApiResponse<Message[]>>(messageApi, {
      method: 'GET',
      url: `/messages/received/${userId}`,
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to get messages for user ${userId}:`, error);
    throw error;
  }
};

// Get messages sent by a user
export const getMessagesSentByUser = async (userId: number): Promise<Message[]> => {
  try {
    const response = await apiRequest<ApiResponse<Message[]>>(messageApi, {
      method: 'GET',
      url: `/messages/sent/${userId}`,
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to get messages sent by user ${userId}:`, error);
    throw error;
  }
};

// Get all messages for a user (both sent and received)
export const getAllMessagesForUser = async (userId: number): Promise<Message[]> => {
  try {
    const [sentMessages, receivedMessages] = await Promise.all([
      getMessagesSentByUser(userId),
      getMessagesForUser(userId)
    ]);
    
    // Combine and sort by timestamp
    return [...sentMessages, ...receivedMessages].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error(`Failed to get all messages for user ${userId}:`, error);
    throw error;
  }
};

// Get conversations for a user
export const getConversationsForUser = async (userId: number): Promise<Conversation[]> => {
  try {
    const allMessages = await getAllMessagesForUser(userId);
    const conversationsMap = new Map<string, Conversation>();
    
    // Group messages by conversation
    allMessages.forEach(message => {
      const otherParticipants = message.senderId === userId 
        ? message.receiverIds 
        : [message.senderId];
      
      // Create a unique ID for this conversation (sorted participant IDs)
      const participants = [...otherParticipants, userId].sort((a, b) => a - b);
      const conversationId = participants.join('-');
      
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          id: conversationId,
          participantIds: participants,
          lastMessage: message,
          unreadCount: 0, // Implement actual unread count later
        });
      } else {
        const existing = conversationsMap.get(conversationId)!;
        const existingTimestamp = new Date(existing.lastMessage?.timestamp || 0).getTime();
        const newTimestamp = new Date(message.timestamp).getTime();
        
        if (newTimestamp > existingTimestamp) {
          conversationsMap.set(conversationId, {
            ...existing,
            lastMessage: message,
          });
        }
      }
    });
    
    // Convert map to array and sort by most recent message
    return Array.from(conversationsMap.values()).sort((a, b) => {
      const aTime = new Date(a.lastMessage?.timestamp || 0).getTime();
      const bTime = new Date(b.lastMessage?.timestamp || 0).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error(`Failed to get conversations for user ${userId}:`, error);
    throw error;
  }
};

// Get messages for a specific conversation
export const getMessagesForConversation = async (
  userId: number, 
  otherParticipantIds: number[]
): Promise<Message[]> => {
  try {
    const allMessages = await getAllMessagesForUser(userId);
    const participants = [...otherParticipantIds, userId];
    
    // Filter messages that involve all the specified participants
    return allMessages.filter(message => {
      const messageParticipants = [message.senderId, ...message.receiverIds];
      
      // Check if all participants are involved in this message
      return participants.every(id => messageParticipants.includes(id));
    }).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch (error) {
    console.error('Failed to get messages for conversation:', error);
    throw error;
  }
};