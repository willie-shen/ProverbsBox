import React from 'react';
import {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonPage,
    IonTitle,
    IonContent,
    IonGrid, IonCol, IonRow, withIonLifeCycle, IonButton, CreateAnimation, IonModal, IonButtons, IonList
} from '@ionic/react';
import DefaultConfig from "../pages/DefaultDisplayConfig";
import ContentManager from "../api/ContentManager";
import {Statement} from "../components/Statement"
import {IStatement,IModel, ISection, ILibraryContext, IVerse} from "../api/Interfaces";
import update from "immutability-helper";
import StorageAssistant, { IFolder } from '../api/StorageAssistant';
import "./Discover.css";

import {chevronBackOutline, chevronForwardOutline} from "ionicons/icons";
import Indexer from '../api/Indexer';
import { FolderCheckbox } from '../components/FolderCheckbox';

type IDiscoverProps = {
    contentManager: ContentManager,
    heartAndVanish?: Boolean
}

type IDiscoverState = {
    allStatements: Array<IStatement>,
    selectedStatements: Array<IStatement>,
    head: number,
    model: IModel,
    context: ILibraryContext,
    translation: string,
    viewFolderModal: IVerse | null,
    folders: Array<IFolder>
}

const SelectRandom = (pool: Array<IStatement>) => {
    console.log("selected random");
    return pool[Math.floor(Math.random() * pool.length)];
};

class Discover extends React.Component<IDiscoverProps, IDiscoverState> {

    private proverbCenterRef: React.RefObject<CreateAnimation> = React.createRef();
    private cm : ContentManager; // short syntax

    constructor(props : IDiscoverProps) {
        super(props);
        this.cm = this.props.contentManager;

        this.state = {
            allStatements: [],
            selectedStatements: [],
            head: -1,
            translation: "",
            model: this.cm.GetModel(), // A blank model
            viewFolderModal: null,
            folders: [],
            context: {
                Mode: DefaultConfig.typeDisplay,
                Chapter: (DefaultConfig.chapter as {[key: string]: number;}),
                Section: (DefaultConfig.section as {[key: string]: ISection;}),
                BrowseMode: (DefaultConfig.browseMode)
            },
        };
    }
   
    //Used as callback f(x) for the hearting a card.
    heartHandler = (statementModel : IStatement) => {
        //this.refreshComponentModels();
        //this.refreshFolders();
        
        console.log("Heart Handler stats: ")
        //console.log(this.state.selectedStatements)
        //console.log(this.state.selectedStatements[this.state.head])
        //console.log(statementModel) //This is out of date / incorrect. 
        //console.log(statementModel.Saved)
        if (statementModel.Saved) {
            console.log("Removing heart");
            this.props.contentManager.RemoveBookmark(
                {
                    Chapter: statementModel.Verse.Chapter,
                    VerseNumber: statementModel.Verse.VerseNumber
                }
            );
        } else {
            console.log("adding heart");
            this.props.contentManager.Bookmark(
                {
                    Chapter: statementModel.Verse.Chapter,
                    VerseNumber: statementModel.Verse.VerseNumber
                }
            );
        }
        this.refreshComponentModels();
        this.refreshFolders(); //Added
      }

    
    /* A. Verse model for saving verse in folder */
    openVerseOptions = (verse: IVerse) => {
        console.log("openVerseOptions > viewFolderModal should now not be null!")
        this.refreshFolders(); //Refresh folders every time we open the Verse model
        //this.state.viewFolderModal = verse;
        this.setState(update(this.state,{
            viewFolderModal: {$set:verse},
        }));
    }
    //const [folders, setFolders] = useState<Array<IFolder>>([]);

    //A.1 used in f(x) A. openVerseOptions()
    refreshFolders = () => {
        console.log("D_folders refreshed: " + StorageAssistant.getFolders())
        StorageAssistant.getFolders()
        .then(folders => folders.sort((folder1, folder2) => folder1.order - folder2.order))
        .then(sortedFolders => update(this.state,{
            folders: {$set:sortedFolders},
        }));
      }

    // life cycle
    ionViewWillEnter() {
        if (this.props.contentManager.IsTranslatationReady()) {

            if (this.state.translation !== this.props.contentManager.GetTranslationName()) {
                this.setState({
                    allStatements: [],
                    selectedStatements: [],
                    head: -1
                });
            }

            if (this.state.allStatements.length === 0) {

                this.props.contentManager.ClearFiltersNoRefresh();
                this.props.contentManager.ApplyFilter("ByType", "statement");

                this.setState({
                    allStatements: this.props.contentManager.GetModel().ComponentModels.map(comp => {
                        return (comp.Model as IStatement);
                    }),
                    translation: this.props.contentManager.GetTranslationName()
                });
                this.forward();
            }
        }
    };

