import TranslationMap from "./TranslationMap"
import data from '../../public/assets/translations/KJV-Proverbs.json'


// Fetch Mock
import { FetchMock } from 'jest-fetch-mock';
import {IBookData} from "./Interfaces";

const fetchMock = fetch as FetchMock;

describe("TranslationMap", () => {

    let tm: TranslationMap;

    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(data));
        tm = new TranslationMap();
    });

    it("loads with no callbacks", () => {
        expect(tm.GetTranslationName()).toEqual("NONE");
        expect(() => {
            tm.GetContent(10001)
        }).toThrow();
        tm.LoadTranslation("KJV");
        expect(tm.GetTranslationName()).toEqual("LOADING");
        expect(() => {
            tm.GetContent(10001);
        }).toThrow();
    });

    it("loads with 1 callback", (done) => {
        expect(tm.GetTranslationName()).toEqual("NONE");
        tm.LoadTranslation("KJV");
        tm.AddOnLoadedCallback((success) => {
            try {
                expect(success).toBe(true);
                expect(tm.GetTranslationName()).toEqual("KJV");
                done();
            } catch (error) {
                done(error);
            }
        });
        expect(tm.GetTranslationName()).toEqual("LOADING");
    });

    it("loads with 1 callback (cached)", (done) => {
        // Load normally
        expect(tm.GetTranslationName()).toEqual("NONE");
        tm.LoadTranslation("KJV");

        // Load with cache
        expect(tm.GetTranslationName()).toEqual("LOADING");
        tm.AddOnLoadedCallback((success) => {
            expect(tm.GetTranslationName()).toEqual("KJV"); // should be set
            tm.LoadTranslation("KJV");
            expect(tm.GetTranslationName()).toEqual("KJV"); // should be still set
            tm.AddOnLoadedCallback((success) => {
                done();
            });
        });
    });

    it("loads with 2 callbacks", (done) => {
        tm.LoadTranslation("KJV");
        const mockCallback = jest.fn(x => {
            if (mockCallback.mock.calls.length === 3) {
                expect(mockCallback.mock.calls[0][0]).toBe(true);
                expect(mockCallback.mock.calls[1][0]).toBe(true);
                expect(mockCallback.mock.calls[2][0]).toBe(true);
                done();
            }
        });

        tm.AddOnLoadedCallback(mockCallback);
        tm.AddOnLoadedCallback(mockCallback);
        tm.AddOnLoadedCallback(mockCallback);
    });

    it("retrieves verse", (done) => {
        tm.LoadTranslation("KJV");
        tm.AddOnLoadedCallback(success => {
            expect(tm.GetContent(1001).Content).toEqual("The proverbs of Solomon the son of David, king of Israel;");
            expect(tm.GetContent(1001).Chapter).toBe(1);
            expect(tm.GetContent(1001).VerseNumber).toBe(1);
            expect(tm.GetContent(3014).Content).toEqual("For the merchandise of it [is] better than the merchandise of silver, and the gain thereof than fine gold.");
            expect(tm.GetContent(3014).Chapter).toBe(3);
            expect(tm.GetContent(3014).VerseNumber).toBe(14);
            expect(tm.GetContent(31031).Content).toEqual("Give her of the fruit of her hands; and let her own works praise her in the gates.");
            done();
        });
    });
});
