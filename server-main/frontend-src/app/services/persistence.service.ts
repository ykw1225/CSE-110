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

		}

		// the data corresponding to the KEY is not found


	} // end of deleteData

	// To get a single data from local by given KEY
	public getData(key: string){
		// get the value of the data
		if(localStorage.getItem(key)){
			return JSON.parse(localStorage.getItem(key));
		}

		// the data corresponding to the KEY is not found
		
	} // end of getData

	// To change a single data by given KEY
	public setData(key: string, data: Object){
		localStorage.setItem(key, JSON.stringify(data));
	}

} // end of PersistenceService
