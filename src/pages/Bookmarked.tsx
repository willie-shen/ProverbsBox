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
    IonTitle,
    IonMenuToggle
} from '@ionic/react';

import { Plugins } from '@capacitor/core';

import {folder, notifications, notificationsOutline, notificationsCircleOutline} from 'ionicons/icons';
import "./Bookmarked.css";

import NotificationsAssistant from "../api/NotificationsAssistant"
import {IVerse} from "../api/Interfaces"



const Bookmarked: React.FC = () => {

    const [showPopover, setShowPopover] = useState(false);
    const [notificationToggle, setNotificationToggle] = useState(false);
    const [newFolderMode, setNewFolderMode] = useState(false);
    return (
        <>
            <IonPage className={"bookmarked-page"}>

                {/* Folder Menu */}
                <IonMenu side="start" contentId="folders-menu-content">
                    <IonHeader mode={"md"}>
                        <IonToolbar color="primary">
                            <IonButtons slot="start">
                                <IonButton>
                                    <IonIcon icon={folder} />
                                </IonButton>
                            </IonButtons>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setNotificationToggle(!notificationToggle)}>
                                    {
                                        (notificationToggle) ? <IonIcon icon={notifications}/>
                                                             : <IonIcon icon={notificationsOutline}/>
                                    }
                                </IonButton>
                            </IonButtons>
                            <IonTitle slot="start">Folder</IonTitle>
                        </IonToolbar>
                        <div className={`select-all-default ${notificationToggle ? "select-all-revealed" : ""}`}>
                            <div className="half-container-left">
                                <IonButton mode={"ios"} fill="clear" expand="block" size="small">Select All</IonButton>
                            </div>
                            <div className="half-container-right">
                                <IonButton mode={"ios"} fill="clear" expand="block" size="small">Deselect All</IonButton>
                            </div>
                        </div>
                        <div className={`new-folder-default 
                            ${(notificationToggle) ? "new-folder-hidden" : ""}
                            ${(newFolderMode) ? "blink" : ""}`
                        }
                            onClick={() => {setNewFolderMode(true); console.log("entering new folder mode.")}}>
                            <h3>New Folder</h3>
                        </div>
                    </IonHeader>
                    <IonContent id="folders-menu-content" onClick={()=>{console.log("clicked!!!")}}>
                        <div className="category-list-container ion-activateable" style={{pointerEvents: "auto"}}>
                            <IonList className="folder-list">
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Wisdom Verses
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Stewardship Verses
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Menu Item
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Stewardship Verses
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Menu Item
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Stewardship Verses
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Menu Item
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Stewardship Verses
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Menu Item
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Stewardship Verses
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Menu Item
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Menu Item
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Stewardship Verses
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(notificationToggle) ? 'notification-revealed' : ''}`}></IonIcon>
                                    Menu Item
                                </IonItem>
                            </IonList>
                        </div>
                        <div className={"button-holder"}>
                            <IonButton shape={"round"} class={"set-notification-button"}>Set Notifications</IonButton>  
                        </div>
                        
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

                        //Use this popover to test the notification temporarily
                        
                        console.log("Pop")

                        //Use this popover to test the notification temporarily
                        let notificationAssistant = new NotificationsAssistant();
                        
                        //get current date
                        var d = new Date();

                        //start is the current time + some constant
                        var start = d.getHours() * 100 + d.getMinutes() + 1;

                        //end is the start plus some random time 
                        var end = start + 1;

                        //var verses:IVerse[] = [];

                        var verses = [{Chapter:1, VerseNumber:10, Content:"My son, if sinful men entice you, do not give in to them"},
        {Chapter:1, VerseNumber:15, Content: "my son, do not go along with them, do not set foot on their paths"}
        ]

                       
                        notificationAssistant.BakeNotification(2, start, end, verses);




                        /*Plugins.LocalNotifications.schedule({
                            notifications:[{
                            title:'title',
                            body:'text',
                            id:1,
                            schedule: { at: new Date(Date.now() + 10) }
                        }]
                        })*/

          
                    }} >
                 
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
