import { create } from 'zustand';
import { Message, Conversation } from '../types';
import {
  getConversationsForUser,
  getMessagesForConversation,
  sendMessage,
} from '../services/message';

interface MessageState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: (userId: number) => Promise<void>;
  fetchMessages: (userId: number, otherParticipantIds: number[]) => Promise<void>;
  sendNewMessage: (
    senderId: number, 
    receiverIds: number[], 
    content: string, 
    mediaUrl?: string
  ) => Promise<void>;
  setCurrentConversation: (conversationId: string | null) => void;
  clearError: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  fetchConversations: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await getConversationsForUser(userId);
      set({ conversations, isLoading: false });
    } catch (error) {
      console.error('Fetch conversations error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch conversations', 
        isLoading: false 
      });
    }
  },

  fetchMessages: async (userId: number, otherParticipantIds: number[]) => {
    set({ isLoading: true, error: null });
    try {
      const messages = await getMessagesForConversation(userId, otherParticipantIds);
      set({ messages, isLoading: false });
    } catch (error) {
      console.error('Fetch messages error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch messages', 
        isLoading: false 
      });
    }
  },

  sendNewMessage: async (
    senderId: number, 
    receiverIds: number[], 
    content: string, 
    mediaUrl?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      await sendMessage({
        senderId,
        receiverIds,
        content,
        mediaUrl,
        type: mediaUrl ? 'IMAGE' : 'TEXT',
      });
      
      // Refresh messages
      if (get().currentConversation) {
        const participants = get().currentConversation.split('-').map(Number);
        const otherParticipantIds = participants.filter(id => id !== senderId);
        await get().fetchMessages(senderId, otherParticipantIds);
      }
      
      // Refresh conversations
      await get().fetchConversations(senderId);
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Send message error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to send message', 
        isLoading: false 
      });
    }
  },

  setCurrentConversation: (conversationId: string | null) => {
    set({ currentConversation: conversationId });
  },

  clearError: () => set({ error: null }),
}));