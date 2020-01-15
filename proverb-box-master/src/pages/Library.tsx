import {
  IonPopover,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonCol,
  IonButton, IonButtons
} from '@ionic/react';
import { book, build, colorFill, grid } from 'ionicons/icons';
import React, {useState} from 'react';
import './Library.css';

import {IProverb} from "../components/ProverbInterface";
import {Proverb} from "../components/Proverb";
import ProverbData from "../components/ProverbData";

type ILibraryProps = {
  proverbProvider: ProverbData
}

const Library: React.FC<ILibraryProps> = (props: ILibraryProps) => {
  const [showPopover, setShowPopover] = useState(false);

  let proverbs = props.proverbProvider.GetAllOneLiners();
  let proverbDisplay :any = proverbs.slice(0, 30).map((prov:IProverb) =>{
    return (<Proverb key={prov.ID} Proverb={prov}></Proverb>);
  });

  return (
    <IonPage>
    <IonPopover isOpen={showPopover} onDidDismiss={e => setShowPopover(false)}>
        <p>This is popover content</p>
     </IonPopover>
      <IonHeader>

          <IonToolbar>
              <IonButtons slot={"start"}>
                <IonButton onClick={() => setShowPopover(true)}>
                  <IonIcon slot = "icon-only" icon = {book} />
                </IonButton>
              </IonButtons>

              <IonTitle>Library</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar></IonSearchbar>
          </IonToolbar>
      </IonHeader>
      <IonContent>
        {proverbDisplay}
      </IonContent>
    </IonPage>
  );
};

export default Library;
