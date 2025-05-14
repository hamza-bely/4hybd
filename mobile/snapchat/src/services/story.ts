import { Geolocation, Position } from '@capacitor/geolocation';
import { storyApi, apiRequest } from './api';
import { 
  Story, 
  ApiResponse, 
  StoryUploadRequest 
} from '../types';

// Get current position
export const getCurrentPosition = async (): Promise<Position> => {
  try {
    return await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
  } catch (error) {
    console.error('Failed to get current position:', error);
    throw error;
  }
};

// Get all stories
export const getAllStories = async (): Promise<Story[]> => {
  try {
    const response = await apiRequest<ApiResponse<Story[]>>(storyApi, {
      method: 'GET',
      url: '/api/stories',
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to get stories:', error);
    throw error;
  }
};

// Get story by ID
export const getStoryById = async (id: number): Promise<Story> => {
  try {
    const response = await apiRequest<ApiResponse<Story>>(storyApi, {
      method: 'GET',
      url: `/api/stories/${id}`,
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to get story with ID ${id}:`, error);
    throw error;
  }
};

// Upload a story
export const uploadStory = async (storyData: StoryUploadRequest): Promise<Story> => {
  try {
    const formData = new FormData();
    formData.append('file', storyData.file);
    
    const response = await apiRequest<ApiResponse<Story>>(storyApi, {
      method: 'POST',
      url: `/api/stories?userId=${storyData.userId}&latitude=${storyData.latitude}&longitude=${storyData.longitude}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to upload story:', error);
    throw error;
  }
};

// Get stories by proximity (filtering stories based on user's location)
export const getStoriesByProximity = async (maxDistanceKm = 10): Promise<Story[]> => {
  try {
    // Get all stories
    const allStories = await getAllStories();
    
    // Get current position
    const position = await getCurrentPosition();
    const { latitude: userLat, longitude: userLng } = position.coords;
    
    // Filter stories based on distance
    return allStories.filter((story) => {
      const distance = calculateDistance(
        userLat, 
        userLng, 
        story.latitude, 
        story.longitude
      );
      
      return distance <= maxDistanceKm;
    });
  } catch (error) {
    console.error('Failed to get stories by proximity:', error);
    throw error;
  }
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};