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
    IonMenuToggle, IonReorder, IonReorderGroup, useIonViewWillEnter, IonAlert
} from '@ionic/react';

import { Plugins } from '@capacitor/core';

import {folder, notifications, notificationsOutline, notificationsCircleOutline, trashOutline, notificationsCircle} from 'ionicons/icons';
import FolderMode from '../components/FolderModes';
import FolderPanel from '../components/FolderPanel';
import StorageAssistant, { IFolder } from '../api/StorageAssistant';
import "./Bookmarked.css";

const Bookmarked: React.FC = () => {

    const [showPopover, setShowPopover] = useState(false);
    const [folderMode, setFolderMode] = useState(FolderMode.browse); // "browse", "edit", "set-notifications"
    const [folders, setFolders] = useState<Array<IFolder>>([]);
    const [newFolderPromptActivated, setNewFolderPromptActivated] = useState(false);
    const [deleteActivated, setDeleteActivated] = useState<IFolder | undefined>(undefined);

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
    useIonViewWillEnter(() => {
        refreshFolders()
    });

    // create a new folder
    const createFolder = (folderName:string) => {
        console.log("create folder with name: ", folderName);
        StorageAssistant.createFolder(folderName)
        .then(() => {
            refreshFolders();
        });
        return;
    }

    const refreshFolders = () => {
        StorageAssistant.getFolders()
        .then(folders => folders.sort((folder1, folder2) => folder1.order - folder2.order))
        .then(sortedFolders => setFolders(sortedFolders));
    }

    const reorderFolders = (event: CustomEvent) => {
        console.log("reorder event: ", event);
        StorageAssistant.getFolders()
        .then(folders => {
            const found = folders.find(folder => folder.order === event.detail.from);
            if (!found) throw new Error("Folder not found in re-order");
            return found;
        })
        .then(folder => StorageAssistant.reorderFolders(folder, event.detail.to))
        .then(() => {
            refreshFolders();
            event.detail.complete();
        })
    }

    const triggerDelete = (folder: IFolder, e:React.MouseEvent) => {
        setDeleteActivated(folder);
        e.stopPropagation();
    }

    const deleteFolder = () => {
        if (!deleteActivated) throw new Error("cannot delete folder");
        StorageAssistant.deleteFolder(deleteActivated)
        .then(() => {
            setDeleteActivated(undefined);
            refreshFolders();
        })
    }

    const toggleFolderNotifications = (folder : IFolder, e : React.MouseEvent) => {
        e.stopPropagation();

        StorageAssistant.setFolderNotifications(folder, !folder.notificationsOn)
        .then(() => {
            refreshFolders();
        })
    }

    const toggleAllNotifications = (on : boolean) => {
        
        folders.reduce(async (prevPromise, folder) => {
            await prevPromise;
            return StorageAssistant.setFolderNotifications(folder, on);
        }, Promise.resolve())
        .then(() => {
            refreshFolders();
        });
    }

    return (
        <>
            <IonPage className={"bookmarked-page"}>

                <IonAlert
                    isOpen={newFolderPromptActivated}
                    onDidDismiss={(dismiss) => {
                        setNewFolderPromptActivated(false)
                    }}
                    header={'Create a New Folder'}
                    inputs={[
                        {
                        name: 'folderName',
                        type: 'text',
                        placeholder: 'name'
                        },
                    ]}
                    buttons={[
                        {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        },
                        {
                        text: 'Ok',
                        handler: (dismiss) => {
                            createFolder(dismiss["folderName"]);
                        }
                        }
                    ]}
                />

                <IonAlert
                    isOpen={deleteActivated !== undefined}
                    onDidDismiss={(dismiss) => {
                        setDeleteActivated(undefined)
                    }}
                    header={`Are you sure you would like to delete "${(deleteActivated) ? deleteActivated.name : ""}?"`}
                    buttons={[
                        {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            console.log('Confirm Cancel');
                        }
                        },
                        {
                        text: 'Ok',
                        handler: () => {
                            deleteFolder();
                        }
                        }
                    ]}
                />

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
                        <FolderPanel toggleAll={toggleAllNotifications} createFolder={() => setNewFolderPromptActivated(true)} folderMode={folderMode}/>
                    </IonHeader>
                    <IonContent id="folders-menu-content" onClick={()=>{console.log("clicked!!!")}}>
                        <div className="category-list-container ion-activateable" style={{pointerEvents: "auto"}}>
                            <IonReorderGroup disabled={folderMode !== FolderMode.edit} onIonItemReorder={reorderFolders} className="folder-list">

                                {
                                    folders.map(folder => {
                                        return (
                                            <IonItem button detail key={folder.id}>
                                                <IonIcon
                                                    icon={ (folder.notificationsOn) ? notificationsCircle : notificationsCircleOutline } 
                                                    onClick={ (e) => { toggleFolderNotifications(folder, e) }}
                                                    className={`notification-default ${(folderMode === FolderMode.updateNotifications) ? 'notification-revealed' : ''}`}>
                                                </IonIcon>
                                                <IonIcon icon={trashOutline} onClick={(e)=>{triggerDelete(folder, e)}}
                                                    className={`delete-default ${(folderMode === FolderMode.edit) ? 'delete-revealed' : ''}`}
                                                />
                                                <IonLabel>
                                                    {folder.name}
                                                </IonLabel>
                                                <IonReorder slot="end" />
                                            </IonItem>
                                        )
                                    })
                                }                                
                            </IonReorderGroup>
                        </div>
                        <div style={{
                                display: "flex",
                                flexDirection: "column",
                                position: "fixed",
                                paddingBottom: "1.25em",
                                bottom: 0,
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            className={(folderMode===FolderMode.updateNotifications) ? "visible" : "hidden"}
                            >
                            <p style={{
                                width: "70%",
                                fontSize: "0.75em",
                                textAlign: "center",
                                fontStyle: "italic",
                                color: "#777"
                            }}>Proverb notifications are set from 5:00am to 7:00pm, 5 times daily.</p>
                            <div className={`button-holder`}>
                                <IonButton shape={"round"} class={"set-notification-button"}>Set Notifications</IonButton>  
                            </div>
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
