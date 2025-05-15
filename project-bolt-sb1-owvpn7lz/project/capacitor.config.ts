import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.snapchat.clone',
  appName: 'Snapchat Clone',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissionText: 'Camera access is required to take photos and videos'
    },
    Geolocation: {
      permissionText: 'Geolocation is required to show stories near you'
    }
  }
};

export default config;