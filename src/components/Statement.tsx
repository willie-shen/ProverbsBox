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
    heartCircle,
    heartCircleOutline
} from 'ionicons/icons';

type StatementProps = {
    model: IStatement,
    heartCallback: () => void,
    scrollStamp: number,
    openVerseOptions: (id: number) => void,
    searchHighlights ?: Array<ITextRange>
};

type StatementState = {
    holdingTimer: any, // A delay event
    touchState: string, // 'n' - none, 't' - tap, 'h' - hold
    bubbleAnimation: boolean
}

class Statement extends React.Component<StatementProps, StatementState> {

    constructor(props: StatementProps) {
        super(props);

        // init state
        this.state = {
            holdingTimer: undefined,
            touchState: 'n',
            bubbleAnimation: false
        };
    }

    // Render optimization
    shouldComponentUpdate(nextProps: StatementProps, nextState: StatementState) {

        // Don't rerender on scroll
        if (this.state.touchState === 'n') {
            if (this.props.scrollStamp !== nextProps.scrollStamp) {
                return false;
            }
        }
        return true;
    }

    componentDidUpdate(prevProps: StatementProps) {

        // if touching
        if (this.state.touchState !== 'n') {

            // detect scroll
            if (this.props.scrollStamp !== prevProps.scrollStamp) {
                console.log("Scroll Detected: ", this.props.scrollStamp);

                // clear timed model open
                clearTimeout(this.state.holdingTimer);
                this.setState({
                    holdingTimer: null,
                    touchState: 'n'
                });
            }
        }
    }

    toggleAnimation = () => {
        console.log("HI");

        this.setState({ bubbleAnimation: !this.state.bubbleAnimation });
        setTimeout(() => {
          this.setState({ bubbleAnimation: !this.state.bubbleAnimation });
        }, 500);
    };

    /* config */
    tapDuration = 250;
    longPressDuration = 200; /* Transitioned to click inlet durration */

    /* folder model open */
    openModel = () => {
        console.log("Opening model");
        this.props.openVerseOptions(this.props.model.ID);
        this.gestureEnd();
    }

    gestureStart = () => {
        this.touchStart();
    }

    gestureEnd = () => {
        if (this.state.touchState !== 'n') { // Copy paste code from scroll
            // clear timed model open
            clearTimeout(this.state.holdingTimer);
            this.setState({
                holdingTimer: null,
                touchState: 'n'
            });
        }
    }

    /* To be called by gestureStart */
    touchStart = () => {
        let timeout = setTimeout( this.holdStart,  this.tapDuration);
        this.setState({
            holdingTimer: timeout,
            touchState: 't'
        });
    }

    holdStart = () => {
        let timeout = setTimeout( this.openModel,  this.longPressDuration);
        this.setState({
            holdingTimer: timeout,
            touchState: 'h'
        });
    }

    saveTapped = () => {

    }

    render() {

        console.log("rendering card");

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
          <div className={"statement-view" + ((this.state.touchState === 'h') ? " shrinking" : "")}
              onDrag={()=>{console.log("Dragging");}}
              onScroll={()=>{console.log("scrolling");}}
          >
              <h3 className={"verse-content"}>
              {
                  cardContent
              }
              </h3>

              // This Span moved for now (previous place ment as the parent of all divs here
              // was causing Library menu to show up)
              <span
                  className={"statement"}
                  /*onTouchStart={this.gestureStart}
                  onTouchEnd={this.gestureEnd}
                  onMouseDown={this.gestureStart}
                  onMouseUp={this.gestureEnd}    */
                  onClick={this.holdStart}
              >
              </span>

              <div className={"bar"}/>
              <div className={"info-bar"}>
                  <p className={"verse-name"}>Proverbs {this.props.model.Verse.Chapter}:{this.props.model.Verse.VerseNumber}</p>
                      <IonIcon
                          onTouchStart={(e)=>{e.stopPropagation()}}
                          onMouseDown={(e)=>{e.stopPropagation()}}
                          onClick={(e) => {
                              e.preventDefault();
                              this.props.heartCallback();
                              this.toggleAnimation();
                          }} className={`save-icon ${this.state.bubbleAnimation ? "bubble-animation" : ""}`} icon={this.props.model.Saved ? heartCircle : heartCircleOutline}></IonIcon>
              </div>
          </div>
        );
    }
}

export {Statement};
