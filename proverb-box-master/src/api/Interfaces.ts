/*
 * Typescript interfaces for API implementation
 * Code for Christ, 1/23/2020
 */

export type IProverb = {
    Content : string,
    Chapter : number,
    Verse : number,
    Saved : boolean,
    ID : number
};

export type ISection = {
    SectionNumber: number,
    Part: number
};

export type ILibraryContext = {
    Mode : string,
    Chapter : {[key:string]: number}, /*Index always by chapter, but sometimes a descriptor is also used.*/
    Section: {[key:string]: ISection}, /* For descriptor mode */
    SayingGroup ?: number,
    BrowseMode : string,
};

export type IVerseSignature = {
    Chapter: number,
    VerseNumber: number,
    GroupID?: number,
    Type?: string,
    TitlePrefix?: string
};

export type ITextRange = {
    iStart: number,
    iEnd: number
}

export type IVerse = {
    Content : string,
    Chapter : number,
    VerseNumber : number,
    Commentary ?: string,
    SearchHighlights?: Array<ITextRange>
};

export type IBookData = Array<IVerse>;

export type IArticle = {
    Verses: Array<IVerse>,
    ID: number
    /* Potentially add highlights/notes array*/
};

export type IStatement = {
    Verse: IVerse
    Saved?: boolean,
    ID: number
};

export type ISaying = {
    Verses: Array<IVerse>,
    Saved?: boolean
    ID: number,
    /* Potentially add highlights/notes array*/
};

export type ITitle = {
    Text: string,
    Ref: string
};

export type IComponentModel = {
    Type: string, /* “Statement” “Article” “Saying” “Title” */
    Model: IStatement | IArticle | ISaying | ITitle
};

export type IModel = {
    ComponentModels: Array<IComponentModel>,
    FilterNames: Array<string>,
    Translation: string
};

export type IVerseMeta = {
    found: boolean,
    types?: Array<string>,
    group?: number
};

export type IFilter = {
    name: string,
    callback: IFilterCallback
};

export type IFilterCallback = {
    (verse: IVerseSignature) : boolean
};

export type IFilterMap = {
    [name: string] : IFilter
};
