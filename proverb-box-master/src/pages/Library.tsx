import {
    IonPopover,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButton,
    IonButtons,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonListHeader,
    IonRadioGroup,
    IonList,
    IonItemDivider,
    IonItem, IonRadio, IonSelect, IonSelectOption
} from '@ionic/react';
import { book } from 'ionicons/icons';
import React from 'react';
import './Library.css';

import {IProverb} from "../components/ProverbInterface";
//import {Proverb} from "../components/Proverb";
import ProverbData from "../components/ProverbData";
import ContentManager from "../api/ContentManager";
import {IArticle, IModel, ISaying, IStatement} from "../api/Interfaces";
import {Article} from "../components/Article";
import {Saying} from "../components/Saying";
import {Statement} from "../components/Statement";

type ILibraryProps = {
  contentManager: ContentManager
}

type ILibraryState = {
    //proverbs: Array<IProverb>,
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
            popClickEvent: null,
            popOpen: false,
            model: this.cm.GetModel(), // A blank model
            typeDisplay: "statement",
            filterFormat: "chapter"
        };

        // Hard-code translation for now.
        this.cm.LoadTranslation("KJV")
            .then(() => {
                console.log("Writing model: ", this.cm.GetModel());
                this.setState({
                    model: this.cm.GetModel()
                });
            });
    }

    updateProverbs() {
        //this.setState({proverbs : this.props.proverbProvider.GetFilteredOneLiners()});
    }

    showPopover() {

    }

    setShowPopover() {

    }

    render() {

        let elements: Array<any> = [];

        this.state.model.ComponentModels.forEach((c) => {
            if (c.Type === "Article")
            {
                elements.push((<Article model={(c.Model as IArticle)}></Article>));
            }
            else if (c.Type === "Statement")
            {
                elements.push((<Statement model={(c.Model as IStatement)}></Statement>));
            }
            else if (c.Type === "Saying")
            {
                elements.push((<Saying model={(c.Model as ISaying)}></Saying>));
            }
        });

        /*if this.state.model ==
            let proverbDisplay :any = this.state.proverbs.slice(0, 30).map((prov:IProverb) => {
            return (<Proverb key={prov.ID} Proverb={prov}></Proverb>);
        });*/

        let popoverFilter = (
            <IonPopover id={"popover-filter"} event={this.state.popClickEvent} isOpen={this.state.popOpen} onDidDismiss={e =>
                this.setState({popOpen: false, popClickEvent: null})
            }>
                <IonContent>
                    <div  id={"filter-container"}>
                        {/*-- Default Segment --*/}
                        <IonSegment value = {this.state.typeDisplay} onIonChange={
                            e => {
                                if (e.detail.value !== undefined)
                                {
                                    this.setState({typeDisplay: e.detail.value})
                                }
                            }
                        }>
                            <IonSegmentButton value="statement">
                                <IonLabel>Statements</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="sayings">
                                <IonLabel>Sayings</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="all">
                                <IonLabel>All</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>

                        <div id={"select-mode-container"}>
                            <h3 id={"mode-text"}>Chapter Select</h3>
                            <IonButton id={"mode-button"} size="small" color="dark">Select by Descriptor</IonButton>
                        </div>
                        <div className = {"selection-box"}>
                            <IonRadioGroup value={""} onIonChange={e => {}}>

                                <p className = {"title"}>Proverbs of Solomon</p>
                                <IonList>
                                        <IonItem>
                                            <IonLabel className={"chapter-select"}><span className={"text"}>Chapter 10</span></IonLabel>
                                            <IonRadio slot="start" value="10" />
                                        </IonItem>

                                        <IonItem>
                                            <IonLabel className={"chapter-select"}><span className={"text"}>Chapter 11</span></IonLabel>
                                            <IonRadio slot="start" value="11" />
                                        </IonItem>

                                        <IonItem>
                                            <IonLabel className={"chapter-select"}><span className={"text"}>Chapter 12</span></IonLabel>
                                            <IonRadio slot="start" value="12" />
                                        </IonItem>
                                    {/*<IonItem>{selected ?? '(none selected'}</IonItem>*/}
                                </IonList>

                                <p className = {"title"}>More Proverbs of Solomon</p>
                                <IonList>
                                    <IonItem>
                                        <IonLabel className={"chapter-select"}><span className={"text"}>Chapter 25</span></IonLabel>
                                        <IonRadio slot="start" value="25" />
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel className={"chapter-select"}><span className={"text"}>Chapter 26</span></IonLabel>
                                        <IonRadio slot="start" value="26" />
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel className={"chapter-select"}><span className={"text"}>Chapter 27</span></IonLabel>
                                        <IonRadio slot="start" value="27" />
                                    </IonItem>
                                </IonList>
                            </IonRadioGroup>
                        </div>

                        {/*Statement
                        "Range": [
                        {
                            "Title": "Proverbs of Solomon",
                            "Intro": {
                            "Ch": 10, "Vs": 1, "Part": true
                        },
                            "Start": {
                            "Ch": 10,
                            "Vs": 1
                        },
                            "End": {
                            "Ch": 22,
                            "Vs": 16
                        }
                        },
                        {
                            "Title": "More Proverbs of Solomon",
                            "Intro": {"Ch": 25, "Vs": 1, "Part": false},
                            "Start": {
                            "Ch": 25,
                            "Vs": 1
                        },
                            "End": {
                            "Ch": 29,
                            "Vs": 27
                        }
                        */}

                    </div>
                </IonContent>
            </IonPopover>
        );

        return (
            <IonPage className={"library-page"}>

                <IonHeader>
                    {popoverFilter}
                    <IonToolbar>
                        <IonButtons slot={"start"}>
                            <IonButton onClick={(e) => {
                                e.persist();
                                this.setState({
                                    popClickEvent: e,
                                    popOpen: true
                                });
                                //this.setState({popOpen: true});
                                }}>
                                <IonIcon slot = "icon-only" icon = {book} />
                            </IonButton>
                        </IonButtons>

                        <IonTitle>Library</IonTitle>
                    </IonToolbar>

                    <IonToolbar>
                        <IonSearchbar></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    {/*<IonModal
                        isOpen={this.state.popOpen}
                        swipeToClose={true}
                        presentingElement={this.ref.current}
                        onDidDismiss={() =>{this.setState({popOpen: false})}}>
                        <p>This is modal content</p>
                        <IonButton onClick={() => this.setState({popOpen: false})}>Close Modal</IonButton>
                    </IonModal>*/}

                    {elements}
                </IonContent>


            </IonPage>
        );
    }
}

export default Library;
