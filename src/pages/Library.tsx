//NOTE: added "noImplicitAny": false to TSConfig. 
//Doesn't compile? Try one of these:
    //$npm install react-reveal --save
    //$yarn add react-reveal
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButton,
    IonButtons, 
    withIonLifeCycle
} from '@ionic/react';
import { book, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import React from 'react';
import './Library.css';
import update from "immutability-helper";

import ContentManager from "../api/ContentManager";
import {IModel, ILibraryContext, ISection, IVerseSignature, IStatement} from "../api/Interfaces";
import {PopoverSelector} from "../components/PopoverSelector";
import {TranslationToggle} from "../components/TranslationToggle";
import ProverbsStructure from "../indexing/ProverbsStructure.json";

import DefaultConfig from "./DefaultDisplayConfig";
import ProverbView from '../components/ProverbView';

//Image assets and animations
import Fade from 'react-reveal/Fade';
import Slide from 'react-reveal/Slide';

//Icons
import {
    chevronForwardSharp
  } from 'ionicons/icons';

type ILibraryProps = {
  contentManager: ContentManager
}

type ILibraryState = {
    searchContent: string,
    popClickEvent: any,
    popOpen: boolean,
    model: IModel,
    context: ILibraryContext,

    scrollDirectionAnchor: number | undefined,
    isScrollDirectionUp: boolean,

    scrollStamp: number,
    showVerseOptions: boolean,
    showFab: boolean,   
    prevHeight: number, 
    showArrows: boolean, 
    animateArrows: boolean,
    animateFab: boolean,
    last: boolean,
}

class Library extends React.Component<ILibraryProps, ILibraryState>
{
    
    /* Member data */
    private cm : ContentManager;
    private lut : { [sec_part : string] : string; }; // for article mode next-title (excitingTitle) lookups. sec_part example: "12_1"

    constructor(props: ILibraryProps) {
        super(props);

        this.cm = this.props.contentManager;
        
        const lut_array = ProverbsStructure.Sections.map<string[][]>((section, i) => {
            let usingPart : boolean = section.Start.Ch !== section.End.Ch;
            if (usingPart) {
            let partCount = section.End.Ch - section.Start.Ch + 1;
            // @ts-ignore
            return ([...Array(partCount).keys()].map<string[]>(part => [i+"_"+part, section.Name + ", pt. " + (part + 1)]));
            }
            else {
                return [[i+"_0", section.Name]];
            }
        }).flat(1)
        this.lut = Object.fromEntries(lut_array);

        this.state = {
            //proverbs: this.props.proverbProvider.GetAllOneLiners(),
            searchContent: "",
            popClickEvent: undefined,
            popOpen: false, 
            model: this.cm.GetModel(), // A blank model
            context: {
                Mode: DefaultConfig.typeDisplay,
                Chapter: (DefaultConfig.chapter as {[key: string]: number;}),
                Section: (DefaultConfig.section as {[key: string]: ISection;}),
                BrowseMode: (DefaultConfig.browseMode)
            },

            scrollDirectionAnchor: undefined,
            isScrollDirectionUp: false,

            scrollStamp: 0,
            showVerseOptions: false,
            showFab : false,
            prevHeight : 0,
            showArrows : false,
            animateArrows : false,
            animateFab : false,
            last : false,
        };

        // Non-persistant translation for now.
        this.cm.LoadTranslation(DefaultConfig.translation)
            .then(() => {
                this.cm.ApplyFilter("ByType", this.state.context.Mode);
                this.cm.ApplyFilter("ByChapter", this.state.context.Chapter[DefaultConfig.typeDisplay]);
                this.setState({
                    model: this.cm.GetModel()
                });
            });
    }

    // calling setContext should update the library's view (via content manager); this is what ACTUALLY makes the cards change.
    setContext = (ctx: ILibraryContext) =>
    {
        console.log("setting context: ", ctx);
        console.log(this.state.showArrows)
        
        //Reset necessary things for appearance of a fresh page.
        this.setState({showFab : false});

        this.cm.ClearFiltersNoRefresh();
        this.cm.ApplyFilter("ByType", ctx.Mode);
        if (ctx.BrowseMode === "chapter" || ctx.Mode === "statement") {
            this.cm.ApplyFilter("ByChapter", Number(ctx.Chapter[ctx.Mode]));                
        }

        // descriptor browse
        else {
            const span = ProverbsStructure.Sections[ctx.Section[ctx.Mode].SectionNumber];
            const spanStart : IVerseSignature = {
                Chapter: span.Start.Ch,
                VerseNumber: span.Start.Vs
            };
            const spanEnd : IVerseSignature = {
                Chapter: span.End.Ch,
                VerseNumber: span.End.Vs
            };
            const chapter = span.Start.Ch + ctx.Section[ctx.Mode].Part;
            this.cm.ApplyFilter("BySpan", spanStart, spanEnd);
            this.cm.ApplyFilter("ByChapter", chapter);
        }

        // update the library's context
        this.setState({context: ctx});

        // update the model
        this.setState({
            model: this.cm.GetModel()
        });
    };

    setModel = (mdl : IModel) => {
        this.setState({model: mdl});
    };

    // Cache and restore library filters when leaving and entering the page
    ionViewWillEnter() {
        this.cm.RestoreFilters("library");
    }
    ionViewWillLeave() {
        this.cm.CacheFilters("library");
    }

    onSearch(text: string) {
        this.cm.UpdateSearch(text);

        // update the model
        this.setState({
            model: this.cm.GetModel()
        });
    }

    onSearchClear() {
        this.cm.UpdateSearch("");
    }

    // returns p: the position from top, and s: the scroll height
    getContentPosition = async () => {
        return document.querySelector("ion-content")!.getScrollElement()
        .then((result) => {return {p: result.scrollTop, s: result.scrollHeight}});
    }

    dropScrollDirectionAnchor = (e: any) => {
        this.getContentPosition()
        .then(({p,s}) => {
            this.setState({
                scrollDirectionAnchor: p // this means pickup the anchor in the next scroll cycle, then pickup the direction in the final cycle
            });
        });
        this.fabSmartToggle();
    }

    fabSmartToggle = () => {
        this.getContentPosition()
        .then(({p, s}) => {
            const bottomZone = 800;
            const distFromBottom = s - p;
            if (distFromBottom < bottomZone) {
                console.log("In bottom zone!!! Dist from bottom: ", distFromBottom, ", s: ", s, ", p: ", p);
                this.setState({showArrows: false, showFab: true});
            }
            else {
                this.setState(cur => {return {showArrows: (cur.isScrollDirectionUp), showFab: false}});
            }
        })
    }

    // if scroll direction anchor is undefined, then this optimize out this function for scrolling efficiency
    detectScrollDirection = (e: any) => {
        if (this.state.scrollDirectionAnchor === undefined) { return; }
        this.getContentPosition()
        .then(({p, s}) => {
            if (this.state.scrollDirectionAnchor === undefined) { return; }
            if (this.state.scrollDirectionAnchor === p) { 
                // the ship is paused
                return;
            } // wait till we sail in a direction

            // check offset for scroll direction
            if (p > this.state.scrollDirectionAnchor) {
                // we're saling down
                this.setState({
                    scrollDirectionAnchor: p,
                    isScrollDirectionUp: false,
                    showArrows: false,
                });
            }

            else {
                // we're sailing up!
                this.setState(cur => {
                    return {
                        scrollDirectionAnchor: p,
                        isScrollDirectionUp: true,
                        showArrows: (!cur.showFab) // show arrows if the fab is not shown
                    }
                });                
            }
        });

        // Some application specific script to determine what arrows are shown
        //this.toggleArrowButtons();
    }

    // get scroll direction
    scrollHandler = (e: any) => {
        this.setState({
            scrollDirectionAnchor: -1 // this means pickup the anchor in the next scroll cycle, then pickup the direction in the final cycle
        });
    }

    //1/2 : deriving the small text for the #fab from state
    getNextText(){
        
        var thisChapterNumber = this.state.context.Chapter.statement

        if( typeof thisChapterNumber === 'string'){thisChapterNumber = parseInt(thisChapterNumber)}
        if((thisChapterNumber === 29 && this.state.context.Mode === "statement") || (this.state.context.Section.all.SectionNumber === 20 && this.state.context.Mode !== "statement")){
            return {
                __html: '~ The End ~'    };
        }else{
            return {
                __html: 'Next:'    };
        }
    }
    //2/2 : deriving the large text for the #fab from state
    getProverbsText(){
        var prov = document.getElementById("div-proverbs-text")
        var nextChapterNumber = this.getNextChapterStatement(this.state.context.Chapter.statement)
        var thisChapterNumber = this.state.context.Chapter.statement
        //Popover somehow converts this number to a string, so let's account for that
        if( typeof thisChapterNumber === 'string'){
            thisChapterNumber = parseInt(thisChapterNumber)
        }
        if(thisChapterNumber === 29 && this.state.context.Mode === "statement"){
            return {
                __html: 'Back to Proverbs 10'    };
        }else if (this.state.context.Mode === "statement"){
            return {
                __html: "Proverbs " + nextChapterNumber    };
        }
        else if (this.state.context.Section.all.SectionNumber === 20 && this.state.context.Mode !== "statement"){
            return {
                __html: "Back to The Beginning of Knowledge"    };
        }else{
            
            //Find the appropriate title for the next* section coming up
            var arr = this.getNextSecPartArticle(this.state.context.Section.all.SectionNumber, this.state.context.Section.all.Part);
            let key = "" + arr[0] + "_" + arr[1];
            console.log("key: " + key)
            var excitingTitle = this.lut[key];

            if(prov != null){
                prov!.innerHTML = excitingTitle
            }
        }

    }
    //Correctly (React-ly) set the innerhtml on the fab
    updateIsLast(){
        var prov = document.getElementById("div-proverbs-text")
        var nextText = document.getElementById("div-next-text")
        var thisChapterNumber = this.state.context.Chapter.statement

        //Control flow for what to show on the fab. 
        if(prov != null && nextText != null){
            
            //Popover somehow converts this number to a string, so let's account for that
            if( typeof thisChapterNumber === 'string'){
                thisChapterNumber = parseInt(thisChapterNumber)
            }
            console.log(thisChapterNumber)
            console.log(this.state.context.Mode)

            if(thisChapterNumber === 29  && this.state.context.Mode === "statement"){
                this.setState({last:true}) //for grey expanded button view
            }else if (this.state.context.Mode === "statement"){
                this.setState({last:false}) 
            }else if (this.state.context.Section.all.SectionNumber === 20 && this.state.context.Mode !== "statement"){
                this.setState({last:true}) //for grey expanded button view
            }else{
                this.setState({last:false}) //for grey expanded button view
            }
        }
        console.log("is last? " + this.state.last)
    } 
    
    //Scroll to top of current chapter.
    toTop(){
        document.querySelector('ion-content')!.scrollToTop(0);
    }

    //Change the chapter shown to the new chapter, "chapter".
    setChapter(chapter: any){        
        //Be sure to scroll to the top of this new chapter.
        this.toTop();
        
        //If we're on the last chapter wrapping back to 1st, be sure to reset the flag for showing special end-banner
        if(this.state.last && chapter === 10){
            this.setState(update(this.state, {
                last : {$set : false},
                showFab : {$set : false},
            }));
        }
        if(this.state.showFab === true){
            this.setState(update(this.state, {
                showFab : {$set : false},
            }));
        }
        console.log("setting context for statement")
        this.setContext(update(this.state.context,{
            Chapter: {statement: {$set:chapter}},
            Section: {saying: {SectionNumber: {$set: chapter}}, statement: {SectionNumber: {$set: chapter}}}, 
        }));
        
    }

    //Misnomer. This sets to a Section : Part 
    setAll(section: any, part: any){
        this.toTop()
        console.log("setting context for all")
            this.setContext(update(this.state.context,{
                Section: {all: {SectionNumber: {$set: section}, Part: {$set: part}}}, 
        }));
        
    }

    //Fetch the prev chapter
    //Wrapper f(x) for Right+Left nav buttons.
    prevChapter(){
        //FOR CLICKING THE PREVIOUS CHAPTER BUTTON
            
        //Action dependent upon whether we're viewing the cards or the full chapter.
        //Turn to chapter curNum
        if(this.state.context.Mode === "statement"){
            //Get current chapter#, which is also SectionNumber.
            var curNum = this.state.context.Chapter.statement;
            //To compensate for a problem from AllPopoverContent <- which sets Chapter.statement to a STRING instead of an INT 
            if(typeof curNum === 'string'){
                curNum = parseInt(curNum);
            }

            //This is the next button, so we wanna go to next chapter (+ check edge cases)
            if(curNum === 10){
                //Do nothing, at the beginning.
            }else if(curNum === 25){
                curNum = 22
            }else{
                curNum--;
            }

            //If it's 1st, wrap around to last chapter
            if(this.state.context.Chapter.statement === 10) {
                curNum = 29
            }
            this.setChapter(curNum);
        }else{
            var sec = this.state.context.Section.all.SectionNumber;
            var pt = this.state.context.Section.all.Part;
            console.log("sec: " + sec + " pt: " + pt);

            
            //Sec 0-13: Parts:0
            if(sec === 0){
                sec = 20
            }else if(sec < 14){
                sec--
            }else if(sec === 14){
                console.log("is 14!")
                if(pt === 0){
                    sec--
                    pt = 0
                }else{
                    console.log("regular case")
                    pt--
                }
            }else if(sec === 15){
                if(pt === 0){
                    sec-- 
                    pt = 12; 
                }else{
                    pt--
                }
            }else if (sec === 16){
                if(pt === 0){
                    sec-- 
                    pt = 2;
                }else{
                    pt--
                }
            }else if(sec === 17){
                if(pt === 0){
                    sec-- 
                    pt = 0;
                }else{
                    pt--
                }
            }else if(sec === 18){
                sec = 17
                pt = 4
            }else{//20
                sec = 18
            }
            this.setAll(sec,pt)
           /* Key for all the parts in Article Mode.
                [0:12] 0
                14: pts=13 
                15: [0-2]
                16: 0
                17: [0:4]
                18
                20
            */
        }
        
    }

    refreshComponentModels = () => {
        this.setState({model: this.cm.GetModel()});
    }

    //1/2
    //Returns the next chapter number for statement mode.
    //This is used in two places: nextChapter() and for displaying next chap# on the fab
    getNextChapterStatement =  (curNum : any) => {
        //To compensate for a problem from AllPopoverContent <- which sets Chapter.statement to a STRING instead of an INT
        if(typeof curNum === 'string'){
            curNum = parseInt(curNum);
        }

        //This is the next button, so we wanna go to next chapter (+ check edge cases)
        if(curNum === 22){
            curNum = 25;
        }else if(curNum === 29){
            //Do nothing, we're at the end. Maybe put a nice message saying that you've reached the end?
        }else{
            //Not an edge case, just advance
            curNum++;
        }
        return curNum;
    }
    //2/2
    //Same as 1/2 but for article mode. This is to have logic for peeking at the next chapter's
    getNextSecPartArticle(s : number, p : number) {
        var sec = s
        var pt = p
        //Sec 0-13: Parts:0
        if(sec <= 12 || sec === 16){
            sec++; 
        }else if(sec === 13){
            sec = 14;
        }else if(sec === 14){
            if(pt === 12){
                sec++; 
                pt = 0;
            }else{
                pt++;
            }
        }else if(sec === 15){
            if(pt === 2){
                sec++; 
                pt = 0;
            }else{
                pt++;
            }
        }else if(sec === 17){
            if(pt === 4){
                sec++; 
                pt = 0;
            }else{
                pt++;
            }
        }else if(sec === 18){
            sec = 20
        }else if(sec === 20){
            sec = 0;
        }

        return [sec,pt]
        
    }   
    //Set context to next chapter in either article or statement mode
    nextChapter(){
       
        this.setState(update(this.state,{
            last : {$set : false},
            showFab : {$set : false}                      
      }));
        //CALLED FROM FAB OR NEXT ARROW
        if(this.state.context.Mode === "statement"){
            var curNum = this.state.context.Chapter.statement;
            curNum = this.getNextChapterStatement(curNum);
            
            //If it's acutally** the last chapter, turn back to 10!
            var thisChapterNumber = this.state.context.Chapter.statement
            if( typeof thisChapterNumber === 'string'){thisChapterNumber = parseInt(thisChapterNumber)}
            if(thisChapterNumber === 29) {
                curNum = 10
            }
            //Turn to chapter curNum
            this.setChapter(curNum);
            
        }else{
            var sec = this.state.context.Section.all.SectionNumber;
            var pt = this.state.context.Section.all.Part;
            console.log("sec: " + sec + "pt: " + pt);
            
            let results = this.getNextSecPartArticle(sec,pt)
            sec = results[0]
            pt = results[1]
            this.setAll(sec,pt)
        }
    }
    
    
    //Adding/Removing heart for card statementModel
    heartHandler = (statementModel : IStatement) => {
        if (statementModel.Saved) {
            console.log("Removing heart");
            this.cm.RemoveBookmark(
                {
                    Chapter: statementModel.Verse.Chapter,
                    VerseNumber: statementModel.Verse.VerseNumber
                }
            );
        } else {
            console.log("adding heart");
            this.cm.Bookmark(
                {
                    Chapter: statementModel.Verse.Chapter,
                    VerseNumber: statementModel.Verse.VerseNumber
                }
            );
        }
        this.setState({model: this.cm.GetModel()});
    }

    render() {
        console.log("Render page");
        let pageRef = React.createRef<any>();

        //For the grey chapter buttons below.
        var translucent = {
            opacity:0.8
        };
        var translucentGone = {
            opacity:0.8,
            display:"none"
        };
        //For formatting end-button all the way across screen
        var beginning = {
            borderRadius: "0px 0px 0px 0px",
            width:"100%",
        };

        return (
            
            <IonPage className={"library-page"} ref={pageRef}>
                
                <IonHeader>
                    <PopoverSelector context={this.state.context}
                                     setContext={this.setContext}
                                     isOpen={this.state.popOpen}
                                     event={this.state.popClickEvent}
                                     onDismiss={() => {
                                         this.setState({
                                             popOpen: false,
                                             popClickEvent: undefined
                                         });
                                     }}
                                     />
                    <IonToolbar>
                        <IonButtons slot={"start"}>
                            <IonButton onClick={(e : any) => {
                                e.persist();
                                this.setState({
                                    popClickEvent: e,
                                    popOpen: true
                                });
                                //this.setState({popOpen: true});
                                }}>
                                <IonIcon slot = "icon-only" icon = {book} />
                            </IonButton>
                            <TranslationToggle contentManager={this.cm} setModel={this.setModel}/>
                        </IonButtons>
                        <IonTitle>Library</IonTitle>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar
                            onIonChange={(e : any)=>{this.onSearch(e.detail.value!)}}
                            onIonClear={(e : any) => this.onSearchClear()}
                        ></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent className={"proverb-panel"}
                            scrollEvents={true}
                            onIonScrollStart={this.dropScrollDirectionAnchor}
                            onIonScroll={(this.state.scrollDirectionAnchor === undefined)? undefined : this.detectScrollDirection}
                            onIonScrollEnd={this.fabSmartToggle}>

                    <ProverbView
                        containerPageRef={pageRef}
                        componentModels={this.state.model.ComponentModels}
                        contentManager={this.cm}
                        refreshComponentModels={this.refreshComponentModels}
                        context={this.state.context}
                    />

                    {/*/!* Animated chapter navigation buttons (grey) *!/*/}
                    {/*/!* DevNote: this is the code for making it work w/o animations : style={this.state.showArrows ? {} : { display: 'none' }}*!/*/}
                    
                    <Slide right when={this.state.showArrows}>
                        <div id="right-arrow" className="nav-arrow" onClick={()=>{this.nextChapter(); }}>
                            <IonIcon id="chev-right" className="chev-nav-buttons" style={this.state.last ? {display:"none"} : {}} icon={chevronForwardOutline}></IonIcon>
                        </div>
                    </Slide>
                    <Slide left when={this.state.showArrows}>
                        <div id="left-arrow" className="nav-arrow" onClick={()=>{this.prevChapter();}}>
                            <IonIcon id="chev-left" className="chev-nav-buttons" style={this.state.last ? {display:"none"} : {}} icon={chevronBackOutline}></IonIcon>
                        </div>
                    </Slide>

                        <div style={this.state.showFab ? translucent : translucentGone}>                   {/*/!* Div needed to allow opacity <1; Fade overrides it to 1 :(. Must be completely "gone" to not block elements beneath*!/*/}
                        <Fade when={this.state.showFab}>

                                <div id="fab" style={this.state.last ? beginning : {}} onClick={()=>{
                                    this.nextChapter();
                                }}>
                                    <div id="div-next-text" dangerouslySetInnerHTML={this.getNextText()} style={this.state.context.Mode === "statement" || this.state.last ? {} : {fontSize:"12px"}}></div>
                                    <div id="div-proverbs-text" dangerouslySetInnerHTML={this.getProverbsText()} style={this.state.context.Mode === "statement" || this.state.last ? {} : {fontSize:"16px"}}></div>
                                    <IonIcon id="chev" style={this.state.last || this.state.context.Mode !== "statement" ? {display:"none"} : {}} icon={chevronForwardSharp}></IonIcon>
                                    <IonIcon></IonIcon>
                                </div>
                            
                        </Fade>
                        </div>
                    
                    <div className="bottom-padding-container"></div>
                </IonContent>
            </IonPage>
        );
    }
}

export default withIonLifeCycle(Library);
