import React, {useState} from 'react';
import {IonPopover, IonSearchbar, IonButtons, IonIcon, IonButton, IonCol,IonRow, IonGrid, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {funnel} from 'ionicons/icons'
const Bookmarked: React.FC = () => {

  const [showPopover, setShowPopover] = useState(false);



  return (

    

    <IonPage>

     <IonPopover isOpen={showPopover} onDidDismiss={e => setShowPopover(false)}>
        <p>This is popover content</p>
     </IonPopover>

     {
       /*
        https://ionicframework.com/docs/react/your-first-app#a-look-at-a-react-component
        https://ionicframework.com/docs/api/popover
       */
     }
      <IonHeader>
        <IonToolbar>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonTitle>Bookmarked</IonTitle>
              </IonCol>

              <IonCol>
                <IonButton onClick={() => setShowPopover(true)}>
                  <IonIcon icon = {funnel}/> {/*https://github.com/ionic-team/ionic/issues/18847*/}
                </IonButton>
              </IonCol>
            </IonRow>
           <IonRow>
             <IonSearchbar></IonSearchbar>
           </IonRow>

          </IonGrid>
          
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/bookmarked/details">
            <IonLabel>
              <h2>Go to detail</h2>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Bookmarked;