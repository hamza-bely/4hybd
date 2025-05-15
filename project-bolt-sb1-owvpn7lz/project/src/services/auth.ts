import { Preferences } from '@capacitor/preferences';

import { authApi, apiRequest } from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse, 
  User 
} from '../types';

const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Function to store the JWT token
export const setToken = async (token: string): Promise<void> => {
  await Preferences .set({
    key: TOKEN_KEY,
    value: token,
  });
};

// Function to get the stored JWT token
export const getToken = async (): Promise<string | null> => {
  const { value } = await Preferences .get({ key: TOKEN_KEY });
  return value;
};

// Function to store user data
export const setUserData = async (userData: Partial<User>): Promise<void> => {
  await Preferences .set({
    key: USER_DATA_KEY,
    value: JSON.stringify(userData),
  });
};

// Function to get stored user data
export const getUserData = async (): Promise<User | null> => {
  const { value } = await Preferences .get({ key: USER_DATA_KEY });
  return value ? JSON.parse(value) : null;
};

// Function to clear auth data (logout)
export const clearAuthData = async (): Promise<void> => {
  await Preferences .remove({ key: TOKEN_KEY });
  await Preferences .remove({ key: USER_DATA_KEY });
};

// Login function
export const login = async (credentials: LoginRequest): Promise<User> => {
  try {
    const response = await apiRequest<ApiResponse<AuthResponse>>(authApi, {
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });

    const { token, userId, name, email } = response.data;
    
    // Store token and user data
    await setToken(token);
    const userData = { id: userId, name, email };
    await setUserData(userData);
    
    return userData;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Register function
export const register = async (userData: RegisterRequest): Promise<User> => {
  try {
    const response = await apiRequest<ApiResponse<AuthResponse>>(authApi, {
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });

    const { token, userId, name, email } = response.data;
    
    // Store token and user data
    await setToken(token);
    const userInfo = { id: userId, name, email };
    await setUserData(userInfo);
    
    return userInfo;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  return getUserData();
};

// Logout function
export const logout = async (): Promise<void> => {
  await clearAuthData();
};

// Get user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await apiRequest<User>(authApi, {
      method: 'GET',
      url: `/users/${id}`,
    });
    
    return response;
  } catch (error) {
    console.error(`Failed to get user with ID ${id}:`, error);
    throw error;
  }
};

// Update user
export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiRequest<User>(authApi, {
      method: 'PUT',
      url: `/users/${id}`,
      data: userData,
    });
    
    // Update stored user data
    const currentUser = await getUserData();
    if (currentUser && currentUser.id === id) {
      await setUserData({ ...currentUser, ...userData });
    }
    
    return response;
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    throw error;
  }
};