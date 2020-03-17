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
import {PopoverSelector} from "../components/PopoverSelector"

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
            popClickEvent: undefined,
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
