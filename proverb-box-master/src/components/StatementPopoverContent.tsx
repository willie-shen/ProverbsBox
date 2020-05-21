import {
    IonButton, IonItem, IonLabel, IonList, IonRadio,
    IonRadioGroup,
} from "@ionic/react";
import React, {useState} from "react";
import ContentManager from "../api/ContentManager";
import Statements from "../indexing/Statements.json"
import DefaultConfig from "../pages/DefaultDisplayConfig";
import {ILibraryContext} from "../api/Interfaces";
import update from 'immutability-helper';

type IPopProps = {
    contentManager: ContentManager,
    context: ILibraryContext,
    setContext: (ctx: ILibraryContext) => void,
    isOpen: boolean,
    event: any,
    onDismiss: () => void,
};

const StatementPopoverContent = (props : IPopProps) => {

    // retrieve important context info
    const currentChapter = props.context.Chapter[props.context.Mode];

    // config
    const [typeDisplay, setTypeDisplay] = useState<string>("statement");

    const ChangeSection = (section: number, part: number) => {
        props.setContext(update(props.context, {
            Section: { [props.context.Mode]: { $set: { SectionNumber: section, Part: part} }}
        }));
    };

    const ChangeChapter = (chapter: number) => {
        props.setContext(update(props.context, {
            Chapter: { [props.context.Mode]: { $set: chapter }}
        }));
    };

    const ChangeBrowseMode = (bm : string) => {
        props.setContext(update(props.context, {
            BrowseMode: { $set: bm }
        }));
    };

    return (
        <>
            <div id={"select-mode-container"}>
                <h3 id={"mode-text"}>Statement Select</h3>
                {
                    (props.context.BrowseMode == "chapter") ? (
                        <IonButton id={"mode-button"} size="small" color="dark" onClick={()=>{ChangeBrowseMode("descriptor");}}>Select by Descriptor</IonButton>
                    )
                    : <IonButton id={"mode-button"} size="small" color="dark" onClick={()=>{ChangeBrowseMode("chapter");}}>Select by Chapter</IonButton>
                }
            </div>
            <div id={"top-shadow"}/>
            <div className={"selection-box"} onTouchStart={(e) => e.preventDefault()}>
                <IonRadioGroup value={currentChapter.toString()} onIonChange={e => {
                    // tells library to do the context update
                    ChangeChapter(e.detail.value);
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