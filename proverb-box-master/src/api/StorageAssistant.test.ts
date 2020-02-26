
import {StorageAssistant} from '../api/StorageAssistant'

test('Data is persisted', ()=>{
	var storage = new StorageAssistant();
	storage.loadFile().then(_ =>{
		 
		expect(storage.isBookmarked(5)).toBe(false);
		expect(storage.isBookmarked(7)).toBe(false);
		expect(storage.isBookmarked(6)).toBe(false);

		storage.BookmarkVerse(5);
		storage.BookmarkVerse(6);
		storage.BookmarkVerse(7);

		expect(storage.isBookmarked(5)).toBe(true);
		expect(storage.isBookmarked(7)).toBe(true);
		expect(storage.isBookmarked(6)).toBe(true);
	}


	);




});

test('Data is persisted 1', ()=>{
	var storage = new StorageAssistant();
	storage.loadFile().then(_ =>{
		 
		

		expect(storage.isBookmarked(5)).toBe(true);
		expect(storage.isBookmarked(7)).toBe(true);
		expect(storage.isBookmarked(6)).toBe(true);
	}


	);

});

test("Test Removal", ()=>{
	var storage = new StorageAssistant();
	storage.loadFile().then(_ =>{
		 
		

		expect(storage.isBookmarked(5)).toBe(true);
		expect(storage.isBookmarked(7)).toBe(true);
		expect(storage.isBookmarked(6)).toBe(true);

		storage.removeBookmark(5);

		expect(storage.isBookmarked(5)).toBe(false);
		expect(storage.isBookmarked(7)).toBe(true);
		expect(storage.isBookmarked(6)).toBe(true);

	}

	);

	var storage1 = new StorageAssistant();
	storage1.loadFile().then(_=>{
		expect(storage.isBookmarked(5)).toBe(false);
		expect(storage.isBookmarked(7)).toBe(true);
		expect(storage.isBookmarked(6)).toBe(true);

		
		storage.removeBookmark(5);

		expect(storage.isBookmarked(5)).toBe(false);
	});
})