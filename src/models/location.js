const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new mongoose.Schema({
	streetAddress: {
		type: String,
		required: true,
		unique: true
	},
	province: {
		type: String,
		required: false,
		trim: true
	},
	postalCode: {
		type: String,
		required: true,
		unique: true
	},
	lat: {
		type: String,
		default: null
	},
	long: {
		type: String,
		default: null
	},
	isGeoEncoded: {
		type: Boolean,
		default: false
	},
	isStartingAddress: {
		type: Boolean,
		default: false,
	},
	isEndingAddress: {
		type: Boolean,
		default: false
	}
});

// TODO: SEPARATE OUT THIS TABLE, WILL NEED ANOTHER ONE FOR ROUTE?
// TODO: ADD A VALIDATOR METHOD IN HERE TO ENSURE ONLY 1 IS STARTING OR ENDING ADDRESS


// LocationSchema.pre('save', function(next){
// 	let startingAddressQuery = LocationSchema.where({isStartingAddress: true}).count();
// 	let endAddressQuery = LocationSchema.where({isEndingAddress: true}).count();
//	
// 	if(startingAddressQuery > 1 || endAddressQuery > 1){
// 		return next(new Error("Can't have more than one starting or ending address!"));
// 	}
// });


const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;