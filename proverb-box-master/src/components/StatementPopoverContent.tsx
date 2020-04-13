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
import {ILibraryContext} from "../api/Interfaces";

type IPopProps = {
    contentManager: ContentManager,
    context: ILibraryContext,
    setContext: (ctx: ILibraryContext) => void,
    isOpen: boolean,
    event: any,
    onDismiss: () => void,
    onUpdate: () => void
};

const StatementPopoverContent = (props : IPopProps) => {

    // config
    const defaultChapter : {[selector:string]: number} = DefaultConfig.chapter;
    const [typeDisplay, setTypeDisplay] = useState<string>("statement");
    const [chapterSelect, setChapterSelect] = useState<number>(defaultChapter[typeDisplay]);

    return (
        <>
            <div id={"select-mode-container"}>
                <h3 id={"mode-text"}>Statement Select</h3>
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
        </>
    );
};

export {StatementPopoverContent};