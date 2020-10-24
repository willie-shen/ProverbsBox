import { IonButton, IonGrid, IonList, IonModal, IonRow, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent} from '@ionic/react';
import React, { useEffect, useState } from 'react'
import ContentManager from '../api/ContentManager';
import Indexer from '../api/Indexer';
import { IArticle, IComponentModel, ILibraryContext, ISaying, IStatement, IVerse } from '../api/Interfaces';
import StorageAssistant, { IFolder } from '../api/StorageAssistant';
import { Article } from './Article';
import { Saying } from './Saying';
import { Statement } from './Statement';

import {FolderCheckbox} from './FolderCheckbox';

type IProps = {
  componentModels: IComponentModel[],
  contentManager: ContentManager,
  refreshComponentModels: ()=>void,
  containerPageRef: React.RefObject<any>,
  context?: ILibraryContext,
  heartAndVanish?: Boolean
}

const ProverbView : React.FC<IProps> = (props) => {

  //states (init viewFolder to null)  
    //Iprops: checks types. 
    //strongly typed = put a dot 
    //types can be objects or primitives. 
    //const numArray: number[] = {1,2,3,4}; or Array<number> or Array<number | string> <---"union"

  const [viewFolderModal, setViewFolderModal] = useState<IVerse | null>(null); // null for closed, IFolder for open
  const [folders, setFolders] = useState<Array<IFolder>>([]);

  // refresh folders hook
  useEffect(() => {
    refreshFolders();
  }, [props.context, props.componentModels])

  const refreshFolders = () => {
    console.log('folders refreshed: ' + StorageAssistant.getFolders())
    StorageAssistant.getFolders()
    .then(folders => folders.sort((folder1, folder2) => folder1.order - folder2.order))
    .then(sortedFolders => setFolders(sortedFolders));
  }

  // store heart to memory
  const heartHandler = (statementModel : IStatement) => {
    if (statementModel.Saved) {
        console.log("Removing heart");
        props.contentManager.RemoveBookmark(
            {
                Chapter: statementModel.Verse.Chapter,
                VerseNumber: statementModel.Verse.VerseNumber
            }
        );
    } else {
        console.log("adding heart");
        props.contentManager.Bookmark(
            {
                Chapter: statementModel.Verse.Chapter,
                VerseNumber: statementModel.Verse.VerseNumber
            }
        );
    }
    props.refreshComponentModels();
  }

  /* Verse model for saving verse in folder */
  const openVerseOptions = (verse: IVerse) => {
    refreshFolders(); //Refresh folders every time we open the Verse model
    setViewFolderModal(verse);
  }

  // Generate Verse Components
  let elements : Array<{
      key: number,
      element: JSX.Element
  }> = props.componentModels.map((c) => {

    // Article
    if (c.Type === "Article")
    {
        const keyVerse = (c.Model as IArticle).Verses[0];
        if (!props.context) throw Error("Attempting to display an article without passing an ILibraryContext into ProverbView");
        return ({
            key: Indexer.GetVerseID(keyVerse.Chapter, keyVerse.VerseNumber),
            element: (<Article ctx={props.context} model={(c.Model as IArticle)}></Article>)
        });
    }

    // Statement                                                                  // This is what's important!
    else if (c.Type === "Statement")
    {
        const statementModel = (c.Model as IStatement);
        return ({
            key: Indexer.GetVerseID(statementModel.Verse.Chapter, statementModel.Verse.VerseNumber),
            element: (
                <div style={{width: "20em"}} >
                <Statement
                    model={statementModel}
                    heartCallback={() => {heartHandler(statementModel)}}
                    openVerseOptions={() => {openVerseOptions(statementModel.Verse);}}
                    searchHighlights={statementModel.Verse.SearchHighlights}
                    heartAndVanish={(props.heartAndVanish !== undefined) ? true : false}
                    >
                </Statement>
                </div>)
        });
    }

    // Saying (Currently disabled)
    else
    {
        const keyVerse = (c.Model as ISaying).Verses[0];
        return ({
            key: Indexer.GetVerseID(keyVerse.Chapter, keyVerse.VerseNumber),
            element: (<Saying model={(c.Model as ISaying)}></Saying>)
        });
    }
  });



  return (
    <>
      {/* Modal to view popup folders */}
      <IonModal
          isOpen={(viewFolderModal !== null)}
          swipeToClose={true}
          presentingElement={props.containerPageRef.current}
          onDidDismiss={()=>{setViewFolderModal(null)}}>
          <IonHeader>
              <IonToolbar>
                  <IonTitle>Folders</IonTitle>
                  <IonButtons slot="end">
                      <IonButton onClick={()=>{setViewFolderModal(null)}}>Close</IonButton>
                  </IonButtons>
              </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
              <div id={"parentmodeldiv"}>
                  <IonList>
                    {
                      folders.map((f, index) => {
                        const chapter = (viewFolderModal !== null) ? viewFolderModal.Chapter : 0;
                        const verse = (viewFolderModal !== null) ? viewFolderModal.VerseNumber : 0;
                        const verseSignature = Indexer.GetVerseSignature(Indexer.GetVerseID(chapter, verse));

                        return (
                          <FolderCheckbox key={index} folder={f} verseSignature={verseSignature}></FolderCheckbox>
                        )
                      })
                    }
                  </IonList>
              </div>
          </IonContent>
      </IonModal>

      <IonGrid>
        {
          elements.map(component => (
            <IonRow key={component.key} className={"ion-justify-content-center"}>
                {component.element}
            </IonRow>
          ))
        }
      </IonGrid>
    </>
  );
}

export default ProverbView;
