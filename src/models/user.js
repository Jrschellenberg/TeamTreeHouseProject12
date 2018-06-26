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
	currentStops: [{
		type: Schema.Types.ObjectId,
		ref: 'Location'
	}]
});


const User = mongoose.model('User', UserSchema);
module.exports = User;