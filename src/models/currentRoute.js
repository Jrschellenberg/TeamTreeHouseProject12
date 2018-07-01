const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrentRouteSchema = new mongoose.Schema({
	stops: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Location',
			default: null
		}
	],
	startingAddress: {
		type: Schema.Types.ObjectId,
		ref: 'Location',
		default: null,
	},
	endingAddress: {
		type: Schema.Types.ObjectId,
		ref: 'Location',
		default: null
	}
});

const CurrentRoute = mongoose.model('CurrentRoute', CurrentRouteSchema);
module.exports = CurrentRoute;