import React, {useState} from 'react';
import {
    IonMenu,
    IonPopover,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonMenuToggle
} from '@ionic/react';

import { Plugins } from '@capacitor/core';

import {funnel, folder} from 'ionicons/icons'
const Bookmarked: React.FC = () => {

    const [showPopover, setShowPopover] = useState(false);
    return (
        <>
            <IonPage>
                {/* Folder Menu */}
                <IonMenu side="start" contentId="folders-menu-content">
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonTitle>Folder</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent id="folders-menu-content">
                        <IonList>
                            <IonItem>Wisdom Verses</IonItem>
                            <IonItem>Stewardship Verses</IonItem>
                            <IonItem>Menu Item</IonItem>
                            <IonItem>Menu Item</IonItem>
                            <IonItem>Menu Item</IonItem>
                        </IonList>
                    </IonContent>
                </IonMenu>

                {/* Bookmarks Page */}
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuToggle>
                                <IonButton>
                                    <IonIcon slot="icon-only" icon={folder} />
                                </IonButton>
                            </IonMenuToggle>
                        </IonButtons>
                        <IonTitle> Bookmarks </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

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

                    <IonMenuToggle><IonButton expand="full">Open Menu</IonButton></IonMenuToggle>
                    <IonButton expand="full" onClick={() => setShowPopover(true)}>
                        Open Popover
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
