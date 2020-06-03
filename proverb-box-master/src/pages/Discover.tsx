import React, {useState} from 'react';
import {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonPage,
    IonTitle,
    IonContent,
    IonGrid, IonCol, IonRow, withIonLifeCycle, IonButton
} from '@ionic/react';
import {
    CreateAnimation
} from "@ionic/react";
import ContentManager from "../api/ContentManager";
import {Statement} from "../components/Statement"
import {IStatement} from "../api/Interfaces";
import update from "immutability-helper";
import "./Discover.css";
import {bookmarkOutline, chevronBackOutline, chevronForward, chevronForwardOutline} from "ionicons/icons";

type IDiscoverProps = {
    contentManager: ContentManager
}

type IDiscoverState = {
    allStatements: Array<IStatement>,
    selectedStatements: Array<IStatement>,
    head: number
}

const SelectRandom = (pool: Array<IStatement>) => {
    console.log("selected random");
    return pool[Math.floor(Math.random() * pool.length)];
};

class Discover extends React.Component<IDiscoverProps, IDiscoverState> {

    private proverbCenterRef: React.RefObject<CreateAnimation> = React.createRef();

    constructor(props : IDiscoverProps) {
        super(props);
        this.state = {
            allStatements: [],
            selectedStatements: [],
            head: -1
        };
    }

    // life cycle
    ionViewWillEnter() {
        if (this.props.contentManager.IsTranslatationReady()) {
            if (this.state.allStatements.length == 0) {

                this.props.contentManager.ClearFiltersNoRefresh();
                this.props.contentManager.ApplyFilter("ByType", "statement");

                this.setState({
                    allStatements: this.props.contentManager.GetModel().ComponentModels.map(comp => {
                        return (comp.Model as IStatement);
                    })
                });
            }

            this.foward();
        }
    };

    foward = () => {
        this.setState(cur => {
            if (cur.head == cur.selectedStatements.length - 1) {
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
        if (this.state.head > 0) {
            this.setState(cur => {
                return {
                    head: (cur.head) - 1
                }
            });
        }
    };

    render() {
        return (
            <>
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Discover</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className={"discover-content"}>
                        <IonGrid>
                            <IonRow justify-content-center align-items-center>
                                <IonCol size={"1"} className={"button-col"}>
                                    <IonButton expand="full" size={"small"} disabled={this.state.head == 0} fill={"clear"} className={"back-button"} onClick={this.back}
                                    ><IonIcon icon={chevronBackOutline}/></IonButton>
                                </IonCol>
                                <IonCol size={"10"} align-self-center>
                                    { /*<CreateAnimation
                                        ref={this.proverbCenterRef}
                                        fill="none"
                                        duration={1000}
                                        keyframes={[
                                            { offset: 0, transform: 'scale(1) rotate(0)' },
                                            { offset: 0.5, transform: 'scale(1.2) rotate(45deg)' },
                                            { offset: 1, transform: 'scale(1) rotate(0deg)' }
                                        ]}
                                    >
                                    </CreateAnimation>
                                    */}
                                    <div id={"proverb-center"}>
                                        {
                                            (this.state.selectedStatements.length > 0)
                                                ? <Statement model={this.state.selectedStatements[this.state.head]} heartCallback={() => {
                                                }} scrollStamp={0}/>
                                                : <></>
                                        }
                                    </div>

                                </IonCol>
                                <IonCol size={"1"} className={"button-col"}>
                                    <IonButton size={"small"} fill={"clear"} className={"forward-button"} onClick={this.foward}>
                                        <IonIcon icon={chevronForwardOutline}/>
                                    </IonButton>
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
