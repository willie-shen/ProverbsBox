import React, {useState} from 'react';
import {
    IonMenu,
    IonPopover,
    IonSearchbar,
    IonIcon,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar, IonRouterOutlet, IonButtons, IonMenuButton
} from '@ionic/react';

import { Plugins } from '@capacitor/core';

import {funnel} from 'ionicons/icons'
const Bookmarked: React.FC = () => {

    const [showPopover, setShowPopover] = useState(false);
    return (
        <>
            <IonPage>

                <IonPopover isOpen={showPopover} onDidDismiss={e => {
                    setShowPopover(false);
                    Plugins.LocalNotifications.schedule({
                        notifications:[{
                        title:'title',
                        body:'text',
                        id:1,
                        schedule: { at: new Date(Date.now() + 10) }
                    }]
                    });
                }}>
                <p>This is popover</p>
                </IonPopover>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowPopover(true)}>
                                <IonIcon icon = {funnel}/> {/*https://github.com/ionic-team/ionic/issues/18847*/}
                            </IonButton>
                        </IonButtons>
                        <IonMenuButton menu={"first"}><IonIcon icon = {funnel}/></IonMenuButton>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonButton>
                        Open Folders
                    </IonButton>

                    <IonList>
                        <IonItem routerLink="/bookmarked/details">
                            <IonLabel>
                                <h2>Go to detail</h2>
                            </IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Bookmarked;
