import React from 'react';
import {IonFabButton, IonButton, IonIcon, IonHeader, IonToolbar, IonPage, IonTitle, IonContent, IonFab } from '@ionic/react';

import {verses, Proverb} from '../components/Proverb'


const Discover: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Discover</IonTitle>
        </IonToolbar>
      </IonHeader>

      <Proverb Proverb = {verses[0]}>
      </Proverb>

      <IonFab vertical = "bottom" horizontal = "start">
          <IonFabButton>
            <IonIcon name = "arrow-back" /> {/*https://github.com/ionic-team/ionic/issues/19673 */}


          </IonFabButton>

          

      </IonFab>

      <IonFab vertical = "bottom" horizontal = "end">
          <IonFabButton>
            <IonIcon name = "arrow-forward"/>
            
          </IonFabButton>
      </IonFab>

      <IonContent />



    </IonPage>
  );
};

export default Discover;
