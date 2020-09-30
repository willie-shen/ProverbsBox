
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
    IonGrid, IonCol, CreateAnimation,
    IonRow, withIonLifeCycle, IonModal
} from '@ionic/react';
import { book, ellipsisVerticalOutline } from 'ionicons/icons';
import React from 'react';
import './Library.css';
import update from "immutability-helper";

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

//We'll be getting a new model w/ getModel() and setting that to state.
type ILibraryState = {
    searchContent: string,
    popClickEvent: any,
    popOpen: boolean,
    model: IModel,
    context: ILibraryContext,
    scrollStamp: number,
    showVerseOptions: boolean
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
            scrollStamp: 0,
            showVerseOptions: false
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

    // calling setContext should update the library's view (via content manager); this is what ACTUALLY makes the cards change.
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

    /* Verse model for saving verse in folder */
    openVerseOptions = (verseID: number) => {
        this.setState({
            showVerseOptions: true
        })
    }

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
    //Change the chapter shown to new chapter of curNum.
    setChapter(chapter: any){
        console.log(this.state.context);
        this.setContext(update(this.state.context,{
            Chapter: {statement: {$set:chapter}},
            Section: {saying: {SectionNumber: {$set: chapter}}, statement: {SectionNumber: {$set: chapter}}}, 
        }));
    }

    //Adding/Removing heart for card statementModel
    heartHandler = (statementModel : IStatement) => {
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
    }

    render() {

        //Declare empty elements dictionary-array, for storing key(type=number) : element(type=any)
        //This is the verse number/ID mapped to the verse text
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
                //At least in Library view, we're in this (statement) mode; will be using this.state.context. -> info about statement

                const statementModel = (c.Model as IStatement);

                //Populate elements array with the chapers, verse numbers, and the verse
                elements.push({
                    key: Indexer.GetVerseID(statementModel.Verse.Chapter, statementModel.Verse.VerseNumber),
                    element: (
                        <div style={{width: "20em"}} >
                        <Statement
                            model={statementModel}
                            heartCallback={() => {this.heartHandler(statementModel)}}
                            scrollStamp={this.state.scrollStamp}
                            openVerseOptions={this.openVerseOptions}
                            searchHighlights={statementModel.Verse.SearchHighlights}
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

        console.log("rendering library");
        let pageRef = React.createRef<any>();
        
        return (
            <IonPage className={"library-page"} ref={pageRef}>

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
                    <IonModal
                        isOpen={this.state.showVerseOptions}
                        swipeToClose={true}
                        presentingElement={pageRef.current}
                        onDidDismiss={()=>{this.setState({showVerseOptions: false})}}>
                        <div id={"parentmodeldiv"}>
                            <div id={"modeldiv"}>
                                <p>Folder 1</p>
                                <p>Folder 2</p>
                                <p>Folder 3</p>
                                <IonButton onClick={()=>{this.setState({showVerseOptions: false})}}>Close Example</IonButton>
                            </div>
                        </div>

                        {/*/!* Erase and redesign modal ___*!/*/}
                        {/*<IonButton onClick={()=>{this.setState({showVerseOptions: false})}}>Close Example</IonButton>*/}
                        {/*<p>Model content (A)</p>*/}
                        {/*<p>Model content (B)</p>*/}
                        {/*/!* Erase and redesign modal ^^^ *!/*/}

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
                    
                    <div className="next-button-container">
                    <IonButton fill={"clear"} className="next-button"
                            onClick={()=>{
                                //THIS SHALL BE THE PREVIOUS BUTTON
                                //Get current chapter#, which is also SectionNumber.
                                var curNum = this.state.context.Chapter.statement;

                                //To compensate for a problem from AllPopoverContent <- which sets Chapter.statement to a STRING instead of an INT 
                                if(typeof curNum === 'string'){
                                    curNum = parseInt(curNum);
                                }

                                //This is the next button, so we wanna go to next chapter (+ check edge cases)
                                if(curNum == 10){
                                    //Do nothing, at the beginning.
                                }else if(curNum == 25){
                                    curNum = 22
                                }else{
                                    curNum--;
                                }
                                
                                //Turn to chapter curNum
                                this.setChapter(curNum);
                            }}
                        >
                            <IonIcon icon = {ellipsisVerticalOutline}></IonIcon>
                        </IonButton>
                        <IonButton fill={"clear"} className="next-button"
                            onClick={()=>{
                                //THIS SHALL BE THE NEXT BUTTON.

                                //Get current chapter#, which is also SectionNumber.
                                var curNum = this.state.context.Chapter.statement;

                                //To compensate for a problem from AllPopoverContent <- which sets Chapter.statement to a STRING instead of an INT
                                if(typeof curNum === 'string'){
                                    curNum = parseInt(curNum);
                                }

                                //This is the next button, so we wanna go to next chapter (+ check edge cases)
                                if(curNum == 22){
                                    curNum = 25;
                                }else if(curNum == 29){
                                    //Do nothing, we're at the end. Maybe put a nice message saying that you've reached the end?
                                }else{
                                    //Not an edge case, just advance
                                    curNum++;
                                }

                                //Turn to chapter curNum
                                this.setChapter(curNum);
                            }}
                        >
                            <IonIcon icon = {ellipsisVerticalOutline}></IonIcon>
                        </IonButton>
                        
                    </div>
                    
                </IonContent>
            </IonPage>
        );
    }
}

export default withIonLifeCycle(Library);
