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
    IonRow, withIonLifeCycle
} from '@ionic/react';
import { book } from 'ionicons/icons';
import React from 'react';
import './Library.css';

import ContentManager from "../api/ContentManager";
import {IArticle, IModel, ISaying, IStatement, ILibraryContext, ISection, IVerseSignature} from "../api/Interfaces";
import {Article} from "../components/Article";
import {Saying} from "../components/Saying";
import {Statement} from "../components/Statement";
import {PopoverSelector} from "../components/PopoverSelector";
import {TranslationToggle} from "../components/TranslationToggle";
import ProverbsStructure from "../indexing/ProverbsStructure.json";

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
    context: ILibraryContext,
    scrollStamp: number,
}

class Library extends React.Component<ILibraryProps, ILibraryState>
{
    /* Member data */
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
            context: {
                Mode: DefaultConfig.typeDisplay,
                Chapter: (DefaultConfig.chapter as {[key: string]: number;}),
                Section: (DefaultConfig.section as {[key: string]: ISection;}),
                BrowseMode: (DefaultConfig.browseMode)
            },
            scrollStamp: 0
        };

        // Non-persistant translation for now.
        this.cm.LoadTranslation(DefaultConfig.translation)
            .then(() => {
                this.cm.ApplyFilter("ByType", this.state.context.Mode);
                this.cm.ApplyFilter("ByChapter", this.state.context.Chapter[DefaultConfig.typeDisplay]);
                this.setState({
                    model: this.cm.GetModel()
                });
            });
    }

    // calling setContext should update the library's view (via content manager)
    setContext = (ctx: ILibraryContext) =>
    {
        console.log("setting context: ", ctx);
        this.cm.ClearFiltersNoRefresh();
        this.cm.ApplyFilter("ByType", ctx.Mode);
        if (ctx.BrowseMode === "chapter" || ctx.Mode === "statement") {
            this.cm.ApplyFilter("ByChapter", Number(ctx.Chapter[ctx.Mode]));
        }

        // descriptor browse
        else {
            const span = ProverbsStructure.Sections[ctx.Section[ctx.Mode].SectionNumber];
            const spanStart : IVerseSignature = {
                Chapter: span.Start.Ch,
                VerseNumber: span.Start.Vs
            };
            const spanEnd : IVerseSignature = {
                Chapter: span.End.Ch,
                VerseNumber: span.End.Vs
            };
            const chapter = span.Start.Ch + ctx.Section[ctx.Mode].Part;
            this.cm.ApplyFilter("BySpan", spanStart, spanEnd);
            this.cm.ApplyFilter("ByChapter", chapter);
        }

        // update the library's context
        this.setState({context: ctx});

        // update the model
        this.setState({
            model: this.cm.GetModel()
        });
    };

    setModel = (mdl : IModel) => {
        this.setState({model: mdl});
    };

    // life cycle
    ionViewWillEnter() {
        this.cm.RestoreFilters("library");
    }

    ionViewDidLeave() {
        this.cm.CacheFilters("library");
    }

    onSearch(text: string) {
        this.cm.UpdateSearch(text);

        // update the model
        this.setState({
            model: this.cm.GetModel()
        });
    }

    onSearchClear() {
        this.cm.UpdateSearch("");
    }

    scrollHandler = (e: any) => {
        this.setState({
            scrollStamp: e.timeStamp
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
                    element: (<Article ctx={this.state.context} model={(c.Model as IArticle)}></Article>)
                });
            }
            else if (c.Type === "Statement")
            {
                const statementModel = (c.Model as IStatement);
                elements.push({
                    key: Indexer.GetVerseID(statementModel.Verse.Chapter, statementModel.Verse.VerseNumber),
                    element: (
                        <div style={{width: "20em"}} >
                        <Statement
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
                            }}
                            scrollStamp={this.state.scrollStamp}
                            >
                        </Statement>
                        </div>)
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
                    <PopoverSelector context={this.state.context}
                                     setContext={this.setContext}
                                     isOpen={this.state.popOpen}
                                     event={this.state.popClickEvent}
                                     onDismiss={() => {
                                         this.setState({
                                             popOpen: false,
                                             popClickEvent: undefined
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
                            <TranslationToggle contentManager={this.cm} setModel={this.setModel}/>
                        </IonButtons>
                        <IonTitle>Library</IonTitle>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar
                            onIonChange={(e)=>{this.onSearch(e.detail.value!)}}
                            onIonClear={(e) => this.onSearchClear()}
                        ></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent className={"proverb-panel"}
                    scrollEvents={true}
                    onIonScrollStart={this.scrollHandler}
                >
                    <IonGrid >
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

export default withIonLifeCycle(Library);
