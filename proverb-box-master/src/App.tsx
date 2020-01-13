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

/* Interface */
import {IProverb} from "./components/ProverbInterface";

var ID = 1;

const words = (data);
//console.log(word); // output 'testing'

//https://alligator.io/js/json-parse-stringify/

////https://github.com/chybie/ts-json/blob/master/app.ts
//https://hackernoon.com/import-json-into-typescript-8d465beded79
//https://reactjs.org/docs/lists-and-keys.html

//https://errors.wtf/left-side-of-comma-operator-is-unused-and-has-no-side-effects/


const ProverbBox = new ProverbData();

const App: React.FC = () => (

  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/library" component={() => <Library proverbs={ProverbBox.GetAll()}/>} exact={true} />
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
