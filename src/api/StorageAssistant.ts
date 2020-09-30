import { Plugins } from '@capacitor/core';
import { IVerseSignature } from './Interfaces';
const { Storage } = Plugins;

export interface IFolder {
	id: number,
	name: string,
	memoryLocation: string,
	order: number,
	notificationsOn: boolean
}

export default class StorageAssistant{

	storedIDs:Array<Number> = [];

	async loadFile(){
		const  data  =  await Storage.get({ key: 'index' });
		if(data.value!=null){
			this.storedIDs = await JSON.parse(data.value)
		}
	}

	BookmarkVerse(VerseID:Number){
		if (this.isBookmarked(VerseID)){
			return;
		}

		this.storedIDs.push(VerseID);
		Storage.set({
			key: "index",
			value: JSON.stringify(this.storedIDs)
		})
	}

	removeBookmark(VerseID:Number){
		if(!this.isBookmarked(VerseID)){
			return; //if it is not in the list
		}

		//get the index of the verse
		var index = this.storedIDs.indexOf(VerseID);

		this.storedIDs.splice(index, 1);

		Storage.set({
			key: "index",
			value: JSON.stringify(this.storedIDs)
		})
	}

	isBookmarked(VerseID:Number) : boolean{
		return this.storedIDs.indexOf(VerseID) !== -1;
	}

	// a unique key name in memory to store a folder's verses
	static getFolderKey(folderName:string) : string {
		return "folder-memory-key-"+folderName;
	}

	// get list of folders
	static async getFolders() : Promise<Array<IFolder>> {
		return Storage.get({key: "folders"})
			.then((json) : Promise<Array<IFolder>> => (json.value) ?
				JSON.parse(json.value): // folders do exist
				[])						// folders do not exist
	}

	// set list of folders
	static async setFolders(existingFolders : Array<IFolder>) {
		// persist the folders
		return Storage.set({
			key: "folders",
			value: JSON.stringify(existingFolders)
		});
	}

	// creates a new folder. throws an error if folder already exists
	static async createFolder(folderName:string) {

		// append new folder
		return this.getFolders()
		.then(existingFolders => {
			// check that folder does not already exist
			const alreadyExists = existingFolders.some(folder => folder.name === folderName);
			if (alreadyExists) { throw new Error("Folder "+folderName+" already exists."); }
			
			// list ordering
			const maxOrder = existingFolders.reduce<number>((order:number, folder) => {
				return Math.max(order, folder.order);
			},
			-1 // initial value
			);
			const order = maxOrder + 1;

			// id
			const maxId = existingFolders.reduce<number>((id:number, folder) => {
				return Math.max(id, folder.id);
			},
			-1 // initial value
			);
			const id = maxId + 1;
			
			existingFolders.push({
				id,
				name: folderName,
				memoryLocation: this.getFolderKey(folderName),
				order,
				notificationsOn: false // by default notifications are off.
			});
			return existingFolders;
		})

		// persist the folders
		.then(existingFolders => this.setFolders(existingFolders));
	}

	static async deleteFolder(folder : IFolder) {
		// refresh folder data
		return this.getFolders()
		.then((folders : Array<IFolder>) => {
			const toRemove = folders.find(f => f.id === folder.id);
			if (toRemove === undefined) throw new Error("Folder not found.");
			return {folders, toRemove}
		})
		
		// delete
		.then(({folders, toRemove}) => {

			// recreate array
			const removeId = toRemove.id;
			const removeOrder = toRemove.order;
			return folders.reduce<Array<IFolder>>((editedFolders, currentFolder) => {

				// shift forward the order
				if (currentFolder.order > removeOrder) {
					--currentFolder.order;
				}

				// add folder to array 
				if (currentFolder.id !== removeId) {
					return [...editedFolders, currentFolder] // use of spread operator...
				}

				// do not add folder to array
				else {
					return editedFolders;
				}
			}, []);
		})

		// persist the folders
		.then(editedFolders => this.setFolders(editedFolders));
	}

	// rename a folder
	static async renameFolder(folder : IFolder, name : string) {

		// refresh folder data
		return this.getFolders()
		.then((folders : Array<IFolder>) => {
			const toRename = folders.find(f => f.id === folder.id);
			if (toRename === undefined) throw new Error("Folder not found.");
			toRename.name = name; // rename the folder
			return folders;
		})
		
		// persist the folders
		.then(editedFolders => this.setFolders(editedFolders));
	}

	// reorder the folders
	static async reorderFolders(folder : IFolder, newOrder : number) {
		// refresh folder data
		return this.getFolders()
		.then((folders : Array<IFolder>) => {
			const toReorder = folders.find(f => f.id === folder.id);
			if (toReorder === undefined) throw new Error("Folder not found.");
			return {folders, toReorder}
		})

		// reorder folders
		.then(({folders, toReorder}) => {
			const oldOrder = toReorder.order;

			// shift order up
			if (oldOrder < newOrder) {
				return folders.map(folder => {
					// bump up
					if (folder.order === oldOrder) {
						folder.order = newOrder;
					}
					// bump down
					else if (folder.order <= newOrder && folder.order > oldOrder) {
						--folder.order;
					}
					return folder;
				});
			}

			// shift order down
			if (oldOrder > newOrder) {
				return folders.map(folder => {
					// bump down
					if (folder.order === oldOrder) {
						folder.order = newOrder;
					}
					// bump up
					else if (folder.order >= newOrder && folder.order < oldOrder) {
						++folder.order;
					}
					return folder;
				});
			}

			// no work to be done
			return folders;
		})

		// persist the folders
		.then(reorderedFolders => this.setFolders(reorderedFolders));
	}

	static async setFolderNotifications(folder : IFolder, notificationsOn : boolean) {
		return this.getFolders()
		.then(folders => {
			return folders.map(f => (f.id === folder.id) ? {...f, notificationsOn} : f)
		})
		.then(folders => {
			this.setFolders(folders);
		});
	}
	
	// get list of folder verse ids
	static async getFolderVerseIds(folder : IFolder) : Promise<Array<IVerseSignature>> {
		return Storage.get({ key: folder.memoryLocation })
		.then (data => {
			if (!data.value) { throw new Error("verses not found"); }
			return (data.value) ? JSON.parse(data.value) : [];
		});
	}

	// add a verse id to folder. rejects on verse already exists
	static async addVerseToFolder(folder : IFolder, verseSignature : IVerseSignature) {
		// refresh folder data
		return this.getFolders()

		.then(folders => {
			const f = folders.find(f => f.id === folder.id)
			if (!f) { throw new Error("folder not found"); }
			return f;
		})
		.then(f => this.getFolderVerseIds(f))
		.then(verseArray => {
			verseArray.push(verseSignature) // append to list
			console.log(verseArray);
			return Storage.set({
				key: folder.memoryLocation,
				value: JSON.stringify(verseArray)
			});
		})
	}
}

