const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import Utils from '../utilities/utils';

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
	}
});
LocationSchema.statics.findAll = function (){
	return new Promise(function(resolve, reject){
		Location.find()
			.exec(function(err, locations) {
				if(err){
					reject(Utils.rejectError(500, err.message));
				}
				let locationArray = [];
				locations.forEach(function(location) {
					locationArray.push(location);
				});
				resolve(locationArray);
			});
	});
};

LocationSchema.statics.findUserById = function (id){
	return new Promise(function(resolve, reject){
		Location.findOne({_id: id})
			.exec(function(err, location){
				if(err){
					reject(Utils.rejectError(500, err.message));
				}
				resolve(location);
			});
	});
};

LocationSchema.statics.saveLocation = function(location){
	return new Promise(function(resolve, reject){
		Location.findOne({postalCode: location.postalCode})
			.exec(function(err, location){
				if(err){
					reject(Utils.rejectError(500, err.message));
				}
				if(location){
					resolve(location); //location already exists in Db so just return it
				}
				//No location added to database yet, so lets add it!
			})
		
	});
};




const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;