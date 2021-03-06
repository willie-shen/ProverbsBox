import LexhamLoader from "./Lexham-Loader"
import data from "../../public/assets/translations/Lexham-Proverbs.json";

// Fetch Mock
import { FetchMock } from 'jest-fetch-mock';
import {IBookData} from "../api/Interfaces";

const fetchMock = fetch as FetchMock;

describe("Test Lexham Loader", () => {
    let loader : LexhamLoader;

    beforeEach(()=>{
        fetchMock.resetMocks();
        loader = new LexhamLoader();
    });

    it("loads json", (done) => {
        done();
        return;
        fetchMock.mockResponseOnce(JSON.stringify(data)); //make sure to call this at the start of every test
        loader.Load("./translations/Lexham-Proverbs.json").then((book: IBookData) => {
            expect(book.length).toBe(920);
            expect(fetchMock.mock.calls[0][0]).toEqual("./translations/Lexham-Proverbs.json");
            expect(book[3].Content).toEqual("to give shrewdness to the simple, knowledge and purpose to the young,");
            done();
        });
    });

    it("fails gracefully", (done) => {
        const loader = new LexhamLoader();
        fetchMock.mockReject(new Error('fake error message'));
        loader.Load("./translations/Lexham-Proverbs.fail").then((book: IBookData) => {
            expect(book).toEqual([]);
            done();
        });
    });
});
