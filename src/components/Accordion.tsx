import React, {useState, useRef} from 'react';
import { IonIcon, IonList, IonLabel, IonItem } from '@ionic/react';
import StorageAssistant, { IFolder } from '../api/StorageAssistant';
import {chevronForwardOutline} from 'ionicons/icons';

import "./Accordion.css"

type props = {
    folder: IFolder
}

export const Accordion: React.FC<props> = ({folder}) => {

    const [folderState, setFolderState] = useState("inactive");
    const [heightState, setHeightState] = useState("0px");

    const folderContent = useRef<HTMLDivElement>(null);

    function toggleAccordion() {
        setFolderState(folderState === "inactive" ? "active" : "inactive");
        if (null !== folderContent.current) {
            setHeightState(heightState === "0px" ? `${folderContent.current.scrollHeight}px` : "0px")
        }
    }

    return (
        <div className="accordion-section">
            <button className={`accordion-title ${folderState}`} onClick={toggleAccordion}>
            <h5>{folder.name}</h5>
                <IonIcon className={folderState==="active" ? 'accordion-icon rotate': 'accordion-icon'} 
                icon={chevronForwardOutline} size="small"></IonIcon>
            </button>
            <div ref={folderContent} style={{maxHeight: `${heightState}`}} className="accordion-content">
                <IonList>
                    <IonItem>
                        <IonLabel><h2>Proverbs 1:1</h2></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><h2>Proverbs 1:2</h2></IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel><h2>Proverbs 1:3</h2></IonLabel>
                    </IonItem>
                </IonList>
            </div>
        </div>
    );
};