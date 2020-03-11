import {
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon
} from '@ionic/react';
import React from 'react';
import {IArticle} from "../api/Interfaces";

// Styles
import "./Proverb.scss"

// Icons
import { heart, heartOutline } from 'ionicons/icons';
import {IProverb} from './ProverbInterface'

type ArticleProp ={
    model: IArticle
}

type ArticleState = {

}

class Article extends React.Component<ArticleProp, ArticleState> {
    render() {
        return (
            <>
            <div className={"container"}>
                <div className={"scripture"}>
                    <p> Chapter 1</p>
                    <div className={"verse"}>
                        <p className={"number"}></p>
                        <p className={"ending-verse"}>The proverbs of Solomon the son of David, king of Israel: for gaining wisdom and instruction; for understanding words of insight</p>

                    </div>
                </div>
            </div>

            <IonCard class={"article"}>
                <p> </p>
            </IonCard>

        {/*
                <div>

                    <div class="verse"></div>
                    <p className ={"subtitles"}
                        <p>"{"verses": [{"chapter": 1, "text": "The proverbs of Solomon the son of David, king of Israel;", "verse": 1},
                    {"chapter": 1, "text": "To know wisdom and instruction; to perceive the words of understanding;", "verse": 2},
                    {"chapter": 1, "text": "To receive the instruction of wisdom, justice, and judgment, and equity;", "verse": 3},
                    {"chapter": 1, "text": "To give subtilty to the simple, to the young man knowledge and discretion.", "verse": 4},
                    {"chapter": 1, "text": "A wise [man] will hear, and will increase learning; and a man of understanding shall attain unto wise counsels:", "verse": 5},
                    {"chapter": 1, "text": "To understand a proverb, and the interpretation; the words of the wise, and their dark sayings.", "verse": 6},
                    {"chapter": 1, "text": "The fear of the LORD [is] the beginning of knowledge: [but] fools despise wisdom and instruction.", "verse": 7},
                    {"chapter": 1, "text": "My son, hear the instruction of thy father, and forsake not the law of thy mother:", "verse": 8},
                    {"chapter": 1, "text": "For they [shall be] an ornament of grace unto thy head, and chains about thy neck.", "verse": 9},
                    {"chapter": 1, "text": "My son, if sinners entice thee, consent thou not.", "verse": 10},
                    {"chapter": 1, "text": "If they say, Come with us, let us lay wait for blood, let us lurk privily for the innocent without cause:", "verse": 11},
                    {"chapter": 1, "text": "Let us swallow them up alive as the grave; and whole, as those that go down into the pit:", "verse": 12},
                    {"chapter": 1, "text": "We shall find all precious substance, we shall fill our houses with spoil:", "verse": 13},
                    {"chapter": 1, "text": "Cast in thy lot among us; let us all have one purse:", "verse": 14},
                    {"chapter": 1, "text": "My son, walk not thou in the way with them; refrain thy foot from their path:", "verse": 15},
                    {"chapter": 1, "text": "For their feet run to evil, and make haste to shed blood.", "verse": 16},
                    {"chapter": 1, "text": "Surely in vain the net is spread in the sight of any bird.", "verse": 17},
                    {"chapter": 1, "text": "And they lay wait for their [own] blood; they lurk privily for their [own] lives.", "verse": 18},
                    {"chapter": 1, "text": "So [are] the ways of every one that is greedy of gain; [which] taketh away the life of the owners thereof.", "verse": 19},
                    {"chapter": 1, "text": "Wisdom crieth without; she uttereth her voice in the streets:", "verse": 20},
                    {"chapter": 1, "text": "She crieth in the chief place of concourse, in the openings of the gates: in the city she uttereth her words, [saying, ]", "verse": 21},
                    {"chapter": 1, "text": "How long, ye simple ones, will ye love simplicity? and the scorners delight in their scorning, and fools hate knowledge?", "verse": 22},
                    {"chapter": 1, "text": "Turn you at my reproof: behold, I will pour out my spirit unto you, I will make known my words unto you.", "verse": 23},
                    {"chapter": 1, "text": "Because I have called, and ye refused; I have stretched out my hand, and no man regarded;", "verse": 24},
                    {"chapter": 1, "text": "But ye have set at nought all my counsel, and would none of my reproof:", "verse": 25},
                    {"chapter": 1, "text": "I also will laugh at your calamity; I will mock when your fear cometh;", "verse": 26},
                    {"chapter": 1, "text": "When your fear cometh as desolation, and your destruction cometh as a whirlwind; when distress and anguish cometh upon you.", "verse": 27},
                    {"chapter": 1, "text": "Then shall they call upon me, but I will not answer; they shall seek me early, but they shall not find me:", "verse": 28},
                    {"chapter": 1, "text": "For that they hated knowledge, and did not choose the fear of the LORD:", "verse": 29},
                    {"chapter": 1, "text": "They would none of my counsel: they despised all my reproof.", "verse": 30},
                    {"chapter": 1, "text": "Therefore shall they eat of the fruit of their own way, and be filled with their own devices.", "verse": 31},
                    {"chapter": 1, "text": "For the turning away of the simple shall slay them, and the prosperity of fools shall destroy them.", "verse": 32},
                    {"chapter": 1, "text": "But whoso hearkeneth unto me shall dwell safely, and shall be quiet from fear of evil.", "verse": 33},
                    {"chapter": 2, "text": "My son, if thou wilt receive my words, and hide my commandments with thee;", "verse": 1},
                */}
            </>
                );
    }
}

export {Article};