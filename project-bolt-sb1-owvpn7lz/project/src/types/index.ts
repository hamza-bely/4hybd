// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Story types
export interface Story {
  id: number;
  userId: string;
  mediaUrl: string;
  mediaType: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  expiresAt: string;
}

export interface StoryUploadRequest {
  userId: string;
  file: File;
  latitude: number;
  longitude: number;
}

// Message types
export interface Message {
  id: number;
  senderId: number;
  receiverIds: number[];
  content: string;
  mediaUrl?: string;
  type: string;
  timestamp: string;
}

export interface MessageRequest {
  senderId: number;
  receiverIds: number[];
  content: string;
  mediaUrl?: string;
  type: string;
}

// Conversation type (derived from messages)
export interface Conversation {
  id: string; // Unique identifier for the conversation (could be composite of user IDs)
  participantIds: number[];
  lastMessage?: Message;
  unreadCount: number;
}