import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButton,
  IonRouterLink
} from '@ionic/react';
import { Camera } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async (data: { email: string; password: string }) => {
    clearError();
    await login(data.email, data.password);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md px-4 py-8">
            <div className="flex justify-center mb-8">
              <div className="bg-primary rounded-full p-4 mb-4">
                <Camera size={40} className="text-black" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6">Welcome Back!</h1>
            
            <AuthForm 
              type="login"
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <IonRouterLink routerLink="/register" className="text-primary font-medium">
                  Sign Up
                </IonRouterLink>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;