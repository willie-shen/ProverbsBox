import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { search, filing, heartEmpty } from 'ionicons/icons';
import Library from './pages/Library';
import Bookmarked from './pages/Bookmarked';
import Discover from './pages/Discover';
import Details from './pages/Details';

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

/* Data */
import ProverbData from "./components/ProverbData";
import {Filters} from "./components/Filters"

// Test API Functionality
import TestScript2 from "./api/TestScript2"
import conf from "./api/TestScriptConfig.json"

// TestScript hook.
if (conf.test2) {TestScript2()}

const pd = new ProverbData();

/* Test filters */

pd.AddFilter(...Filters.ByChapter(3));
pd.AddFilter(...Filters.ByContent("Wisdom"));

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/library" component={() => <Library proverbProvider={pd}/>} exact={true} />
          <Route path="/bookmarked" component={Bookmarked} exact={true} />
          <Route path="/bookmarked/details" component={Details} />
          <Route path="/discover" component={Discover} />
          <Route path="/" render={() => <Redirect to="/library" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="library" href="/library">
            <IonIcon icon={search} />
            <IonLabel>Library</IonLabel>
          </IonTabButton>
          <IonTabButton tab="bookmarked" href="/bookmarked" >
            <IonIcon icon={filing} />
            <IonLabel>Bookmarked</IonLabel>
          </IonTabButton>
          <IonTabButton tab="discover" href="/discover">
            <IonIcon icon={heartEmpty} />
            <IonLabel>Discover</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;