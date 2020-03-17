import {
    IonButton,
    IonContent, IonItem,
    IonLabel,
    IonList,
    IonPopover, IonRadio,
    IonRadioGroup,
    IonSegment,
    IonSegmentButton
} from "@ionic/react";
import React, {useState} from "react";
import ContentManager from "../api/ContentManager";
import Statements from "../indexing/Statements.json"

type IPopProps = {
    contentManager: ContentManager,
    isOpen: boolean,
    event: any,
    onDismiss: () => void,
    onUpdate: () => void
};

const PopoverSelector = (props : IPopProps) => {

    // config
    const defaultChapter : {[selector:string]: number} = {
        statement: 10,
        saying: 15,
        all: 1
    };

    // react hooks
    const [cachedEvent, setCachedEvent] = useState<Event | undefined>(undefined);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [typeDisplay, setTypeDisplay] = useState<string>("statement");
    //props.contentManager.ApplyFilter("ByType", "statement");

    const [chapterSelect, setChapterSelect] = useState<number>(defaultChapter[typeDisplay]);

    return (
        <IonPopover id={"popover-filter"} event={props.event as Event} isOpen={props.isOpen}
                    onDidDismiss={e => {
                        props.onDismiss();
                    }}>
            <IonContent>
                <div id={"filter-container"}>
                    {/*-- Default Segment --*/}
                    <IonSegment value={typeDisplay} onIonChange={
                        e => {
                            if (e.detail.value !== undefined) {
                                setTypeDisplay(e.detail.value);
                                console.log(e.detail.value);
                                props.contentManager.ApplyFilter("ByType", e.detail.value);
                                props.onUpdate();
                            }
                        }
                    }>
                        <IonSegmentButton value="statement">
                            <IonLabel>Statements</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="saying">
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
                    <div className={"selection-box"}>
                        <IonRadioGroup value={chapterSelect.toString()} onIonChange={e => {
                            props.contentManager.ApplyFilter("ByChapter", parseInt(e.detail.value));
                            props.onUpdate();
                            setChapterSelect(e.detail.value);
                        }}>
                            {
                                Statements.Range.map(r => (
                                    <>
                                        <p className={"title"}>{r.Title}</p>
                                        <IonList>
                                            {
                                                // get chapter numbers
                                                Array.from({length: r.End.Ch - r.Start.Ch + 1}, (x,i) => {
                                                    return i + r.Start.Ch;
                                                }).map(chapter => (   // map to components
                                                    <IonItem>
                                                        <IonLabel className={"chapter-select"}><span
                                                            className={"text"}>Chapter {chapter}</span></IonLabel>
                                                        <IonRadio
                                                            slot="start"
                                                            value={chapter.toString()}
                                                            onChange = {() => {
                                                                props.contentManager.ApplyFilter("BySpan",
                                                                    {
                                                                        Chapter: r.Start.Ch,
                                                                        VerseNumber: r.Start.Vs
                                                                    },
                                                                    {
                                                                        Chapter: r.End.Ch,
                                                                        VerseNumber: r.End.Vs
                                                                    }
                                                                )
                                                            }}
                                                            />
                                                    </IonItem>
                                                ))
                                            }
                                        </IonList>
                                    </>
                                ))
                            }

                            <p className={"title"}>Proverbs of Solomon</p>
                            <IonList>


                                <IonItem>
                                    <IonLabel className={"chapter-select"}><span
                                        className={"text"}>Chapter 11</span></IonLabel>
                                    <IonRadio slot="start" value="11"/>
                                </IonItem>

                                <IonItem>
                                    <IonLabel className={"chapter-select"}><span
                                        className={"text"}>Chapter 12</span></IonLabel>
                                    <IonRadio slot="start" value="12"/>
                                </IonItem>
                                {/*<IonItem>{selected ?? '(none selected'}</IonItem>*/}
                            </IonList>

                            <p className={"title"}>More Proverbs of Solomon</p>
                            <IonList>
                                <IonItem>
                                    <IonLabel className={"chapter-select"}><span
                                        className={"text"}>Chapter 25</span></IonLabel>
                                    <IonRadio slot="start" value="25"/>
                                </IonItem>

                                <IonItem>
                                    <IonLabel className={"chapter-select"}><span
                                        className={"text"}>Chapter 26</span></IonLabel>
                                    <IonRadio slot="start" value="26"/>
                                </IonItem>

                                <IonItem>
                                    <IonLabel className={"chapter-select"}><span
                                        className={"text"}>Chapter 27</span></IonLabel>
                                    <IonRadio slot="start" value="27"/>
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
};

export {PopoverSelector};