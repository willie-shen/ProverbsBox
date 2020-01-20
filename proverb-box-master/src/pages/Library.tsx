import {
  IonPopover,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonCol,
  IonButton, IonButtons
} from '@ionic/react';
import { book, build, colorFill, grid } from 'ionicons/icons';
import React, {useState} from 'react';
import './Library.css';

import {IProverb} from "../components/ProverbInterface";
import {Proverb} from "../components/Proverb";
import ProverbData from "../components/ProverbData";

type ILibraryProps = {
  proverbProvider: ProverbData
}

type ILibraryState = {
    proverbs: Array<IProverb>,
    searchContent: string,
    popClickEvent: any,
    popOpen: boolean,
}

class Library extends React.Component<ILibraryProps, ILibraryState>
{
    /* Member data */
    private proverbLimit = 30;

    constructor(props: ILibraryProps) {
        super(props);
        this.state = {
            proverbs: this.props.proverbProvider.GetAllOneLiners(),
            searchContent: "",
            popClickEvent: null,
            popOpen: false,
        };
    }

    updateProverbs() {
        this.setState({proverbs : this.props.proverbProvider.GetFilteredOneLiners()});
    }

    showPopover() {

    }

    setShowPopover() {

    }

    render() {
        let proverbDisplay :any = this.state.proverbs.slice(0, 30).map((prov:IProverb) => {
            return (<Proverb key={prov.ID} Proverb={prov}></Proverb>);
        });

        let popoverFilter = (
            <IonPopover event={this.state.popClickEvent} isOpen={this.state.popOpen} onDidDismiss={e => ()=>{/*this.setShowPopover(false)*/}}>
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
                                this.setState({popClickEvent: e});
                                this.setState({popOpen: true});
                                /*this.setShowPopover(true)*/}}>
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
                    {proverbDisplay}
                </IonContent>
            </IonPage>
        );
    }
};

export default Library;
