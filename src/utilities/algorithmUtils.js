require('dotenv').config();  // Get all of our secrets...

//import "core-js/es7/object";
const algorithmia = require('algorithmia-updated');
const client = algorithmia(process.env.ALGORITHMIA_API_KEY);
const nodeGeocoder = require('node-geocoder');
const distance = require('google-distance-matrix');

distance.key(process.env.GOOGLE_MAP_API_KEY);
distance.mode('driving');

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
	
	
	static queryDistances(data){
		return new Promise((resolve, reject) => {
      const {points, startpoint, endpoint} = data;
      
      let origins = JSON.parse(JSON.stringify(points)); //deep copy
      origins.unshift(startpoint);
      
      let destinations = JSON.parse(JSON.stringify(points));
      destinations.push(endpoint);
			
      distance.matrix(origins, destinations, (err, distances) => {
        if (!err){
        	let data = {distances: distances, origins: origins, destinations: destinations};
          resolve(data);
        }
        reject(err);
      });
		})
	}
	
	static calculateDistancesArray(distances, origins, destinations){

		let possibleCombinations = [];
		
		for(let i = 0; i<distances.rows.length; i++){
			for(let j = 0; j < distances.rows[i].elements.length; j++){
				let addValue = true;
				let value = distances.rows[i].elements[j].distance.value;
				//console.log(`Hit Loop i = ${i} And J = ${j}`);
				if(value !== 0){
					for(let k=0; k < possibleCombinations.length; k++){
						if(possibleCombinations[k].origin === destinations[j] && possibleCombinations[k].destination === origins[i]){
							addValue = false;
						}
					}
					if(addValue){
            let obj = {};
            obj.origin = origins[i];
            obj.destination = destinations[j];
            obj.distanceValue = value;
            possibleCombinations.push(obj);
					}
				}
			}
		}
		
		console.log(possibleCombinations);
		return possibleCombinations;
	}
	
	
	static findShortestPath(data, dictionary) {
		const {points, startpoint, endpoint } = data;
		const paths = startpoint === endpoint ? 1 + points.length : 2 + points.length;
		let currentLocation = null;
		let suitableSelections;
		
		console.log(paths);
		for(let i=0; i<paths; i++){
			if(i === 0){ // we know we are on start point.
				currentLocation = startpoint;
			}	
			suitableSelections = dictionary.filter((distancePoint) => { // Get locations 
				return distancePoint.origin === currentLocation;
			});
			
			
		}
	}
  
  
  /**
   * BRUTE FORCE approach to solve Traveling Salesman Problem.
   *
   * @param {Graph} graph
   * @return {GraphVertex[]}
   */
  static bfTravellingSalesman(graph) {
    // Pick starting point from where we will traverse the graph.
    const startVertex = graph.getAllVertices()[0];
    
    // BRUTE FORCE.
    // Generate all possible paths from startVertex.
    const allPossiblePaths = findAllPaths(startVertex);
    
    // Filter out paths that are not cycles.
    const allPossibleCycles = allPossiblePaths.filter((path) => {
      /** @var {GraphVertex} */
      const lastVertex = path[path.length - 1];
      const lastVertexNeighbors = lastVertex.getNeighbors();
      
      return lastVertexNeighbors.includes(startVertex);
    });
    
    // Go through all possible cycles and pick the one with minimum overall tour weight.
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const verticesIndices = graph.getVerticesIndices();
    let salesmanPath = [];
    let salesmanPathWeight = null;
    for (let cycleIndex = 0; cycleIndex < allPossibleCycles.length; cycleIndex += 1) {
      const currentCycle = allPossibleCycles[cycleIndex];
      const currentCycleWeight = getCycleWeight(adjacencyMatrix, verticesIndices, currentCycle);
      
      // If current cycle weight is smaller then previous ones treat current cycle as most optimal.
      if (salesmanPathWeight === null || currentCycleWeight < salesmanPathWeight) {
        salesmanPath = currentCycle;
        salesmanPathWeight = currentCycleWeight;
      }
    }
    
    // Return the solution.
    return salesmanPath;
  }
  
  
}

/**
 * Get all possible paths
 * @param {GraphVertex} startVertex
 * @param {GraphVertex[][]} [paths]
 * @param {GraphVertex[]} [path]
 */
function findAllPaths(startVertex, paths = [], path = []) {
  // Clone path.
  const currentPath = [...path];
  
  // Add startVertex to the path.
  currentPath.push(startVertex);
  
  // Generate visited set from path.
  const visitedSet = currentPath.reduce((accumulator, vertex) => {
    const updatedAccumulator = { ...accumulator };
    updatedAccumulator[vertex.getKey()] = vertex;
    
    return updatedAccumulator;
  }, {});
  
  // Get all unvisited neighbors of startVertex.
  const unvisitedNeighbors = startVertex.getNeighbors().filter((neighbor) => {
    return !visitedSet[neighbor.getKey()];
  });
  
  // If there no unvisited neighbors then treat current path as complete and save it.
  if (!unvisitedNeighbors.length) {
    paths.push(currentPath);
    
    return paths;
  }
  
  // Go through all the neighbors.
  for (let neighborIndex = 0; neighborIndex < unvisitedNeighbors.length; neighborIndex += 1) {
    const currentUnvisitedNeighbor = unvisitedNeighbors[neighborIndex];
    findAllPaths(currentUnvisitedNeighbor, paths, currentPath);
  }
  
  return paths;
}

/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @return {number}
 */
function getCycleWeight(adjacencyMatrix, verticesIndices, cycle) {
  let weight = 0;
  
  for (let cycleIndex = 1; cycleIndex < cycle.length; cycleIndex += 1) {
    const fromVertex = cycle[cycleIndex - 1];
    const toVertex = cycle[cycleIndex];
    const fromVertexIndex = verticesIndices[fromVertex.getKey()];
    const toVertexIndex = verticesIndices[toVertex.getKey()];
    weight += adjacencyMatrix[fromVertexIndex][toVertexIndex];
  }
  
  return weight;
}
