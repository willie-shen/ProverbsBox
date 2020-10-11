import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonViewDidEnter
} from '@ionic/react';

import {
  libraryOutline,
  bookmarkOutline,
  shuffleOutline
} from 'ionicons/icons';

import Library from './pages/Library';
import Bookmarked from './pages/Bookmarked';
import Discover from './pages/Discover';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './fonts/font-config.css';

import ContentManager from "./api/ContentManager"

// notifications
import { Plugins, AppState } from '@capacitor/core';
import NotificationsAssistant from "./api/NotificationsAssistant"

// init content manager
let cm = new ContentManager();

const App: React.FC = () => {

  // capacitor notifications setup
  useIonViewDidEnter(() => {
    // refresh notifications on app enter
    Plugins.App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive) {
        // call the notification setup
        let notificationAssistant = new NotificationsAssistant();
        notificationAssistant.NotificationSetter();
      }
    });
  });
 
  // root of the proverbs box app
  return (
    <>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/library" component={() => <Library contentManager={cm}/>} exact={true}/>
              <Route path="/bookmarked" component={() => <Bookmarked contentManager={cm}/>} exact={true}/>
              <Route path="/discover" component={() => <Discover contentManager={cm}/>} exact={true}/>
              <Route path="/" render={() => <Redirect to="/library"/>} exact={true}/>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="library" href="/library">
                <IonIcon icon={libraryOutline}/>
                <IonLabel>Library</IonLabel>
              </IonTabButton>
              <IonTabButton tab="bookmarked" href="/bookmarked">
                <IonIcon icon={bookmarkOutline}/>
                <IonLabel>Bookmarked</IonLabel>
              </IonTabButton>
              <IonTabButton tab="discover" href="/discover">
                <IonIcon icon={shuffleOutline}/>
                <IonLabel>Discover</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </>
  );
}

export default App;