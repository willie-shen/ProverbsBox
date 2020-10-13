import {
    IonIcon
} from '@ionic/react';
import React from 'react';
import {
    IStatement,
    ITextRange
} from "../api/Interfaces";

// Styles
import "./Proverb.scss"
import "./Views.css"

// Icons
import {
    heart, heartOutline
} from 'ionicons/icons';

type StatementProps = {
    model: IStatement,
    heartCallback: () => void,
    openVerseOptions: (id: number) => void,
    searchHighlights ?: Array<ITextRange>,
    heartAndVanish ?: boolean
};

type StatementState = {
    holdingTimer: any, // A delay event
    touchState: string, // 'n' - none, 't' - tap, 'h' - hold
    bubbleAnimation: boolean, // Controls displaying of heart animation on click
    vanishAnimation: boolean
}

class Statement extends React.Component<StatementProps, StatementState> {

    constructor(props: StatementProps) {
        super(props);

        // init state
        this.state = {
            holdingTimer: undefined,
            touchState: 'n',
            bubbleAnimation: false,
            vanishAnimation: false
        };
    }

    // Heart bubble animation
    toggleAnimation = () => {
        // Display animation on click
        this.setState((cur) => {return { bubbleAnimation: !cur.bubbleAnimation }});
        if (this.props.heartAndVanish) {
            this.setState((cur) => {return { vanishAnimation: true }});
        }

        // Stop animation when it is done fully executing
        // Refer to .bubble-animation in Views.css (animation-duration: 0.5s)
        setTimeout(() => {
            this.setState((cur) => {return { bubbleAnimation: !cur.bubbleAnimation }});
        }, 500);
    };

    /* config */
    tapDuration = 250;
    longPressDuration = 200; /* Transitioned to click inlet durration */

    /* folder model open */
    shrinkStart = () => {
        let timeout = setTimeout( this.openModel,  this.longPressDuration);
        this.setState({
            holdingTimer: timeout,
            touchState: 'h'
        });
    }   

    openModel = () => {
        this.props.openVerseOptions(this.props.model.ID);
        this.shrinkEnd();
    }

    shrinkEnd = () => {
        if (this.state.touchState !== 'n') { // Copy paste code from scroll
            // clear timed model open
            clearTimeout(this.state.holdingTimer);
            this.setState({
                holdingTimer: null,
                touchState: 'n'
            });
        }
    }

    render() {

        type ICardEncoding = {
            payload: any[],
            head: number
        };

        let cardContent: any;
        const cardText = this.props.model.Verse.Content;
        const firstHighlight = (this.props.searchHighlights && this.props.searchHighlights.length)
            ? this.props.searchHighlights[0].iStart
            : cardText.length

        // build a textual encoding of the highlights
        if (this.props.searchHighlights) {
            //const highlightMapper = [...this.props.searchHighlights, {iStart: -1, iEnd: -1}];
            const lastIEnd = (this.props.searchHighlights.length > 0) ?
                this.props.searchHighlights[this.props.searchHighlights.length-1].iEnd
                : 0;
            cardContent = this.props.searchHighlights.reduce((encode: ICardEncoding, range: ITextRange) => {

                const nonhighlight = cardText.substring(encode.head, range.iStart);
                const highlight = cardText.substring(range.iStart, range.iEnd);

                // init
                let payloadAdds : any[] = [];
                let head = encode.head;

                // add nonhighlight (except if first)
                if (range.iStart !== firstHighlight) {
                    head += nonhighlight.length;
                    payloadAdds.push(
                        <span className="nonhighlight" key={head}>
                            { nonhighlight }
                        </span>
                    );
                }

                // add highlight
                head += highlight.length;
                payloadAdds.push((
                    <span className="highlight" key={head}>
                        { highlight }
                    </span>
                    ));

                // add tail (if last)
                if (lastIEnd === range.iEnd) {
                    payloadAdds.push(
                    <span className="nonhighlight" key={-1}>
                        { cardText.substring(range.iEnd, cardText.length - 1) }
                    </span>);
                }

                return {
                    // combine
                    payload: [
                        ...(encode.payload),
                        ...(payloadAdds)
                    ],

                    // increment head
                    head: head
                };
            },
            // start value
            {
                payload: [
                    (
                    <span className="nonhighlight" key={0}>
                        { cardText.substring(0, firstHighlight) }
                    </span>
                    )
                ],
                head: firstHighlight
            })
            // retrieve payload
            .payload;
        }

        // no highlights
        else {
            cardContent = cardText;
        }

        return (
            <span
                className={`statement`}
                onClick={this.shrinkStart}          
            >
                <div className={"statement-view" + 
                    (this.state.vanishAnimation ? " vanish-animation" : "") +
                    ((this.state.touchState === 'h') ? " shrinking" : "")}>
                    <h3 className={"verse-content"}>
                    {
                        cardContent
                    }
                    </h3>

                    <div className={"bar"}/>
                    <div className={"info-bar"}>
                        <p className={"verse-name"}>Proverbs {this.props.model.Verse.Chapter}:{this.props.model.Verse.VerseNumber}</p>
                            <IonIcon
                                onTouchStart={(e)=>{e.stopPropagation()}}
                                onMouseDown={(e)=>{e.stopPropagation()}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (this.props.heartAndVanish) {
                                        // wait 500 seconds for card to disapear. then call the heart callback
                                        setTimeout(this.props.heartCallback, 500)
                                    }
                                    else {
                                        this.props.heartCallback();
                                    }
                                    this.toggleAnimation();
                                }} className={`save-icon ${this.state.bubbleAnimation ? "bubble-animation" : ""}`} icon={this.props.model.Saved ? heart : heartOutline}></IonIcon>
                    </div>
                </div>
          </span>
        );
    }
}

export {Statement};
