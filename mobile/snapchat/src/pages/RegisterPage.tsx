import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButton,
  IonRouterLink,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { Camera } from 'lucide-react';
import AuthForm from '../components/AuthForm';
import { useAuthStore } from '../store/authStore';

const RegisterPage: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    clearError();
    await register(data.name, data.email, data.password);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-md px-4 py-8">
            <div className="flex justify-center mb-8">
              <div className="bg-primary rounded-full p-4 mb-4">
                <Camera size={40} className="text-black" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6">Join Snapchat</h1>
            
            <AuthForm 
              type="register"
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
            />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <IonRouterLink routerLink="/login" className="text-primary font-medium">
                  Log In
                </IonRouterLink>
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;