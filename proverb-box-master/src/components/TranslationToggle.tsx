import {
    IonAlert,
    IonButton,
    IonSpinner
} from "@ionic/react";
import React, {useState} from "react";
import ContentManager from "../api/ContentManager"
import "./TranslationToggle.css"
import TranslationConfig from "../translation-plugins/TranslationConfig"
import {IModel} from "../api/Interfaces";

type ITranslationToggleProps = {
    contentManager: ContentManager
    setModel: (mdl: IModel)=>void;
};

const TranslationToggle = (props : ITranslationToggleProps) => {

    const [version, setVersion] = useState<string>(props.contentManager.GetTranslationName());
    const [loading, setLoading] = useState<boolean>(version === "LOADING");

    if (version === "LOADING")
    {
        props.contentManager.OnLoadTranslation(()=>{
            setLoading(false);
            setVersion(props.contentManager.GetTranslationName());
        });
    }

    const [selectOpen, setSelectOpen] = useState<boolean>(false);

    return (
        <>
            <IonButton class="translation-toggle" onClick={()=>{
                setSelectOpen(true);
            }}>
                {
                    loading ? (
                            <div className={"spin-container"}>
                                <IonSpinner color="light" name="dots" />
                            </div>
                        )
                        :
                        (
                            <p className={"version-tag"}>{version.substr(0, 4).toUpperCase()}</p>
                        )
                }

            </IonButton>

            <IonAlert
                isOpen={selectOpen}
                onDidDismiss={() => setSelectOpen(false)}
                inputs={
                    Object.entries(TranslationConfig).map(([key, translation]) => {
                        return {
                            name: key,
                            type: "radio",
                            label: translation.Label,
                            value: key,
                            checked: (props.contentManager.GetTranslationName() === key)
                        }
                    })
                }
                buttons={
                    [{
                        text: "Select Translation",
                        handler: (data : string)=>{
                            setLoading(true);
                            props.contentManager.LoadTranslation(data).then(()=>{
                                setVersion(data);
                                setLoading(false);
                                props.setModel(props.contentManager.GetModel());
                            })
                        }

                    }]
                }
            />
        </>
    );
};

export {TranslationToggle};
