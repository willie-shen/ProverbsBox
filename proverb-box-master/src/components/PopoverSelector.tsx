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
import DefaultConfig from "../pages/DefaultDisplayConfig";

type IPopProps = {
    contentManager: ContentManager,
    isOpen: boolean,
    event: any,
    onDismiss: () => void,
    onUpdate: () => void
};

const PopoverSelector = (props : IPopProps) => {
    // config
    const defaultChapter : {[selector:string]: number} = DefaultConfig.chapter;

    // react hooks
    /*const [cachedEvent, setCachedEvent] = useState<Event | undefined>(undefined);
    const [isOpen, setIsOpen] = useState<boolean>(false);*/

    const [typeDisplay, setTypeDisplay] = useState<string>("statement");
    //props.contentManager.ApplyFilter("ByType", "statement");

    const [chapterSelect, setChapterSelect] = useState<number>(defaultChapter[typeDisplay]);

    return (
        <IonPopover id={"popover-filter"} event={props.event as Event} isOpen={props.isOpen}
                    onDidDismiss={e => {
                        props.onDismiss();
                    }}>
            <IonContent scrollY={false}>
                <div id={"filter-container"}>
                    <div>
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
                    </div>
                    <div id={"select-mode-container"}>
                        <h3 id={"mode-text"}>Chapter Select</h3>
                        <IonButton id={"mode-button"} size="small" color="dark">Select by Descriptor</IonButton>
                    </div>
                    <div id={"top-shadow"}/>
                    <div className={"selection-box"} onTouchStart={(e)=> e.preventDefault()}>
                        <IonRadioGroup value={chapterSelect.toString()} onIonChange={e => {
                            props.contentManager.ApplyFilter("ByChapter", parseInt(e.detail.value));
                            props.onUpdate();
                            setChapterSelect(e.detail.value);
                        }}>
                            {
                                Statements.Range.map(r => (
                                    <div key={r.Start.Ch}>
                                        <p className={"title"}>{r.Title}</p>
                                        <IonList>
                                            {
                                                // get chapter numbers
                                                Array.from({length: r.End.Ch - r.Start.Ch + 1}, (x,i) => {
                                                    return i + r.Start.Ch;
                                                }).map(chapter => (   // map to components
                                                    <IonItem key={chapter}>
                                                        <IonLabel className={"chapter-select"}><span
                                                            className={"text"}>Chapter {chapter}</span>
                                                        </IonLabel>
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
                                    </div>
                                ))
                            }
                        </IonRadioGroup>
                    </div> {/*End .selection-box*/}
                </div> {/* End #filter-container */}
            </IonContent>
        </IonPopover>
    );
};

export {PopoverSelector};