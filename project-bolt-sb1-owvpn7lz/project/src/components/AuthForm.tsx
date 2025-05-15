import React from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonNote, IonSpinner } from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  error
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {type === 'register' && (
        <div className="mb-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <IonItem className="rounded-md">
                <IonLabel position="floating">Name</IonLabel>
                <IonInput {...field} placeholder="Enter your name" />
                {errors.name && (
                  <IonNote slot="error" color="danger">
                    {errors.name.message}
                  </IonNote>
                )}
              </IonItem>
            )}
          />
        </div>
      )}

      <div className="mb-4">
        <Controller
          name="email"
          control={control}
          rules={{ 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }}
          render={({ field }) => (
            <IonItem className="rounded-md">
              <IonLabel position="floating">Email</IonLabel>
              <IonInput {...field} type="email" placeholder="Enter your email" />
              {errors.email && (
                <IonNote slot="error" color="danger">
                  {errors.email.message}
                </IonNote>
              )}
            </IonItem>
          )}
        />
      </div>

      <div className="mb-6">
        <Controller
          name="password"
          control={control}
          rules={{ 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          }}
          render={({ field }) => (
            <IonItem className="rounded-md">
              <IonLabel position="floating">Password</IonLabel>
              <IonInput {...field} type="password" placeholder="Enter your password" />
              {errors.password && (
                <IonNote slot="error" color="danger">
                  {errors.password.message}
                </IonNote>
              )}
            </IonItem>
          )}
        />
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <IonButton 
        expand="block" 
        type="submit" 
        className="w-full" 
        color="primary"
        disabled={isLoading}
      >
        {isLoading ? <IonSpinner name="dots" /> : type === 'login' ? 'Login' : 'Register'}
      </IonButton>
    </form>
  );
};

export default AuthForm;