    forward = () => {

        // This is to prevent the animation from triggering for the first time forward() is called from ionViewWillEnter()
        if (this.state.head !== -1) {
            let proverbCenterAnimation = this.proverbCenterRef.current!.animation;
            proverbCenterAnimation.play();
        }

        this.setState(cur => {
            if (cur.head === cur.selectedStatements.length - 1) {
                return {
                    selectedStatements: update(cur.selectedStatements, {$push: [SelectRandom(this.state.allStatements)]}),
                    head: (cur.head) + 1
                };
            }

            return {
                selectedStatements: cur.selectedStatements,
                head: (cur.head) + 1
            };
        });
    };

    back = () => {

        let proverbCenterAnimation = this.proverbCenterRef.current!.animation;
        
        if (this.state.head > 0) {
            proverbCenterAnimation.play(); //only animate if you actually went back
            this.setState(cur => {
                return {
                    head: (cur.head) - 1,
                }
            });
        }
    };

    //Pasted from Library.tsx
    refreshComponentModels = () => {
        this.setState({model: this.cm.GetModel()});
    }

    //Manually create the "disabled" appearance when we're on the first card
    getBackButtonStyle = () => {
        if (this.state.head === 0) { //then "disabled"
            return {opacity:0.6}
        }else{
            return{opacity:1.0}
        }
    }

    render() {
        let pageRef = React.createRef<any>();
        return (
            <>
            {/* Modal to view popup folders */}
            <IonModal
                isOpen={(this.state.viewFolderModal !== null)}
                swipeToClose={true}

                onDidDismiss={()=>{
                    this.refreshFolders(); 
                    this.setState(update(this.state,{viewFolderModal: {$set:null},}))
                    }}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Folders</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={()=>{
                                this.refreshFolders(); 
                                this.setState(update(this.state,{viewFolderModal: {$set:null},}))
                            }}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <div id={"parentmodeldiv"}>
                        <IonList>
                            {
                            this.state.folders.map((f, index) => {
                                const chapter = (this.state.viewFolderModal !== null) ? this.state.viewFolderModal.Chapter : 0;
                                const verse = (this.state.viewFolderModal !== null) ? this.state.viewFolderModal.VerseNumber : 0;
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
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Discover - {this.state.translation}</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className={"discover-content"}>

                        <IonGrid>
                            <IonRow justify-content-center align-items-center>
                            <IonCol size={"1"} className={"button-col"}>
                                    <IonButton class="arrowButton" expand="full" disabled={true} fill={"clear"} onClick={this.back}>
                                    </IonButton>
                                </IonCol>
                            <div id="left-arrow" className="nav-arrow-d" style={this.getBackButtonStyle()} onClick={this.back}>
                                <IonIcon id="chev-left" className="chev-nav-buttons" icon={chevronBackOutline}></IonIcon>
                            </div>
                                
                                <IonCol size={"10"} align-self-center>
                                    <CreateAnimation
                                        ref={this.proverbCenterRef}
                                        duration={100}
                                        keyframes={[
                                            { offset: 0, transform: 'scale(1)', opacity: '1' },
                                            { offset: 0.1, transform: 'scale(1.2)', opacity: '0'},
                                            { offset: 1, transform: 'scale(1)', opacity: '1' }
                                        ]}
                                    >
                                        <div id={"proverb-center"}>
                                            {
                                                (this.state.selectedStatements.length > 0)
                                                    ? <Statement
                                                        model={this.state.selectedStatements[this.state.head]}
                                                        heartCallback={() => {this.heartHandler(this.state.selectedStatements[this.state.head])}}
                                                        openVerseOptions={() => {this.openVerseOptions(this.state.selectedStatements[this.state.head].Verse)}}
                                                       
                                                        />
                                                    : <></>
                                            }
                                        </div>
                                    </CreateAnimation>
                                </IonCol>
                                <IonCol size={"1"} className={"button-col"}>
                                <div id="right-arrow" className="nav-arrow-d" onClick={this.forward}>
                                    <IonIcon id="chev-right" className="chev-nav-buttons" icon={chevronForwardOutline}></IonIcon>
                                </div>
                                </IonCol>
                                
                            </IonRow>
                        </IonGrid>
                    </IonContent>
                </IonPage>
            </>
        )
    }
};

export default withIonLifeCycle(Discover);
