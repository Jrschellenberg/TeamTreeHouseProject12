require('dotenv').config();  // Get all of our secrets...
const algorithmia = require('algorithmia');
const client = algorithmia(process.env.ALGORITHMIA_API_KEY);

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
			"endpoint": reqBody.endpoint
		};
	}
	
	static computeAlgorithm(reqBody){
		return new Promise((resolve, reject) => {
			client.algo("akadal/TSP/0.2.1")
				.pipe(AlgorithmUtils.createInput(reqBody))
				.then(response => {
					let timeTaken = AlgorithmUtils.getTimeAlgorithmTakes();
					console.log(`time taken to execute algorithm was ${timeTaken} seconds`);
					let algoResponse = response.get();
					console.log(algoResponse);
					console.log();
					if(Array.isArray(algoResponse)){
						return resolve(algoResponse, timeTaken);
					}
					return reject("An error occured while computing your map.");
				});
		});
	}
	
	
	
}