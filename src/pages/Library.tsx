
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
    withIonLifeCycle
} from '@ionic/react';
import { book, ellipsisVerticalOutline } from 'ionicons/icons';
import React from 'react';
import './Library.css';
import update from "immutability-helper";

import ContentManager from "../api/ContentManager";
import {IModel, ILibraryContext, ISection, IVerseSignature} from "../api/Interfaces";
import {PopoverSelector} from "../components/PopoverSelector";
import {TranslationToggle} from "../components/TranslationToggle";
import ProverbsStructure from "../indexing/ProverbsStructure.json";

import DefaultConfig from "./DefaultDisplayConfig";
import ProverbView from '../components/ProverbView';

type ILibraryProps = {
  contentManager: ContentManager
}

type ILibraryState = {
    searchContent: string,
    popClickEvent: any,
    popOpen: boolean,
    model: IModel,
    context: ILibraryContext,
    showVerseOptions: boolean
}

class Library extends React.Component<ILibraryProps, ILibraryState>
{
    // ContentManager handles retrieving verses of multiple versions
    private cm : ContentManager; // short syntax

    constructor(props: ILibraryProps) {
        super(props);

        this.cm = this.props.contentManager;
        this.state = {
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

    // Cache and restore library filters when leaving and entering the page
    ionViewWillEnter() {
        this.cm.RestoreFilters("library");
    }
    ionViewWillLeave() {
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

    //Change the chapter shown to new chapter of curNum.
    setChapter(chapter: any){
        console.log(this.state.context);
        this.setContext(update(this.state.context,{
            Chapter: {statement: {$set:chapter}},
            Section: {saying: {SectionNumber: {$set: chapter}}, statement: {SectionNumber: {$set: chapter}}}, 
        }));
    }

    refreshComponentModels = () => {
        this.setState({model: this.cm.GetModel()});
    }

    render() {

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
                            onIonChange={(e : any)=>{this.onSearch(e.detail.value!)}}
                            onIonClear={(e : any) => this.onSearchClear()}
                        ></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent className={"proverb-panel"}>

                    <ProverbView
                        containerPageRef={pageRef}
                        componentModels={this.state.model.ComponentModels}
                        contentManager={this.cm}
                        refreshComponentModels={this.refreshComponentModels}
                        context={this.state.context}
                    />

                    <div className="next-button-container">
                    <IonButton fill={"clear"} className="next-button"
                            onClick={()=>{
                                //THIS SHALL BE THE PREVIOUS BUTTON
                                //Get current chapter#, which is also SectionNumber.
                                var curNum = this.state.context.Chapter.statement;

                                //To compensate for a problem from AllPopoverContent <- which sets Chapter.statement to a STRING instead of an INT 
                                if (typeof curNum === 'string') {
                                    curNum = parseInt(curNum);
                                }

                                //This is the next button, so we wanna go to next chapter (+ check edge cases)
                                if (curNum === 10) {
                                    //Do nothing, at the beginning.
                                } else if (curNum === 25) {
                                    curNum = 22
                                } else {
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
                                if (typeof curNum === 'string') {
                                    curNum = parseInt(curNum);
                                }

                                //This is the next button, so we wanna go to next chapter (+ check edge cases)
                                if (curNum === 22) {
                                    curNum = 25;
                                } else if (curNum === 29) {
                                    //Do nothing, we're at the end. Maybe put a nice message saying that you've reached the end?
                                } else {
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
