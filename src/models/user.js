const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const User = mongoose.model('User', UserSchema);

UserSchema.statics.authenticate = function (id, callback){
	User.findOne({_id: id})
		.exec(function(err, user){
			if (err){
				return callback(500, err);
			}
			else if(!user){
				return callback(401, new Error("User was not found Please Authenticate First!"));
			}
			return callback(200, null, user); //User was found, return user
		});
};

UserSchema.statics.findAll = function (isAdmin){
	return new Promise(function(resolve, reject){
		if(!isAdmin){
			reject(403, "Forbidden");
		}
		User.find()
			.exec(function(err, users) {
				if(err){
					reject(500, err);
				}
				let userArray = [];
				users.forEach(function(user) {
					userArray.push(user);
				});
				resolve(userArray);
			});
	});
};




module.exports = User;