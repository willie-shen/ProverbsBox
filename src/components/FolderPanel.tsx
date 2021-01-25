import { IonButton } from '@ionic/react';
import React, {useEffect, useState} from 'react';
import FolderMode from '../components/FolderModes';
import "./FolderPanel.scss"

type IFolderPanelProps = {
    folderMode: FolderMode // "browse", "edit", "notifications"
    toggleAll: (on:boolean)=>void
    createFolder: ()=>void
}

const FolderPanel: React.FC<IFolderPanelProps> = (props:IFolderPanelProps) => {

    // constants
    const collapseAnimationTime = 500; // ms

    // state
    const [blink, setBlink] = useState(false);
    const [displayFolderMode, setDisplayFolderMode] = useState(FolderMode.browse); // updates after animation
    const [collapsePanel, setCollapsePanel] = useState(true);

    // animated update folder display modes
    useEffect(() => {
        const oldMode = displayFolderMode;
        const newMode = props.folderMode;

        // animated update required
        if (oldMode !== newMode) {

            // collapse required
            if (oldMode !== FolderMode.browse) {
                setCollapsePanel(true);
            };
            
            // how long to wait for collapse
            const waitTime = (oldMode === FolderMode.browse) ? 0 : collapseAnimationTime; // immidiate popout, vs delay
            
            // wait for collapse
            setTimeout(() => {
                // set the new display mode after collapse
                setDisplayFolderMode(newMode);
                // uncollapse if not in browse mode
                if (newMode !== FolderMode.browse) {
                    setCollapsePanel(false);
                    console.log("uncollapse");
                }
            }, waitTime);
        }
    }, [props.folderMode, displayFolderMode]);

    const startBlink = () => {
        setBlink(true);
        setTimeout(() => {setBlink(false);}, 1000); // debounce the button
    }

    const StaticPanel = () => {
        if (displayFolderMode === FolderMode.updateNotifications) {
            return (
            <div className={`select-all-default`}>
                <div className="half-container-left">
                    <IonButton mode={"ios"} fill="clear" expand="block" size="small"
                        onClick={()=>{props.toggleAll(true);}}>Select All</IonButton>
                </div>
                <div className="half-container-right">
                    <IonButton mode={"ios"} fill="clear" expand="block" size="small"
                        onClick={()=>{props.toggleAll(false);}}>Deselect All</IonButton>
                </div>
            </div>);
        }
        else if (displayFolderMode === FolderMode.edit) {
            return (
                <div className={`new-folder ${(blink) ? "blink" : ""}`}
                    onClick={() => {startBlink(); props.createFolder();}}>
                    <h3>New Folder</h3>
                </div>
            );
        }
        else return (null);
    }

    return (
        <div className="folder-panel">
            <div className={`default ${(collapsePanel) ? "collapse" : ""}`}>
                <StaticPanel/>
            </div>
        </div>
        
    )
    
    /*return (<>
        <div className={`select-all-default ${props.folderMode === FolderMode.updateNotifications ? "select-all-revealed" : ""}`}>
            <div className="half-container-left">
                <IonButton mode={"ios"} fill="clear" expand="block" size="small">Select All</IonButton>
            </div>
            <div className="half-container-right">
                <IonButton mode={"ios"} fill="clear" expand="block" size="small">Deselect All</IonButton>
            </div>
        </div>
        <div className={`new-folder-default 
            ${(props.folderMode === FolderMode.edit) ? "new-folder-hidden" : ""}
            ${(blink) ? "blink" : ""}`
        }
            onClick={() => {startBlink(); props.createFolder();}}>
            <h3>New Folder</h3>
        </div>
    </>);*/
}

export default FolderPanel;