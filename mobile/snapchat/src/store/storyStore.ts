import { create } from 'zustand';
import { Story } from '../types';
import {
  getAllStories,
  getStoriesByProximity,
  uploadStory,
} from '../services/story';
import { getCurrentPosition } from '../services/story';

interface StoryState {
  stories: Story[];
  nearbyStories: Story[];
  isLoading: boolean;
  error: string | null;
  fetchAllStories: () => Promise<void>;
  fetchNearbyStories: (maxDistanceKm?: number) => Promise<void>;
  createStory: (file: File, userId: string) => Promise<void>;
  clearError: () => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  nearbyStories: [],
  isLoading: false,
  error: null,

  fetchAllStories: async () => {
    set({ isLoading: true, error: null });
    try {
      const stories = await getAllStories();
      set({ stories, isLoading: false });
    } catch (error) {
      console.error('Fetch stories error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch stories', 
        isLoading: false 
      });
    }
  },

  fetchNearbyStories: async (maxDistanceKm = 10) => {
    set({ isLoading: true, error: null });
    try {
      const nearbyStories = await getStoriesByProximity(maxDistanceKm);
      set({ nearbyStories, isLoading: false });
    } catch (error) {
      console.error('Fetch nearby stories error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch nearby stories', 
        isLoading: false 
      });
    }
  },

  createStory: async (file: File, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      await uploadStory({
        file,
        userId,
        latitude,
        longitude,
      });
      
      // Refresh stories
      await get().fetchAllStories();
      await get().fetchNearbyStories();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Create story error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create story', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));