import { Injectable } from '@angular/core';

@Injectable()
export class PersistenceService{

	constructor(){};

	// To store a single data locally
	public addData(key: string, data: Object){

		// check if key or data is null
		if(key !== null && data !== null){

			// check if the data is already existed
			if(localStorage.getItem(key)) {
				/*
				 * // I am not sure if this part is neccessary
				 * console.log("\t\tREPLACE with new value [y for yes, otherwise no] : ");
				 * var answer;
				 * // assign input to answer;
				 * if( answer === "y" || answer === "y")
				 */
				this.setData(key, JSON.stringify(data));
			}

			else{
				localStorage.setItem(key, JSON.stringify(data));
			}

		}
	} // end of saveData

	// To delete a single data from local by given KEY
	public deleteData(key: string){

		// remove the data
		if(localStorage.getItem(key)){
			localStorage.removeItem(key);
			console.log("\tSUCCEED: to remove " + key);
		}

		// the data corresponding to the KEY is not found
		else console.log("\tFAILE: to find " + key);

	} // end of deleteData

	// To get a single data from local by given KEY
	public getData(key: string){

		// get the value of the data
		if(localStorage.getItem(key)){
			console.log("\tSUCCEED: to find " + key);
			return JSON.parse(localStorage.getItem(key));
		}

		// the data corresponding to the KEY is not found
		else console.log("\tFAILE: to find " + key);

	} // end of getData

	// To change a single data by given KEY
	public setData(key: string, data: Object){

			localStorage.setItem(key, JSON.stringify(data));
			console.log("\tSUCCEED to change [KEY](" + key + ") with [DATA](" + JSON.stringify(data) + ")");
	}

} // end of PersistenceService
