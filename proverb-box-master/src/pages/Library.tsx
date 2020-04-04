import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButton,
    IonButtons,
    IonGrid,
    IonRow
} from '@ionic/react';
import { book } from 'ionicons/icons';
import React from 'react';
import './Library.css';

import ContentManager from "../api/ContentManager";
import {IArticle, IModel, ISaying, IStatement} from "../api/Interfaces";
import {Article} from "../components/Article";
import {Saying} from "../components/Saying";
import {Statement} from "../components/Statement";
import {PopoverSelector} from "../components/PopoverSelector";
import {TranslationToggle} from "../components/TranslationToggle";

import DefaultConfig from "./DefaultDisplayConfig";
import Indexer from "../api/Indexer";

type ILibraryProps = {
  contentManager: ContentManager
}

type ILibraryState = {
    searchContent: string,
    popClickEvent: any,
    popOpen: boolean,
    model: IModel,
    typeDisplay: string,
    filterFormat: string
}

class Library extends React.Component<ILibraryProps, ILibraryState>
{
    /* Member data */
    private proverbLimit = 30;
    private cm : ContentManager;
    private ref : any;

    constructor(props: ILibraryProps) {
        super(props);

        this.cm = this.props.contentManager;
        this.ref = React.createRef();

        this.state = {
            //proverbs: this.props.proverbProvider.GetAllOneLiners(),
            searchContent: "",
            popClickEvent: undefined,
            popOpen: false,
            model: this.cm.GetModel(), // A blank model
            typeDisplay: DefaultConfig.typeDisplay,
            filterFormat: DefaultConfig.filterFormat
        };

        // Hard-code translation for now.
        this.cm.LoadTranslation(DefaultConfig.translation)
            .then(() => {
                this.cm.ApplyFilter("ByType", this.state.typeDisplay);
                this.cm.ApplyFilter("ByChapter",
                    (DefaultConfig.chapter as  {[selector:string]: number})[this.state.typeDisplay]);
                this.setState({
                    model: this.cm.GetModel()
                });
            });
    }

    render() {

        let elements: Array<{
            key: number,
            element: any
        }> = [];

        this.state.model.ComponentModels.forEach((c) => {
            if (c.Type === "Article")
            {
                const keyVerse = (c.Model as IArticle).Verses[0];
                elements.push({
                    key: Indexer.GetVerseID(keyVerse.Chapter, keyVerse.VerseNumber),
                    element: (<Article model={(c.Model as IArticle)}></Article>)
                });
            }
            else if (c.Type === "Statement")
            {
                const statementModel = (c.Model as IStatement);
                elements.push({
                    key: Indexer.GetVerseID(statementModel.Verse.Chapter, statementModel.Verse.VerseNumber),
                    element: (<Statement
                        model={statementModel}
                        heartCallback={() => {
                            if (statementModel.Saved) {
                                console.log("Removing heart");
                                this.cm.RemoveBookmark(
                                    {
                                        Chapter: statementModel.Verse.Chapter,
                                        VerseNumber: statementModel.Verse.VerseNumber
                                    }
                                );
                            } else {
                                console.log("adding heart");
                                this.cm.Bookmark(
                                    {
                                        Chapter: statementModel.Verse.Chapter,
                                        VerseNumber: statementModel.Verse.VerseNumber
                                    }
                                );
                            }
                            this.setState({model: this.cm.GetModel()});
                        }}>
                    </Statement>)
                });
            }
            else if (c.Type === "Saying")
            {
                const keyVerse = (c.Model as ISaying).Verses[0];
                elements.push({
                    key: Indexer.GetVerseID(keyVerse.Chapter, keyVerse.VerseNumber),
                    element: (<Saying model={(c.Model as ISaying)}></Saying>)
                });
            }
        });

        /*if this.state.model ==
            let proverbDisplay :any = this.state.proverbs.slice(0, 30).map((prov:IProverb) => {
            return (<Proverb key={prov.ID} Proverb={prov}></Proverb>);
        });*/
        console.log("rendering library");

        return (
            <IonPage className={"library-page"}>

                <IonHeader>
                    <PopoverSelector contentManager = {this.cm}
                                     isOpen={this.state.popOpen}
                                     event={this.state.popClickEvent}
                                     onDismiss={() => {
                                         this.setState({
                                             popOpen: false,
                                             popClickEvent: undefined
                                         });
                                         // this.forceUpdate();
                                     }}
                                     onUpdate={() => {
                                         this.setState({
                                             model: this.cm.GetModel()
                                         });
                                     }}
                                     />
                    <IonToolbar>
                        <IonButtons slot={"start"}>
                            <IonButton onClick={(e : any) => {
                                e.persist();
                                this.setState({
                                    popClickEvent: e,
                                    popOpen: true
                                });
                                //this.setState({popOpen: true});
                                }}>
                                <IonIcon slot = "icon-only" icon = {book} />
                            </IonButton>
                            <TranslationToggle contentManager={this.cm}/>
                        </IonButtons>
                        <IonTitle>Library</IonTitle>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent className={"proverb-panel"}>
                    <Article model={{
                        Verses: [],
                        ID: 1
                    }}></Article>
                    <IonGrid>
                        {
                            elements.map(component => (
                                <IonRow key={component.key} className={"ion-justify-content-center"}>
                                    {component.element}
                                </IonRow>
                            ))
                        }
                    </IonGrid>
                </IonContent>
            </IonPage>
        );
    }
}

export default Library;
