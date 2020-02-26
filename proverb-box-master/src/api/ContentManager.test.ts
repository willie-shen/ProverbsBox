import ContentManager from "./ContentManager";
import data from "../../public/assets/translations/KJV-Proverbs.json";
import SayingsIndex from "../indexing/Sayings.json";
import StatementIndex from "../indexing/Statements.json";
import Indexer from "./Indexer";

// Fetch Mock
import { FetchMock } from 'jest-fetch-mock';
import {ISaying, IStatement, IVerseSignature} from "./Interfaces";
const fetchMock = fetch as FetchMock;

describe("Content Manager", () => {
    let cm: ContentManager;
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(data));
        cm = new ContentManager();
    });

    it("loads translation", (done) => {
        cm.LoadTranslation("KJV")
            .then(()=>{
                done();
            });
    });

    it("gets content (no filters)", (done) => {
        cm.LoadTranslation("KJV")
            .then(()=> {
                let model = cm.GetModel();
                expect(model.Translation).toEqual("KJV");
                expect(model.FilterNames).toEqual([]);

                // get saying components
                let sayingComponents = model.ComponentModels.filter((m) => {
                    return m.Type === "Saying";
                });

                // check sayings count
                const sayingsCount = SayingsIndex.Sections.reduce<number>((acc, cur) => {
                    return acc + Object.entries(cur.Sayings).length;
                }, 0);
                expect(sayingsCount).toBeGreaterThan(1);
                expect(sayingComponents.length).toBe(sayingsCount);

                // verify
                // saying 1
                expect((sayingComponents[0].Model as ISaying).Verses[0].Chapter).toBe(22);
                expect((sayingComponents[0].Model as ISaying).Verses[0].VerseNumber).toBe(17);

                expect((sayingComponents[0].Model as ISaying).Verses[1].Chapter).toBe(22);
                expect((sayingComponents[0].Model as ISaying).Verses[1].VerseNumber).toBe(18);

                expect((sayingComponents[0].Model as ISaying).Verses.slice(-1)[0].Chapter).toBe(22);
                expect((sayingComponents[0].Model as ISaying).Verses.slice(-1)[0].VerseNumber).toBe(21);

                // saying 2
                expect((sayingComponents[1].Model as ISaying).Verses[0].Chapter).toBe(22);
                expect((sayingComponents[1].Model as ISaying).Verses[0].VerseNumber).toBe(22);

                // check statement components
                let statementComponents = model.ComponentModels.filter((m) => {
                    return m.Type === "Statement";
                });

                // check statement count
                const statementCount = StatementIndex.Range.reduce<number>((acc, cur) => {
                    const verseStart = Indexer.GetVerseSignature(Indexer.GetVerseID(cur.Start.Ch, cur.Start.Vs));
                    const verseEnd = Indexer.GetVerseSignature(Indexer.GetVerseID(cur.End.Ch, cur.End.Vs));

                    const versesBetween = Indexer.PermuteVerses().filter((v) => {
                            return Indexer.IsVerseBetween(v, verseStart, verseEnd);
                        });

                    return versesBetween.length + acc;
                }, 0);

                expect(statementCount).toBeGreaterThan(100);

                expect(statementComponents.length).toBe(statementCount-1); // -1 for intro at Ch 25 Vs 1
                expect((statementComponents[0].Model as IStatement).Verse.Chapter).toBe(10);
                expect((statementComponents[0].Model as IStatement).Verse.VerseNumber).toBe(1);
                expect((statementComponents[1].Model as IStatement).Verse.Chapter).toBe(10);
                expect((statementComponents[1].Model as IStatement).Verse.VerseNumber).toBe(2);

                expect((statementComponents[statementComponents.length-1].Model as IStatement).Verse.Chapter).toBe(29);
                expect((statementComponents[statementComponents.length-1].Model as IStatement).Verse.VerseNumber).toBe(27);

                // Articles are not checked...
                done();
            });
    });

    it("gets content (with filters)", (done) => {
        cm.LoadTranslation("KJV")
            .then(()=> {
                const verseStart: IVerseSignature = {
                    Chapter: 10,
                    VerseNumber: 1,
                };
                const verseEnd: IVerseSignature = {
                    Chapter: 10,
                    VerseNumber: 9,
                };

                // No filter model
                let model = cm.GetModel();
                const fullModelLength = model.ComponentModels.length;

                cm.ApplyFilter("BySpan", verseStart, verseEnd);
                model = cm.GetModel();
                expect(model.ComponentModels.length).toBe(9);

                // Replace filter
                verseStart.Chapter = 11;
                verseEnd.Chapter = 11;
                verseEnd.VerseNumber = 11;

                cm.ApplyFilter("BySpan", verseStart, verseEnd);
                model = cm.GetModel();
                expect(model.ComponentModels.length).toBe(11);

                // Restore filters
                cm.RemoveFilter("BySpan");
                model = cm.GetModel();
                expect(model.ComponentModels.length).toBe(fullModelLength);

                // Expand tests: Test stacked filters

                done();
            });
    });

    it("gets content (with filters)", (done) => {
        cm.LoadTranslation("KJV")
            .then(() => {

            });
    });
});