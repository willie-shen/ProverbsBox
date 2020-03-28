import KJVLoader from './KJV-Loader'
import data from "../../public/assets/translations/KJV-Proverbs.json";

// Fetch Mock
import { FetchMock } from 'jest-fetch-mock';
import {IBookData} from "../api/Interfaces";

const fetchMock = fetch as FetchMock;

describe("Test KJV Loader", () => {
    let loader : KJVLoader;

    beforeEach(()=>{
        fetchMock.resetMocks();
        loader = new KJVLoader();
    });

    it("loads json", (done) => {
        fetchMock.mockResponseOnce(JSON.stringify(data));
        loader.Load("./translations/KJV-Proverbs.json").then((book: IBookData) => {
            expect(book.length).toBe(915);
            expect(fetchMock.mock.calls[0][0]).toEqual("./translations/KJV-Proverbs.json");
            expect(book[3].Content).toEqual("To give subtilty to the simple, to the young man knowledge and discretion.");
            done();
        });
    });

    it("fails gracefully", (done) => {
        const loader = new KJVLoader();
        fetchMock.mockReject(new Error('fake error message'));
        loader.Load("./translations/KJV-Proverbs.fail").then((book: IBookData) => {
            expect(book).toEqual([]);
            done();
        });
    });
});
