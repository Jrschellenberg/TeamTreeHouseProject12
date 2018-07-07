const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new mongoose.Schema({
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

const Route = mongoose.model('Route', RouteSchema);
module.exports = Route;