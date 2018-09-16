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
}
, {
	toObject: {
		transform: function (doc, ret) {
			delete ret._id;
			delete ret.__v;
		}
	},
	toJSON: {
		transform: function (doc, ret) {
			delete ret._id;
			delete ret.__v;
		}
	}
}
);

RouteSchema.statics.saveRoute = function(route, isRouteExist){
	return new Promise(function(resolve, reject){
		if(isRouteExist){ // if route already exists, only update it.
			Route.findByIdAndUpdate(isRouteExist, route, {upsert: true, new: true}, function(err, route){
				if(err){
					console.log("erroring right HERE");
					reject(Utils.rejectError(500, err.message));
				}
				resolve(route);
			});
		}
		else{ // Create a new document.
			Route.create(route, function(err, createdDoc){
				if(err){
					reject(Utils.rejectError(500, err.message));
				}
				resolve(createdDoc);
			});
		}
	});
};


const Route = mongoose.model('Route', RouteSchema);
module.exports = Route;