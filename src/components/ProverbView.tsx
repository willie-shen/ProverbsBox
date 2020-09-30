import { IonGrid, IonRow } from '@ionic/react';
import React from 'react'
import ContentManager from '../api/ContentManager';
import Indexer from '../api/Indexer';
import { IArticle, IComponentModel, ILibraryContext, ISaying, IStatement } from '../api/Interfaces';
import { Article } from './Article';
import { Saying } from './Saying';
import { Statement } from './Statement';

type IProps = {
  componentModels: IComponentModel[],
  contentManager: ContentManager,
  refreshComponentModels: ()=>void,
  openVerseOptions: (id:number)=>void,
  context?: ILibraryContext
}

const ProverbView : React.FC<IProps> = (props) => {
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

    // Statement
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
                    openVerseOptions={props.openVerseOptions}
                    searchHighlights={statementModel.Verse.SearchHighlights}
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
    <IonGrid>
      {
        elements.map(component => (
          <IonRow key={component.key} className={"ion-justify-content-center"}>
              {component.element}
          </IonRow>
        ))
      }
    </IonGrid>
  );
}

export default ProverbView;
