require('dotenv').config();  // Get all of our secrets...

const algorithmia = require('algorithmia');
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

function callAlgo() {
	
	var input = {
		"points": ["Ankara"],
		"startpoint": "Ankara",
		"endpoint": "Istanbul"
	};
	client.algo("akadal/TSP/0.2.1")
		.pipe(input)
		.then(function (response) {
			console.log(response.get());
		});
}


function geoCode(){
	
	
	geocoder.geocode('r3p 2r5')
		.then(function(res) {
			console.log(res);
		})
		.catch(function(err) {
			console.log(err);
		});
}

callAlgo();

//geoCode();




