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
		unique: true
	},
	long: {
		type: String,
		unique: true
	},
	isGeoEncoded: {
		type: Boolean
	}
});


const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;