import React from 'react';
import {IonFabButton, IonIcon, IonHeader, IonToolbar, IonPage, IonTitle, IonContent, IonFab } from '@ionic/react';

const Discover: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Discover</IonTitle>
        </IonToolbar>
      </IonHeader>

        {/*<Proverb Proverb = {null}>
      </Proverb>*/}

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
