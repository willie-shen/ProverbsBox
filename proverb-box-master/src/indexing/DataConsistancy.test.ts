import structure from "./ProverbsStructure.json"
import sayings from "./Sayings.json"

type ISayingIndex = {
    Ch: number,
    Vs: number
};

type ISayingRange = {
    Start: ISayingIndex,
    End: ISayingIndex
};

type ISayings = Record<string, ISayingRange>;

type ISayingSection= {
    Title: string
    Sayings: ISayings
};

type ISayingSections = Array<ISayingSection>;

type ISayingStructure = {
    _comment: string,
    Sections: ISayingSections
};

it ("Saying structure is correct", ()=>{
    let saying: ISayingStructure = sayings;
    expect(saying).toBeTruthy();
});
/*
describe("Sayings", () => {
    it("array with titles and sayings" () => {
        for (const i = 0; i)
    })
});*/