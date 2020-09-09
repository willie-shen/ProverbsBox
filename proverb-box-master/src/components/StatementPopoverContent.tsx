import {
    IonItem,
    IonLabel,
    IonList,
    IonRadio,
    IonRadioGroup,
} from "@ionic/react";
import React from "react";
import Statements from "../indexing/Statements.json"
import {ILibraryContext} from "../api/Interfaces";
import update from 'immutability-helper';

type IPopProps = {
    context: ILibraryContext,
    setContext: (ctx: ILibraryContext) => void
};

const StatementPopoverContent = (props : IPopProps) => {

    // retrieve important context info
    const currentChapter = props.context.Chapter[props.context.Mode];

    /*
    Potentially important in the future

    const ChangeSection = (section: number, part: number) => {
        props.setContext(update(props.context, {
            Section: { [props.context.Mode]: { $set: { SectionNumber: section, Part: part} }}
        }));
    };
    */

    const ChangeChapter = (chapter: number) => {
        props.setContext(update(props.context, {
            Chapter: { [props.context.Mode]: { $set: chapter }}
        }));
    };

    /*
    Potentially important in the future
    const ChangeBrowseMode = (bm : string) => {
        props.setContext(update(props.context, {
            BrowseMode: { $set: bm }
        }));
    };
    */

    return (
        <>
            <div id={"select-mode-container"}>
                <h3 id={"mode-text"}>Proverbs</h3>
            </div>
            <div id={"top-shadow"}/>
            <div className={"selection-box"} onTouchStart={(e) => e.preventDefault()}>
                <IonRadioGroup value={currentChapter.toString()} onIonChange={e => {
                    // tells library to do a chapter context update
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