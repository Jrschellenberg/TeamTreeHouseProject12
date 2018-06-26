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
	isStartAddress: {
		type: Boolean,
		unique: true,
		default: false
	},
	isEndAddress: {
		type: Boolean,
		unique: true,
		default: false
	}
});


const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;