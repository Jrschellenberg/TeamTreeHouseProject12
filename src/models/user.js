const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import Utils from '../utilities/utils';

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	firstName: {
		type: String,
		required: false,
		trim: true
	},
	lastName: {
		type: String,
		required: false,
		trim: true
	},
	isAdmin: {
		type: Boolean,
		required: false
	},
	request: {
		type: Schema.Types.ObjectId,
		ref: 'Request',
		required: true // To enforce that request table is already initialized?
	},
	currentStops: {
		type: Schema.Types.ObjectId,
		ref: 'CurrentRoute'
	}
});
UserSchema.statics.authenticate = function (id){
	return new Promise(function(resolve, reject){
		User.findOne({_id: id})
			.exec(function(err, user){
				if (err){
					if(err.message.toLowerCase().includes('cast to objectid failed')){
						reject(Utils.rejectError(422, "Unprocessable Entity"));
					}
					reject(Utils.rejectError(500, err.message));
				}
				else if(!user){
					reject(Utils.rejectError(401,"Unauthorized"));
				}
				resolve(user); //User was found, return user
			});
	});
};

UserSchema.statics.findAll = function (){
	return new Promise(function(resolve, reject){
		User.find()
			.exec(function(err, users) {
				if(err){
					reject(Utils.rejectError(500, err.message));
				}
				let userArray = [];
				users.forEach(function(user) {
					userArray.push(user);
				});
				resolve(userArray);
			});
	});
};

UserSchema.statics.findUserById = function (id){
	console.log("hit this?!?!");
	return new Promise(function(resolve, reject){
		User.findOne({_id: id})
			.exec(function(err, user){
				if(err){
					console.log("we hitting error here?");
					console.log(err.message);
					reject(Utils.rejectError(500, err.message));
				}
				resolve(user);
			});
	});
};

const User = mongoose.model('User', UserSchema); // This has to be after methods defined, or fails..

module.exports = User;