
import {
    IonButton,
    IonItem,
    IonLabel,
    IonRadio,
    IonRadioGroup
} from "@ionic/react";
import React, {useState} from "react";
import {ILibraryContext} from "../api/Interfaces";
import ProverbsStructure from "../indexing/ProverbsStructure.json"
import update from 'immutability-helper'

type IPopProps = {
    context: ILibraryContext,
    setContext: (ctx: ILibraryContext) => void,
};

const AllPopoverContent = (props : IPopProps) => {

    const ChangeBrowseMode = (bm : string) => {
        props.setContext(update(props.context, {
            BrowseMode: { $set: bm }
        }));
    };

    return (
        <>
            {/* content title */}
            <div id={"select-mode-container"}>
                <h3 id={"mode-text"}>Proverbs</h3>
                {
                    (props.context.BrowseMode == "chapter") ? (
                        <IonButton id={"mode-button"} size="small" color="dark" onClick={()=>{ChangeBrowseMode("descriptor");}}>Select by Descriptor</IonButton>
                    )
                    : <IonButton id={"mode-button"} size="small" color="dark" onClick={()=>{ChangeBrowseMode("chapter");}}>Select by Chapter</IonButton>
                }
            </div>
            <div id={"top-shadow"}/>

            {/* content select (Select by Chapter)*/}
            {(props.context.BrowseMode === "chapter") ?
                (<div className={"selection-box"} onTouchStart={(e)=> e.preventDefault()}>
                    { console.log("all chapters", props.context.Chapter["all"]) }
                    <IonRadioGroup value={props.context.Chapter["all"].toString()} onIonChange={e => {
                        // update context chapter
                        props.setContext(update(props.context, {
                            Chapter: {all: {$set: e.detail.value}}
                        }));
                    }}>

                        {/* render chapter select labels */}
                        {
                            // conditional render by chapter:descriptor
                            Object.keys(ProverbsStructure.Verses).map(chapter => {
                                return (
                                    <IonItem key={chapter}>
                                        <IonLabel className={"chapter-select"}><span
                                            className={"text"}>Chapter {chapter}</span>
                                        </IonLabel>
                                        <IonRadio
                                            slot="start"
                                            value={chapter.toString()}
                                        />
                                    </IonItem>
                                );
                            })
                        }
                    </IonRadioGroup>
                </div>
            )
            :
            (
                <>
                {/* content select (Select by Chapter)*/}
                <div className={"selection-box"} onTouchStart={(e)=> e.preventDefault()}>
                    { console.log("all chapters", props.context.Chapter["all"]) }
                    <IonRadioGroup value={JSON.stringify(props.context.Section["all"])} onIonChange={e => {

                        // update context section
                        console.log(e.detail.value);

                        props.setContext(update(props.context, {
                            Section: {all: {$set: JSON.parse(e.detail.value)}}
                        }));
                    }}>

                        {/* render chapter select labels */}
                        {
                            ProverbsStructure.Sections.map((section, key) => {
                                let usingPart : Boolean = section.Start.Ch !== section.End.Ch;
                                if (usingPart) {
                                    let partCount = section.End.Ch - section.Start.Ch + 1;
                                    // @ts-ignore
                                    return ([...Array(partCount).keys()].map(part => {
                                            return (
                                                <IonItem key={section.Start.Vs + "000" + section.Start.Ch + part}>
                                                    <IonLabel className={"chapter-select"}><span
                                                        className={"text"}>{section.Name + ", pt. " + (part + 1)}</span>
                                                    </IonLabel>
                                                    <IonRadio
                                                        slot="start"
                                                        value={JSON.stringify({
                                                            SectionNumber: key,
                                                            Part: part
                                                        })}
                                                    />
                                                </IonItem>
                                            )
                                        })
                                    )
                                } else {
                                    return (
                                        <IonItem key={section.Start.Vs + "000" + section.Start.Ch}>
                                            <IonLabel className={"chapter-select"}><span
                                                className={"text"}>{section.Name}</span>
                                            </IonLabel>
                                            <IonRadio
                                                slot="start"
                                                value={JSON.stringify({
                                                    SectionNumber: key,
                                                    Part: 0
                                                })}
                                            />
                                        </IonItem>
                                    );
                                }
                            }) // end of sections map
                        }
                    </IonRadioGroup>
                </div> {/*End .selection-box*/}
            </>
        ) /* End of conditional chapter/section render */ }
    </>
    );
};

export {AllPopoverContent};