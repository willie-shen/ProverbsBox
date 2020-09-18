import React, {useEffect, useState} from 'react';
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
    IonMenuToggle, IonReorder, IonReorderGroup
} from '@ionic/react';

import { Plugins } from '@capacitor/core';

import {folder, notifications, notificationsOutline, notificationsCircleOutline} from 'ionicons/icons';
import FolderMode from '../components/FolderModes';
import "./Bookmarked.css";
import FolderPanel from '../components/FolderPanel';
import StorageAssistant, { IFolder } from '../api/StorageAssistant';

const Bookmarked: React.FC = () => {

    const [showPopover, setShowPopover] = useState(false);
    const [folderMode, setFolderMode] = useState(FolderMode.browse); // "browse", "edit", "set-notifications"
    const [folders, setFolders] = useState<Array<IFolder>>([]);

    // turn on edit folder mode
    const toggleEditMode = () => {
        if (folderMode !== FolderMode.edit) {
            setFolderMode(FolderMode.edit);
        }
        else {
            setFolderMode(FolderMode.browse);
        }
    }

    // turn on update notifications mode
    const toggleNotificationsMode = () => {
        if (folderMode !== FolderMode.updateNotifications) {
            setFolderMode(FolderMode.updateNotifications);
        }
        else {
            setFolderMode(FolderMode.browse);
        }
    }

    // update folder list
    useEffect(() => {
        const s = new StorageAssistant();
        const fetchFoldersAsync = async () => {
            console.log("waiting to get folders");
            const folders = await s.getFolders();
            console.log("folders aquired!");
            const sortedFolders = folders.sort((folder1, folder2) => folder1.order - folder2.order);
            setFolders(sortedFolders);
        };

        console.log("calling fetch folders async");
        fetchFoldersAsync();
        /*const s = new StorageAssistant();
        .then(folders => {

            // sort the folders by order
            //const sortedFolders = folders.sort((folder1, folder2) => folder1.order - folder2.order);
            setFolders(folders)
        });*/
    });

    // create a new folder
    const createFolder = () => {
        return;
    }

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
                                <IonButton onClick={toggleNotificationsMode}>
                                    {
                                        (folderMode === FolderMode.updateNotifications) ? <IonIcon icon={notifications}/>
                                                             : <IonIcon icon={notificationsOutline}/>
                                    }
                                </IonButton>
                            </IonButtons>
                            <IonButtons slot="primary">
                                <IonButton onClick={toggleEditMode}>Edit</IonButton>
                            </IonButtons>
                            <IonTitle slot="start">Folders</IonTitle>
                        </IonToolbar>
                        <FolderPanel createFolder={createFolder} folderMode={folderMode}/>
                        {/*
                            folderMode !== "browse" &&
                            <>
                                <div className={`select-all-default ${notificationToggle ? "select-all-revealed" : ""}`}>
                                    <div className="half-container-left">
                                        <IonButton mode={"ios"} fill="clear" expand="block" size="small">Select All</IonButton>
                                    </div>
                                    <div className="half-container-right">
                                        <IonButton mode={"ios"} fill="clear" expand="block" size="small">Deselect All</IonButton>
                                    </div>
                                </div>
                                <div className={`new-folder-default 
                                    ${(folderMode !== "edit") ? "new-folder-hidden" : ""}
                                    ${(newFolderMode) ? "blink" : ""}`
                                }
                                    onClick={() => {setNewFolderMode(true); console.log("entering new folder mode.")}}>
                                    <h3>New Folder</h3>
                                </div>
                            </>*/
                        }

                    </IonHeader>
                    <IonContent id="folders-menu-content" onClick={()=>{console.log("clicked!!!")}}>
                        <div className="category-list-container ion-activateable" style={{pointerEvents: "auto"}}>
                            <IonReorderGroup disabled={folderMode !== FolderMode.edit} className="folder-list">

                                {/*
                                    folders.map(folder => {
                                        return (
                                            <IonItem button detail key={folder.id}>
                                                <IonIcon icon={notificationsCircleOutline}
                                                    className={`notification-default ${(folderMode === FolderMode.updateNotifications) ? 'notification-revealed' : ''}`}>
                                                </IonIcon>
                                                <IonLabel>
                                                    {folder.name}
                                                </IonLabel>
                                                <IonReorder slot="end" />
                                            </IonItem>
                                        )
                                    })*/
                                }
                                
                                <IonItem button detail>
                                    <IonLabel><IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(folderMode === FolderMode.updateNotifications)  ? 'notification-revealed' : ''}`}></IonIcon>
                                        Favorite
                                    </IonLabel>
                                </IonItem>
                                <IonItem button detail>
                                    <IonLabel><IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(folderMode === FolderMode.updateNotifications)  ? 'notification-revealed' : ''}`}></IonIcon>
                                        Favorite
                                    </IonLabel>
                                </IonItem>
                                <IonItem button detail>
                                    <IonIcon icon={notificationsCircleOutline}
                                        className={`notification-default ${(folderMode === FolderMode.updateNotifications)  ? 'notification-revealed' : ''}`}></IonIcon>
                                    Stewardship Verses
                                </IonItem>
                                
                            </IonReorderGroup>
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
