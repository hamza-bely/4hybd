import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonAvatar,
  IonList,
  IonListHeader,
  IonToggle,
  IonAlert
} from '@ionic/react';
import { 
  logOutOutline, 
  settingsOutline, 
  moonOutline,
  lockClosedOutline,
  notificationsOutline,
  helpCircleOutline,
  personCircleOutline
} from 'ionicons/icons';
import { useAuthStore } from '../store/authStore';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleLogout = async () => {
    await logout();
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode);
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="end">

          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="flex flex-col items-center p-6 bg-primary">
          <h2 className="text-xl font-bold mt-4 text-black">{user?.name || 'User'}</h2>
          <p className="text-sm text-gray-700">{user?.email || 'user@example.com'}</p>
          
          <div className="mt-4 flex space-x-4">
            <IonButton 
              size="small" 
              shape="round" 
              fill="outline" 
              className="bg-white"
            >
              Edit Profile
            </IonButton>
            <IonButton 
              size="small" 
              shape="round" 
              color="secondary"
            >
              Add Friends
            </IonButton>
          </div>
        </div>
        
        <IonList>
          <IonListHeader>Account</IonListHeader>
          


          //ajoute le info de user

          
          <IonItem>
            <IonIcon slot="start" icon={notificationsOutline} />
            <IonLabel>Notifications</IonLabel>
          </IonItem>
          <IonItem button onClick={() => setShowLogoutAlert(true)}>
            <IonIcon slot="start" icon={logOutOutline} color="danger" />
            <IonLabel color="danger">Logout</IonLabel>
          </IonItem>
        </IonList>
        
        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Logout"
          message="Are you sure you want to logout?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Logout',
              role: 'destructive',
              handler: handleLogout,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;