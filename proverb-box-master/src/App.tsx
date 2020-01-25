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
import data from './data/Proverbs.json';
import ProverbData from "./components/ProverbData";
import {Filters} from "./components/Filters"

/* Interface */
import {IProverb} from "./components/ProverbInterface";

// Test API Functionality
import TestScript1 from "./api/TestScript1"
import TestScript2 from "./api/TestScript2"
import TestScript3 from "./api/TestScript3"
import TestScript4 from "./api/TestScript4"
import TestScript5 from "./api/TestScript5"
import conf from "./api/TestScriptConfig.json"

// TestScript hook.
if (conf.test1) {TestScript1()}
if (conf.test2) {TestScript2()}
if (conf.test3) {TestScript3()}
if (conf.test4) {TestScript4()}
if (conf.test5) {TestScript5()}

/* Resources */
/*
  https://alligator.io/js/json-parse-stringify/
  https://github.com/chybie/ts-json/blob/master/app.ts
  https://hackernoon.com/import-json-into-typescript-8d465beded79
  https://reactjs.org/docs/lists-and-keys.html
  https://errors.wtf/left-side-of-comma-operator-is-unused-and-has-no-side-effects/
*/

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