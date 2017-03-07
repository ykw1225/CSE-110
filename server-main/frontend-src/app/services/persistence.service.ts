import { Injectable } from '@angular/core';

@Injectable()
export class PersistenceService{

	constructor(){};

	// To store a single data locally
	public saveData(key: string, data: Object){

		// check if key or data is null
		if(key !== null && data !== null){

			localStorage.setItem(key, JSON.stringify(data));

		}else
			console.log("\tERROR: Either [KEY] or [DATA] is inValid !!!");

	} // end of saveData

	// To delete a single data from local by given KEY
	public deleteData(key: string){

		// check if KEY is null
		if(key === null){
			console.log("\tERROR:[KEY] is inValid !!!");
			return;
		}

		// remove the data
		if(localStorage.getItem(key)){
			localStorage.removeItem(key);
			console.log("\tSuccess to remove " + key + " !!!");
		}

		// the data corresponding to the KEY is not found
		else
			console.log("\tERROR: " + key + " is not found !!!");

	} // end of deleteData

	// To get a single data from local by given KEY
	public getData(key: string){

		// check if KEY is null
		if(key === null){
			console.log("\tERROR:[KEY] is inValid !!!");
			return;
		}

		// get the value of the data
		if(localStorage.getItem(key)){
			console.log("\tSuccess to find " + key + " !!!");
			return JSON.parse(localStorage.getItem(key));
		}

		// the data corresponding to the KEY is not found
		else
			console.log("\tERROR: " + key + " is not found !!!");

	} // end of getData

} // end of PersistenceService
