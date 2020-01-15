export type IProverb = {
    Content : string,
    Chapter : number,
    Verse : number,
    Saved : boolean,
    ID : number
};

export type IFilter = {
    (proverb: IProverb) : boolean
};

export type IFilterMap = {
    [name: string] : IFilter
};