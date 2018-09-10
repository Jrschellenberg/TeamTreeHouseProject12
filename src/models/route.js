const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import Utils from '../utilities/utils';


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

RouteSchema.statics.saveRoute = function(route, isRouteExist){
	return new Promise(function(resolve, reject){
		console.log("route is ", route);
		console.log("isRouteExist", isRouteExist);
		Route.findByIdAndUpdate(isRouteExist, route, {upsert: true, new: true}, function(err, route){
			if(err){
				console.log("erroring right HERE");
				reject(Utils.rejectError(500, err.message));
			}
			resolve(route);
		});
	});
};


const Route = mongoose.model('Route', RouteSchema);
module.exports = Route;