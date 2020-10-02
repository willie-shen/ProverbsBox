import React from 'react';
import {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonPage,
    IonTitle,
    IonContent,
    IonGrid, IonCol, IonRow, withIonLifeCycle, IonButton, CreateAnimation
} from '@ionic/react';
import ContentManager from "../api/ContentManager";
import {Statement} from "../components/Statement"
import {IStatement} from "../api/Interfaces";
import update from "immutability-helper";
import "./Discover.css";
import {chevronBackOutline, chevronForwardOutline} from "ionicons/icons";

type IDiscoverProps = {
    contentManager: ContentManager
}

type IDiscoverState = {
    allStatements: Array<IStatement>,
    selectedStatements: Array<IStatement>,
    head: number,
    translation: string
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
            head: -1,
            translation: ""
        };
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
        proverbCenterAnimation.play();

        if (this.state.head > 0) {
            this.setState(cur => {
                return {
                    head: (cur.head) - 1,
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
                            <IonTitle>Discover - {this.state.translation}</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className={"discover-content"}>
                        <IonGrid>
                            <IonRow justify-content-center align-items-center>
                                <IonCol size={"1"} className={"button-col"}>
                                    <IonButton expand="full" size={"small"} disabled={this.state.head === 0} fill={"clear"} className={"back-button"} onClick={this.back}
                                    ><IonIcon icon={chevronBackOutline}/></IonButton>
                                </IonCol>
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
                                                        heartCallback={() => {}}
                                                        scrollStamp={0}
                                                        openVerseOptions={() => {}}
                                                        />
                                                    : <></>
                                            }
                                        </div>
                                    </CreateAnimation>
                                </IonCol>
                                <IonCol size={"1"} className={"button-col"}>
                                    <IonButton size={"small"} fill={"clear"} className={"forward-button"} onClick={this.forward}>
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
