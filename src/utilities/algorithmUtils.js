require('dotenv').config();  // Get all of our secrets...
const algorithmia = require('algorithmia-updated');
const client = algorithmia(process.env.ALGORITHMIA_API_KEY);
const nodeGeocoder = require('node-geocoder');
const options = {
	provider: 'google',
	
	// Optional depending on the providers
	httpAdapter: 'https', // Default
	apiKey: process.env.GOOGLE_MAP_API_KEY, // for Mapquest, OpenCage, Google Premier
	formatter: null         // 'gpx', 'string', ...
};

const geocoder = nodeGeocoder(options);


export default class AlgorithmUtils {
	static setStartTime(time){
		AlgorithmUtils.startTime = time;
	}
	static getTimeAlgorithmTakes(){
		if(!AlgorithmUtils.startTime){
			return -1;
		}
		return Math.ceil((Date.now() - AlgorithmUtils.startTime) / 1000);
	}
	
	static createInput(reqBody){
		return {
			"points": reqBody.points,
			"startpoint": reqBody.startpoint,
			"endpoint": reqBody.endpoint,
			"api": process.env.GOOGLE_MAP_API_KEY
		};
	}
	
	static computeAlgorithm(reqBody){
		return new Promise((resolve, reject) => {
			console.log("Req body is", reqBody);
			client.algo("akadal/TSP/0.2.1")
				.pipe(AlgorithmUtils.createInput(reqBody))
				.then(response => {
					let timeTaken = AlgorithmUtils.getTimeAlgorithmTakes();
					console.log(`time taken to execute algorithm was ${timeTaken} seconds`);
					let algoResponse = response.get();
					console.log(algoResponse);
					if(Array.isArray(algoResponse)){
						return resolve(algoResponse, timeTaken);
					}
					return reject("An error occured while computing your map.");
				});
		});
	}
	
	static convertResponseToObject(array){
		return array.map((val) => {
			let strArray = val.split(',');
			return {
				lat: strArray[0],
				lon: strArray[1]
			};
		})
	}
	
	static reverseGeoCode(obj){
		return new Promise((resolve, reject) => {
			geocoder.reverse(obj)
				.then(function(res) {
					resolve(res);
				})
				.catch(function(err) {
					reject(err);
				});
		});
	}
	static createLocationModel(address){
		let item = address[0];
		return {
			streetAddress: item.formattedAddress,
			province: item.administrativeLevels.level1long,
			postalCode: item.zipcode,
			lat: item.latitude,
			long: item.longitude,
			isGeoEncoded: true
		}
	}
	
	
	static calculateRoute(locations){
		
		
		
	}
	
	
}