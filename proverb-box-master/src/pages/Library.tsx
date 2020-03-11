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
    IonButtons
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

    constructor(props: ILibraryProps) {
        super(props);

        this.cm = this.props.contentManager;
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
            <IonPopover event={this.state.popClickEvent} isOpen={this.state.popOpen} onDidDismiss={e =>
                this.setState({popOpen: false, popClickEvent: null})
            }>
                <p>This is popover content</p>
            </IonPopover>
        );

        return (
            <IonPage>

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

                    {elements}
                </IonContent>


            </IonPage>
        );
    }
}

export default Library;
