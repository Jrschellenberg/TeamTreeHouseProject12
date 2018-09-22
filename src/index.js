require('dotenv').config();  // Get all of our secrets...

const algorithmia = require('algorithmia-updated');
const client = algorithmia(process.env.ALGORITHMIA_API_KEY);
const nodeGeocoder = require('node-geocoder');



var accountSid = process.env.TWILIO_ACCOUNT_SID_SECRET; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var twilioClient = new twilio(accountSid, authToken);


const options = {
	provider: 'google',
	
	// Optional depending on the providers
	httpAdapter: 'https', // Default
	apiKey: process.env.GOOGLE_MAP_API_KEY, // for Mapquest, OpenCage, Google Premier
	formatter: null         // 'gpx', 'string', ...
};

const geocoder = nodeGeocoder(options);

function callAlgo() {
	console.log("hitting this");
	
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

function sendText(){
	
	
	twilioClient.messages.create({
		body: "How's it going missy? Love your Brother! :D",
		to: '+12042900973',  // Text this number
		from: '+12494955339' // From a valid Twilio number
	})
		.then((message) => console.log(message.sid));
	
	
}
//sendText();
callAlgo();

//geoCode();

//
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// var userSchema = new Schema({
// 	phone: {
// 		type: String,
// 		validate: {
// 			validator: function(v) {
// 				return /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g.test(v);
// 			},
// 			message: props => `${props.value} is not a valid phone number! Requires 10 Digit Phone Number, Area Code +  Number!`
// 		},
// 	}
// });
// const db = mongoose.connection;
// var User = db.model('user', userSchema);
// var user = new User();
// var error;
// //
// // user.phone = '555.0123';
// // error = user.validateSync();
// // console.log(error);
// //
// //
// // user.phone = '';
// // error = user.validateSync();
// // console.log(error);
// //
// //
// // user.phone = '201-555-0123';
// // // Validation succeeds! Phone number is defined
// // // and fits `DDD-DDD-DDDD`
// // error = user.validateSync();
// // console.log(error);
//
// user.phone = '12042900973';
// error = user.validateSync();
//
// console.log(error);
//
// user.phone = '2042900973';
// error = user.validateSync();
//
// console.log(error);
//
// user.phone = '11111111111';
// error = user.validateSync();
//
// console.log(error);



