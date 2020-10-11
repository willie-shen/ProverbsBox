
import StorageAssistant from '../api/StorageAssistant'
import { IFolder } from '../api/StorageAssistant'
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

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

describe("Folder memory tests", () => {

	const getNames = (folders: Array<IFolder>) => {
		return folders.map(f => f.name);
	}

	const getOrders = (folders: Array<IFolder>) => {
		return folders.map(f => f.order);
	}

	const getIds = (folders: Array<IFolder>) => {
		return folders.map(f => f.id);
	}

	beforeEach(done => {
		Storage.clear().then(done);
		//const mockStoragePlugin = jest.fn()
	});
		
	test("Storage plugin works with node", done => {
		Storage.set({
			key: "node-memory",
			value: "I have memory"
		})
		.then(() => Storage.get({key: "node-memory"}))
		.then(mem => {
			expect(mem.value).toEqual("I have memory");
			done();
		})
	});

	test("Add folder", async done => {
		StorageAssistant.getFolders()
		.then(folders => {
			expect(folders).toEqual([]);
		})
		.then(() => StorageAssistant.createFolder("new folder"))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(folders).toHaveLength(1);
			expect(folders[0]).toEqual({
				name: "new folder",
				id: 0,
				order: 0,
				memoryLocation: "fmk-0",
				notificationsOn: false
			});
		})
		.then(done)
	});

	test("Delete folder", async done => {
		StorageAssistant.getFolders()
		.then(folders => {
			expect(folders).toEqual([]);
		})
		.then(() => StorageAssistant.createFolder("folder1"))
		.then(() => StorageAssistant.createFolder("folder2"))
		.then(() => StorageAssistant.createFolder("folder3"))
		.then(() => StorageAssistant.createFolder("folder4"))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","folder2","folder3","folder4"]);
			expect(getOrders(folders)).toEqual([0,1,2,3]);
			expect(getIds(folders)).toEqual([0,1,2,3]);
			return folders
		})
		.then(folders => StorageAssistant.deleteFolder(folders[1]))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","folder3","folder4"]);
			expect(getOrders(folders)).toEqual([0,1,2]);
			expect(getIds(folders)).toEqual([0,2,3]);
			return folders
		})
		.then(folders => StorageAssistant.deleteFolder(folders[0]))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder3","folder4"]);
			expect(getOrders(folders)).toEqual([0,1]);
			expect(getIds(folders)).toEqual([2,3]);
			return folders
		})
		.then(() => {done();})
	});

	test("Delete folder verses", async done => {
		StorageAssistant.getFolders()
		.then(folders => {
			expect(folders).toEqual([]);
		})
		.then(() => StorageAssistant.createFolder("folder1"))
		.then(() => StorageAssistant.getFolders())
		.then(async folders => {
			await StorageAssistant.addVerseToFolder(folders[0], { Chapter: 1, VerseNumber: 1 });
			return folders;
		})
		.then(folders => StorageAssistant.deleteFolder(folders[0]))
		.then(() => StorageAssistant.createFolder("folder1"))
		.then(() => StorageAssistant.getFolders())
		.then(folders => StorageAssistant.getFolderVerseIds(folders[0]))
		.then(verseIds => {expect(verseIds).toEqual([])})
		.then(() => {done();})
	});

	test("Rename folder", async done => {
		StorageAssistant.getFolders()
		.then(folders => {
			expect(folders).toEqual([]);
		})
		.then(() => StorageAssistant.createFolder("folder1"))
		.then(() => StorageAssistant.createFolder("folder2"))
		.then(() => StorageAssistant.createFolder("folder3"))
		.then(() => StorageAssistant.createFolder("folder4"))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","folder2","folder3","folder4"]);
			expect(getOrders(folders)).toEqual([0,1,2,3]);
			expect(getIds(folders)).toEqual([0,1,2,3]);
			return folders
		})
		.then(folders => StorageAssistant.renameFolder(folders[1], "renamed2"))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","renamed2","folder3","folder4"]);
			expect(getOrders(folders)).toEqual([0,1,2,3]);
			expect(getIds(folders)).toEqual([0,1,2,3]);
			return folders
		})
		.then(folders => StorageAssistant.renameFolder(folders[3], "renamed4"))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","renamed2","folder3","renamed4"]);
			expect(getOrders(folders)).toEqual([0,1,2,3]);
			expect(getIds(folders)).toEqual([0,1,2,3]);
			return folders
		})
		.then(folders => StorageAssistant.renameFolder(folders[0], "renamed1"))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["renamed1","renamed2","folder3","renamed4"]);
			expect(getOrders(folders)).toEqual([0,1,2,3]);
			expect(getIds(folders)).toEqual([0,1,2,3]);
			return folders
		})
		.then(() => {done();})
	});

	test("Reorder folders", async done => {
		StorageAssistant.getFolders()
		.then(folders => {
			expect(folders).toEqual([]);
		})
		.then(() => StorageAssistant.createFolder("folder1"))
		.then(() => StorageAssistant.createFolder("folder2"))
		.then(() => StorageAssistant.createFolder("folder3"))
		.then(() => StorageAssistant.createFolder("folder4"))
		.then(() => StorageAssistant.createFolder("folder5"))
		.then(() => StorageAssistant.getFolders())
		// original order
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","folder2","folder3","folder4","folder5"]);
			expect(getOrders(folders)).toEqual([0,1,2,3,4]);
			expect(getIds(folders)).toEqual([0,1,2,3,4]);
			return folders
		})
		// shift order up
		.then(() => StorageAssistant.getFolders())
		.then(folders => StorageAssistant.reorderFolders(folders[1], 3))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","folder2","folder3","folder4","folder5"]);
			expect(getOrders(folders)).toEqual([0,3,1,2,4]);
			expect(getIds(folders)).toEqual([0,1,2,3,4]);
			return folders
		})
		// shift order down
		.then(() => StorageAssistant.getFolders())
		.then(folders => StorageAssistant.reorderFolders(folders[4], 1))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","folder2","folder3","folder4","folder5"]);
			expect(getOrders(folders)).toEqual([0,4,2,3,1]);
			expect(getIds(folders)).toEqual([0,1,2,3,4]);
			return folders
		})
		// noop test
		.then(() => StorageAssistant.getFolders())
		.then(folders => StorageAssistant.reorderFolders(folders[2], 2))
		.then(() => StorageAssistant.getFolders())
		.then(folders => {
			expect(getNames(folders)).toEqual(["folder1","folder2","folder3","folder4","folder5"]);
			expect(getOrders(folders)).toEqual([0,4,2,3,1]);
			expect(getIds(folders)).toEqual([0,1,2,3,4]);
			return folders
		})
		.then(() => { done(); })
	});

	test("Add verse & get verse Ids", async done => {
		StorageAssistant.getFolders()
		.then(folders => {
			expect(folders).toEqual([]);
		})
		.then(() => StorageAssistant.createFolder("folder1"))
		.then(() => StorageAssistant.createFolder("folder2"))
		.then(() => StorageAssistant.createFolder("folder4"))
		.then(() => StorageAssistant.createFolder("folder5"))
		.then(() => StorageAssistant.getFolders())
		.then(async folders => {
			await StorageAssistant.addVerseToFolder(folders[0], {Chapter: 1, VerseNumber: 1})
			.then(() => StorageAssistant.addVerseToFolder(folders[0], {Chapter: 5, VerseNumber: 2}))
			.then(() => StorageAssistant.addVerseToFolder(folders[0], {Chapter: 10, VerseNumber: 1}))
			.then(() => StorageAssistant.addVerseToFolder(folders[3], {Chapter: 2, VerseNumber: 2}))
			.then(() => StorageAssistant.addVerseToFolder(folders[3], {Chapter: 4, VerseNumber: 13}))
			.then(() =>	StorageAssistant.addVerseToFolder(folders[3], {Chapter: 7, VerseNumber: 8}));
			return folders;
		})
		.then(async folders => {
			return {
				f1: await StorageAssistant.getFolderVerseIds(folders[0]),
				f2: await StorageAssistant.getFolderVerseIds(folders[1]),
				f4: await StorageAssistant.getFolderVerseIds(folders[3])
			};
		})
		.then(({f1, f2, f4}) => {
			expect(f1).toStrictEqual(
				[
					{Chapter: 1, VerseNumber: 1},
					{Chapter: 5, VerseNumber: 2},
					{Chapter: 10, VerseNumber: 1}
				]
			);

			expect(f4).toStrictEqual(
				[
					{Chapter: 2, VerseNumber: 2},
					{Chapter: 4, VerseNumber: 13},
					{Chapter: 7, VerseNumber: 8}
				]
			);

			expect(f2).toStrictEqual(
				[]
			);
		})
		.then(() => {done();});
	});

	test("Add duplicate verse", async done => {
		StorageAssistant.getFolders()
		.then(folders => {
			expect(folders).toEqual([]);
		})
		.then(() => StorageAssistant.createFolder("folder1"))
		.then(() => StorageAssistant.getFolders())
		.then(async folders => {
			await StorageAssistant.addVerseToFolder(folders[0], {Chapter: 1, VerseNumber: 1})
			.then(() => StorageAssistant.addVerseToFolder(folders[0], {Chapter: 1, VerseNumber: 1}))
			.then(() => StorageAssistant.addVerseToFolder(folders[0], {Chapter: 1, VerseNumber: 1}))
			.then(() => StorageAssistant.addVerseToFolder(folders[0], {Chapter: 1, VerseNumber: 1}))
			.then(() => StorageAssistant.addVerseToFolder(folders[0], {Chapter: 1, VerseNumber: 1}))
			.then(() => StorageAssistant.addVerseToFolder(folders[0], {Chapter: 1, VerseNumber: 1}))
			return folders;
		})
		.then(async folders => {
			return {
				f1: await StorageAssistant.getFolderVerseIds(folders[0]),
			};
		})
		.then(({f1}) => {
			expect(f1).toStrictEqual(
				[
					{Chapter: 1, VerseNumber: 1}
				]
			);
		})
		.then(() => {done();});
	});
});
