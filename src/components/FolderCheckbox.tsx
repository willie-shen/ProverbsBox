import React, {useState, useEffect} from 'react';
import { IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import StorageAssistant, { IFolder } from '../api/StorageAssistant';
import { IVerseSignature } from '../api/Interfaces';

type props = {
    folder: IFolder,
    verseSignature: IVerseSignature
}

export const FolderCheckbox: React.FC<props> = ({folder, verseSignature}) => {

    const [verseCheckedState, setVersePresentState] = useState(true);

    useEffect(() => {
        const getFolderSignatureList = async () => {
            const folderSignatureList = await StorageAssistant.getFolderVerseIds(folder);
            setVersePresentState(folderSignatureList.some(verseID => verseID.Chapter === verseSignature.Chapter 
                && verseID.VerseNumber === verseSignature.VerseNumber));
        };
        getFolderSignatureList();
    }, [folder, verseSignature])

    const toggleVerseCheckedState = () => {
        if (verseCheckedState) {
            setVersePresentState(false);
            StorageAssistant.removeVerseToFolder(folder, verseSignature)
            console.log("Removed verse");
        } else {
            setVersePresentState(true);
            StorageAssistant.addVerseToFolder(folder, verseSignature)
            console.log("Added verse");
        }
    }

    return (
        <IonItem>
            <IonLabel onClick={ () => {}}>
                <h2>{folder.name}</h2>
            </IonLabel>
            <IonCheckbox color="dark" slot="end" checked={verseCheckedState} //checked should be true or false if verse is in folder 
            onClick={toggleVerseCheckedState}></IonCheckbox>
        </IonItem>
    )

}