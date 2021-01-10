//SIDE BAR THAT SLIDES IN FROM THE LEFT (AFTER CLICKING ON FOLDER FROM LIBRARY TAB)
import React, {useCallback, useEffect, useState} from 'react';
import {
    IonMenu,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonMenuToggle,
    IonReorder,
    IonReorderGroup,
    useIonViewWillEnter,
    IonAlert
} from '@ionic/react';

import {folder, notifications, notificationsOutline, notificationsCircleOutline, trashOutline, notificationsCircle} from 'ionicons/icons';
import FolderMode from '../components/FolderModes';
import FolderPanel from '../components/FolderPanel';
import StorageAssistant, { IFolder } from '../api/StorageAssistant';
import "./Bookmarked.css";
import ProverbView from '../components/ProverbView';
import ContentManager from '../api/ContentManager';
import { IModel } from '../api/Interfaces';
import { IonSpinner } from '@ionic/react';
import NotificationsButton from '../components/NotificationsButton';
import NotificationsAssistant from '../api/NotificationsAssistant';
import SetNotifications from '../components/SetNotifications';

type IProps = {
    contentManager: ContentManager
}

export type NotificationSettings = {
    fromTime: number,
    toTime: number,
    frequency: number
}

const Bookmarked: React.FC<IProps> = (props) => {

// State hooks
    const [folderMode, setFolderMode] = useState(FolderMode.browse); // "browse", "edit", "set-notifications"
    const [folderContext, setFolderContext] = useState<IFolder | null>(null); // let null = favorites folder
    const [model, setModel] = useState<IModel | undefined>(undefined);
    const [folders, setFolders] = useState<Array<IFolder>>([]);
    const [newFolderPromptActivated, setNewFolderPromptActivated] = useState(false);
    const [deleteActivated, setDeleteActivated] = useState<IFolder | undefined>(undefined);
    // Notifications modal and settings
    const [isNotificationsModalShown, setIsNotificationsModalShown] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | undefined>(undefined);


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
    
    const refreshComponentModels = useCallback(() => {

        // normal folder
        if (folderContext) {
            props.contentManager.CacheFilters("PreBookmark");
            props.contentManager.ClearFiltersNoRefresh()
            StorageAssistant.getFolderVerseIds(folderContext)
            .then((verseIds) => {
                console.log("Verse IDs: ", verseIds);
                props.contentManager.ApplyFilter("ByFolder", verseIds)
                setModel(props.contentManager.GetModel())
                props.contentManager.RestoreFilters("PreBookmark");
            });
        }

        // favorites folder
        else {
            props.contentManager.CacheFilters("PreBookmark");
            props.contentManager.ClearFiltersNoRefresh()
            props.contentManager.ApplyFilter("BySaved", props.contentManager.IsBookmarked);
            setModel(props.contentManager.GetModel())
            props.contentManager.RestoreFilters("PreBookmark");
        }
    }, [folderContext, props.contentManager]);

    
    // update folder list
    useIonViewWillEnter(() => {
        console.log("----folder context: ", folderContext);
        refreshComponentModels();
        refreshFolders();

    });

    useEffect(() => {
        refreshComponentModels();
    }, [folderContext, refreshComponentModels])

    // retrieve the notification settings
    useEffect(() => {
        const na = new NotificationsAssistant();

        // retrieve end, start, and frequency
        (async () => ({toTime: await na.GetEnd(), fromTime: await na.GetStart(), frequency: await na.GetFrequency()}))()
        .then((settings) => {
            console.log("SETTING SETTINGS!") //- wrong
            setNotificationSettings(settings);
        })
        .catch(() => {
            setNotificationSettings(undefined);
        })
    }, []);

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
        .then(folder => {
            const maxOrder = Math.max(...folders.map(f => f.order));
            const cappedTo = Math.min(maxOrder,event.detail.to);  // At times "to" is one greater than max order. cap at max order 
            return StorageAssistant.reorderFolders(folder, cappedTo);
        })
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

    let pageRef = React.createRef<any>();

    // The alert that appears when creating a new folder
    const createNewFolderAlert = (
        <IonAlert
            isOpen={newFolderPromptActivated}
            onDidDismiss={(dismiss:any) => {
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
                handler: (dismiss:any) => {
                    createFolder(dismiss["folderName"]);
                }
                }
            ]}
        />
    );
    
    // The alert that appears when deleting a folder
    const deleteFolderAlert = (
        <IonAlert
            isOpen={deleteActivated !== undefined}
            onDidDismiss={(dismiss:any) => {
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
    );
    
    let [fromTimeString, toTimeString, frequencyString] = ["","",""];

    // convert from military time to standard am/pm time string
    const computeTimeString = (time: number) => {
        // calculate from time
        const timeHourMilitary = Math.floor(time/100);
        const [timeHour, fromPeriod] = ((timeHourMilitary <= 12) ? [(timeHourMilitary === 0) ? 12 : timeHourMilitary, "am"]
            : [timeHourMilitary-12, "pm"]);
        const timeMinute = ("0000000" + Math.floor(time%100)).substr(-2); // leading 0s, 2 digits
        return `${timeHour}:${timeMinute}${fromPeriod}`;
    }

    // get notification info
    
    if (notificationSettings) {

        const {fromTime, toTime, frequency} = notificationSettings;
        // compute time strings
        fromTimeString = computeTimeString(fromTime);
        toTimeString = computeTimeString(toTime);
        frequencyString = frequency.toString();
    }
    
    // displays info on current notification settings & the set notification button
    // THIS IS WHERE THE NOTIF TEXT IS DETERMINED.
    const setNotificationsInfo = (
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
            {
                (notificationSettings) ? (
                    <p style={{
                        width: "70%",
                        fontSize: "0.75em",
                        textAlign: "center",
                        fontStyle: "italic",
                        color: "#777"
                    }}>Proverb notifications are set from {fromTimeString} to {toTimeString}, {frequencyString} times daily.</p>
                ) : (null)
            }
            <NotificationsButton onClick={() => setIsNotificationsModalShown(true)}/>
        </div>
    )
    
    
    const folderSideMenu = (
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

                    {/* Heart folder */}
                    <IonItem
                            button
                            detail={(folderMode === FolderMode.browse)}
                            disabled={(folderMode !== FolderMode.browse)}
                            onClick={() => {
                                if (folderMode === FolderMode.browse) {
                                    setFolderContext(null);
                                }
                            }}
                            color={(folderContext === null) ? "light" : ""}
                        >
                            <IonLabel>
                                Favorites
                            </IonLabel>
                        </IonItem>
                    <IonReorderGroup disabled={folderMode !== FolderMode.edit} onIonItemReorder={reorderFolders} className="folder-list">
                        
                        {
                            
                            folders.map(folder => {
                                return (
                                    <IonItem
                                    button
                                    detail={(folderMode === FolderMode.browse)}
                                    key={folder.id}
                                    color={(folderContext === folder) ? "light" : ""}
                                        onClick={() => {
                                            if (folderMode === FolderMode.browse)
                                            {
                                                setFolderContext(folder);
                                            }
                                        }}
                                    >
                                        <IonIcon
                                            icon={ (folder.notificationsOn) ? notificationsCircle : notificationsCircleOutline } 
                                            onClick={ (e:any) => { toggleFolderNotifications(folder, e) }}
                                            className={`notification-default ${(folderMode === FolderMode.updateNotifications) ? 'notification-revealed' : ''}`}>
                                        </IonIcon>
                                        <IonIcon icon={trashOutline} onClick={(e:any)=>{triggerDelete(folder, e)}}
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
                {setNotificationsInfo}
            </IonContent>
        </IonMenu>
    );

    return (
        <>
            <IonPage className={"bookmarked-page"} ref={pageRef}>

                {/* Alerts */}
                {createNewFolderAlert}
                {deleteFolderAlert}

                {/* Modal */}
                <SetNotifications
                    isModalShown={isNotificationsModalShown}
                    setIsModalShown={setIsNotificationsModalShown}
                    setNotificationSettings={setNotificationSettings}
                    contentManager={props.contentManager}/>

                {/* Folder Menu */}
                {folderSideMenu}

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
                        <IonTitle> Bookmarks</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {
                        (!model) ?
                        <div style={{
                            display:"flex",
                            flexDirection: "column",
                            paddingTop: "2em"
                            }}>
                            <IonSpinner style={{alignSelf:"center"}}/>
                        </div>
                        :
                        <ProverbView
                            containerPageRef={pageRef}
                            componentModels={model.ComponentModels}
                            contentManager={props.contentManager}
                            refreshComponentModels={refreshComponentModels}
                            heartAndVanish={(folderContext === null) ? true : undefined}
                        />
                    }
                    
                </IonContent>
            </IonPage>
        </>
    );
};

export default Bookmarked;
