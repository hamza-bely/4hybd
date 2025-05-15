import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  cameraOutline,
  chatbubblesOutline,
  compassOutline,
  personOutline
} from 'ionicons/icons';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './index.css';
import './theme/variables.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ConversationsPage from './pages/ConversationsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import CreateStoryPage from './pages/CreateStoryPage';

/* Auth Store */
import { useAuthStore } from './store/authStore';

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
      <IonApp>
        <IonReactRouter>
          {isAuthenticated ? (
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/home" component={HomePage} />
                  <Route exact path="/conversations" component={ConversationsPage} />
                  <Route exact path="/chat/:conversationId" component={ChatPage} />
                  <Route exact path="/profile" component={ProfilePage} />
                  <Route exact path="/create-story" component={CreateStoryPage} />
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="home" href="/home">
                    <IonIcon icon={compassOutline} />
                    <IonLabel>Stories</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="chat" href="/conversations">
                    <IonIcon icon={chatbubblesOutline} />
                    <IonLabel>Chat</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="camera" href="/create-story">
                    <IonIcon icon={cameraOutline} />
                    <IonLabel>Camera</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="profile" href="/profile">
                    <IonIcon icon={personOutline} />
                    <IonLabel>Profile</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
          ) : (
              <IonRouterOutlet>
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />
              </IonRouterOutlet>
          )}
        </IonReactRouter>
      </IonApp>
  );
};

export default App;