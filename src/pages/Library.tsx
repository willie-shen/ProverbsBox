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
    IonGrid, 
    IonRow, withIonLifeCycle, IonModal, IonFab
} from '@ionic/react';
import { book, chevronForwardOutline, chevronBackOutline, stopCircleSharp, thumbsUpOutline } from 'ionicons/icons';
import React from 'react';
import './Library.css';
import update from "immutability-helper";

import ContentManager from "../api/ContentManager";
import {IArticle, IModel, ISaying, IStatement, ILibraryContext, ISection, IVerseSignature} from "../api/Interfaces";
import {Article} from "../components/Article";
import {Saying} from "../components/Saying";
import {Statement} from "../components/Statement";
import {PopoverSelector} from "../components/PopoverSelector";
import {TranslationToggle} from "../components/TranslationToggle";
import ProverbsStructure from "../indexing/ProverbsStructure.json";

import DefaultConfig from "./DefaultDisplayConfig";
import Indexer from "../api/Indexer";

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

//We'll be getting a new model w/ getModel() and setting that to state.
type ILibraryState = {
    searchContent: string,
    popClickEvent: any,
    popOpen: boolean,
    model: IModel,
    context: ILibraryContext,
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
        this.lut = {"0_0":"The Beginning of Knowledge", 
                    "1_0":"The Enticement of Sinners",
                    "2_0":"The Call of Wisdom", 
                    "3_0":"The Value of Wisdom",
                    "4_0":"Trust in the Lord with All Your Heart", 
                    "5_0":"Blessed is the One Who Finds Wisdom",
                    "6_0":"A Father's Wise Instruction", 
                    "7_0":"Warning Against Adultery",
                    "8_0":"Practical Warnings", 
                    "9_0":"Warnings Against Adultery",
                    "10_0":"Warnings Against the Adulteress", 
                    "11_0":"The Blessings of Wisdom",
                    "12_0":"The Way of Wisdom", 
                    "13_0":"The Way of Folly",
                    "14_0":"The Proverbs of Solomon, pt. 1", 
                    "14_1":"The Proverbs of Solomon, pt. 2",
                    "14_2":"The Proverbs of Solomon, pt. 3", 
                    "14_3":"The Proverbs of Solomon, pt. 4",
                    "14_4":"The Proverbs of Solomon, pt. 5", 
                    "14_5":"The Proverbs of Solomon, pt. 6",
                    "14_6":"The Proverbs of Solomon, pt. 7", 
                    "14_7":"The Proverbs of Solomon, pt. 8",
                    "14_8":"The Proverbs of Solomon, pt. 9", 
                    "14_9":"The Proverbs of Solomon, pt. 10",
                    "14_10":"The Proverbs of Solomon, pt. 11", 
                    "14_11":"The Proverbs of Solomon, pt. 12",
                    "14_12":"The Proverbs of Solomon, pt. 13",
                    "15_0":"Words of the Wise, pt. 1", 
                    "15_1":"Words of the Wise, pt. 2",
                    "15_2":"Words of the Wise, pt. 3",
                    "16_0":"More Sayings of the Wise", 
                    "17_0":"More Proverbs of Solomon, pt. 1",
                    "17_1":"More Proverbs of Solomon, pt. 2",
                    "17_2":"More Proverbs of Solomon, pt. 3",
                    "17_3":"More Proverbs of Solomon, pt. 4",
                    "17_4":"More Proverbs of Solomon, pt. 5",
                    "18_0":"The Words of Agur",
                    "20_0":"The Woman Who Fears the Lord",
                }

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
        
        //Reset various
        this.setState(update(this.state, {
            showFab : {$set : false},
        }));

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

    /* Verse model for saving verse in folder */
    openVerseOptions = (verseID: number) => {
        this.setState({
            showVerseOptions: true
        })
    }

    // life cycle
    ionViewWillEnter() {
        this.cm.RestoreFilters("library");
    }

    ionViewDidLeave() {
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

    scrollHandler = (e: any) => {
        this.setState({
            scrollStamp: e.timeStamp
        });
    }

    
    //Track scroll to bottom
    onIonScroll=  (ev : any) => {
        const elem = document.querySelector("ion-content")!.getScrollElement();
        // the ion content has its own associated scrollElement
        //elem > scrollHeight = 9090 by default.
        var show = false;
        const retVal = elem.then((result) =>{
            const h = result.scrollHeight
            const pos = result.scrollTop
            
            //Control fixed arrows' appearances: if down-scroll, appear.
            var areArrowsShown = false;
            console.log(this.state.prevHeight);
            console.log(pos);
            if(this.state.prevHeight > pos){ 
               
                areArrowsShown = true;
                this.setState(update(this.state,
                    {prevHeight: {$set : pos}
                }));
                
            }else{
                areArrowsShown = false;
                this.setState(update(this.state,
                    {prevHeight: {$set : pos}
                }));
            }
            
            //We can never truly get to the bottom bc container doesn't take up 100% of screen.
            //so, estimate getting to the bottom.... i wish there were a better way to do this
            if(h <= pos + 800){ 

                this.setState({showArrows: false, showFab: true})

                var prov = document.getElementById("div-proverbs-text");
                var nextText = document.getElementById("div-next-text")
                var nextChapterNumber = this.getNextChapterStatement(this.state.context.Chapter.statement)
                
                var thisChapterNumber = this.state.context.Chapter.statement
                if( typeof thisChapterNumber === 'string'){
                    thisChapterNumber = parseInt(thisChapterNumber)
                }

                //Control flow for what to show on the fab. 
                if(prov != null && nextText != null){
                    if(thisChapterNumber === 29 && this.state.context.Mode === "statement"){
                        this.setState({last:true}) //for grey expanded button view
                        nextText.innerHTML = "~ The End ~"
                        prov.innerHTML = "Back to Proverbs 10";
                    }else if (this.state.context.Mode === "statement"){
                        this.setState({last:false}) 
                        nextText.innerHTML = "Next: "
                        prov.innerHTML = "Proverbs " + nextChapterNumber;
                    }else if (this.state.context.Section.all.SectionNumber === 20 && this.state.context.Mode != "statement"){
                        this.setState({last:true}) //for grey expanded button view
                        nextText.innerHTML = "~ The End ~"
                        prov.innerHTML = "Back to The Beginning of Knowledge";
                    }else{
                        nextText.innerHTML = "Next: "
                        this.setState({last:false}) //for grey expanded button view

                        //It's article mode. Put new thing in.
                        var ctx = this.state.context;

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

            }else{
                this.setState({showArrows: areArrowsShown, showFab: false})
            }
    
        });
        
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
            if(sec == 0){
                sec = 20
            }else if(sec < 14){
                sec--
            }else if(sec == 14){
                console.log("is 14!")
                if(pt == 0){
                    sec--
                    pt = 0
                }else{
                    console.log("regular case")
                    pt--
                }
            }else if(sec == 15){
                if(pt == 0){
                    sec-- 
                    pt = 12; 
                }else{
                    pt--
                }
            }else if (sec == 16){
                if(pt == 0){
                    sec-- 
                    pt = 2;
                }else{
                    pt--
                }
            }else if(sec == 17){
                if(pt == 0){
                    sec-- 
                    pt = 0;
                }else{
                    pt--
                }
            }else if(sec == 18){
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
        }else if(sec == 20){
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
            if(this.state.context.Chapter.statement === 29) {
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
        
        //Declare empty elements dictionary-array, for storing key(type=number) : element(type=any)
        //This is the verse number/ID mapped to the verse text
        let elements: Array<{
            key: number,
            element: any
        }> = [];

        this.state.model.ComponentModels.forEach((c) => {

            if (c.Type === "Article")
            {
                console.log("in article mode")
                var curChapter = this.state.context.Chapter;
                console.log(curChapter);
                
                const keyVerse = (c.Model as IArticle).Verses[0];
                console.log(keyVerse.Chapter)
                elements.push({
                    key: Indexer.GetVerseID(keyVerse.Chapter, keyVerse.VerseNumber),
                    element: (<Article ctx={this.state.context} model={(c.Model as IArticle)}></Article>)
                });
            }
            else if (c.Type === "Statement")
            {   
                console.log("we're in statement!")
                //At least in Library view, we're in this (statement) mode; will be using this.state.context. -> info about statement
                const statementModel = (c.Model as IStatement);

                //Populate elements array with the chapers, verse numbers, and the verse
                elements.push({
                    key: Indexer.GetVerseID(statementModel.Verse.Chapter, statementModel.Verse.VerseNumber),
                    element: (
                        <div style={{width: "20em"}} >
                        <Statement
                            model={statementModel}
                            heartCallback={() => {this.heartHandler(statementModel)}}
                            scrollStamp={this.state.scrollStamp}
                            openVerseOptions={this.openVerseOptions}
                            searchHighlights={statementModel.Verse.SearchHighlights}
                            >
                        </Statement>
                        </div>)
                });
            }
            else if (c.Type === "Saying")
            {
                const keyVerse = (c.Model as ISaying).Verses[0];
                elements.push({
                    key: Indexer.GetVerseID(keyVerse.Chapter, keyVerse.VerseNumber),
                    element: (<Saying model={(c.Model as ISaying)}></Saying>)
                });
            }
        });

        console.log("rendering library");
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
                            onIonChange={(e)=>{this.onSearch(e.detail.value!)}}
                            onIonClear={(e) => this.onSearchClear()}
                        ></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                
                    <IonContent className={"proverb-panel"}
                    scrollEvents={true}
                    onIonScrollStart={this.scrollHandler}
                    onIonScroll={this.onIonScroll}
                    
                >
                    <IonModal
                        isOpen={this.state.showVerseOptions}
                        swipeToClose={true}
                        presentingElement={pageRef.current}
                        onDidDismiss={()=>{this.setState({showVerseOptions: false})}}>
                        <div id={"parentmodeldiv"}>
                            <div id={"modeldiv"}>
                                <p>Folder 1</p>
                                <p>Folder 2</p>
                                <p>Folder 3</p>
                                <IonButton onClick={()=>{this.setState({showVerseOptions: false})}}>Close Example</IonButton>
                            </div>
                        </div>

                        {/*/!* Erase and redesign modal ___*!/*/}
                        {/*<IonButton onClick={()=>{this.setState({showVerseOptions: false})}}>Close Example</IonButton>*/}
                        {/*<p>Model content (A)</p>*/}
                        {/*<p>Model content (B)</p>*/}
                        {/*/!* Erase and redesign modal ^^^ *!/*/}

                    </IonModal>
                    <IonGrid>
                        {
                            elements.map(component => (
                                <IonRow key={component.key} className={"ion-justify-content-center"}>
                                    {component.element}
                                </IonRow>
                            ))
                        }
                    </IonGrid>
                    
                    {/*/!* Animated chapter navigation buttons (grey) *!/*/}
                    {/*/!* DevNote: this is the code for making it work w/o animations : style={this.state.showArrows ? {} : { display: 'none' }}*!/*/}
                    
                    <Slide right when={this.state.showArrows}>
                        <div id="right-arrow" className="nav-arrow" onClick={()=>{
                            this.nextChapter(); 
                            }}>
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
                                <div id="div-next-text" style={this.state.context.Mode == "statement" || this.state.last ? {} : {fontSize:"12px"}}>Next:</div>
                                <div id="div-proverbs-text" style={this.state.context.Mode == "statement" || this.state.last ? {} : {fontSize:"16px"}}>P</div>
                                <IonIcon id="chev" style={this.state.last || this.state.context.Mode != "statement" ? {display:"none"} : {}} icon={chevronForwardSharp}></IonIcon>
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
