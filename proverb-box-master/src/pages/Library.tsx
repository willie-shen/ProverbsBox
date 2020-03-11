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
    IonButtons, IonModal, IonSegment, IonSegmentButton, IonLabel
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
                        <IonSegment onIonChange={
                            e => console.log('Segment selected', e.detail.value)
                        }>
                            <IonSegmentButton value="Statement">
                                <IonLabel>Statements</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="Sayings">
                                <IonLabel>Sayings</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="Articles">
                                <IonLabel>Articles</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="All">
                                <IonLabel>All</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        <h3>Chapter Select</h3>

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
