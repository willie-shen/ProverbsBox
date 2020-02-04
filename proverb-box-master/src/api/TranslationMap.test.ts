import TranslationMap from "./TranslationMap"
import 'jest-fetch-mock'
import data from '../../public/assets/translations/KJV-Proverbs.json'

it("loads with no callbacks", () => {
    const tm = new TranslationMap();
    expect(tm.GetTranslationName()).toEqual("NONE");
    expect(()=>{tm.GetContent(10001)}).toThrow();
    tm.LoadTranslation("KJV");
    expect(tm.GetTranslationName()).toEqual("LOADING");
    expect(()=>{tm.GetContent(10001)}).toThrow();
});

it("loads with 1 callback", (done) => {

    fetch.mockResponsOnce(JSON.stringify(data));

    const tm = new TranslationMap();
    expect(tm.GetTranslationName()).toEqual("NONE");
    tm.LoadTranslation("KJV");
    tm.AddOnLoadedCallback((success) => {
        try {
            console.log("Callback CALLED");
            expect(success).toBe(true);
            expect(tm.GetTranslationName()).toEqual("KJV");
            expect(false).toBe(true);
            done();
        }
        catch (error)
        {
            done(error);
        }
    });
    expect(tm.GetTranslationName()).toEqual("LOADING");
});

it("loads with 1 callback (cached)", () => {
    const tm = new TranslationMap();
    expect(tm.GetTranslationName()).toEqual("NONE");
    tm.LoadTranslation("KJV");

    expect(tm.GetTranslationName()).toEqual("LOADING");
});