import { googleMapAPI, algorithmiaAPI } from "./secrets";

const Algorithmia = require('algorithmia');
const client = Algorithmia(algorithmiaAPI);
const NodeGeocoder = require('node-geocoder');

//let mapAPIKey = "AIzaSyCQClwazNXqYZJpilU-8L7Uow0GdtCFYrE";

var options = {
	provider: 'google',
	
	// Optional depending on the providers
	httpAdapter: 'https', // Default
	apiKey: googleMapAPI, // for Mapquest, OpenCage, Google Premier
	formatter: null         // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

function callAlgo() {
	
	var input = {
		"points": ["Ankara", "İzmir", "Eskişehir", "Afyonkarahisar", "Konya"],
		"startpoint": "İstanbul",
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

//callAlgo();

geoCode();




