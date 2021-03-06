import AlgorithmUtils from '../utilities/algorithmUtils';
import Utils from '../utilities/utils';
import Location from '../models/location';
import Route from '../models/route';
import User from '../models/user';
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";
const express = require('express');
const router = express.Router();
let geoEncode = null,
	endPoint = null,
	actions = null,
	savedLocation = null,
	routeModel;

router.post('/', setResponseAPI, isUserAuthenticated, (req, res, next) => {
	if(res.locals.testSession && req.body.points[0]){ // This is for Testing Purposes...
		req.body.points = [req.body.points[0]];
	}
	if(!req.body || !req.body.points || !Array.isArray(req.body.points) || req.body.points.length === 0 ||
		!req.body.startpoint || typeof req.body.startpoint  !== 'string' || !req.body.endpoint || typeof req.body.endpoint !== 'string' ){
		return Utils.throwError(422, 'Unprocessable Entity', '/profile', next);
	}
	
	AlgorithmUtils.computeAlgorithm(req.body)
		.then((algoResponse) => {
			geoEncode = AlgorithmUtils.convertResponseToObject(algoResponse);
      routeModel = {};
      routeModel.stops = new Array(geoEncode.length); // predeclare our array to be of size of our geoencode size.
			//console.log("geoEncode is", geoEncode);
			endPoint = geoEncode.length -1;
			actions = geoEncode.map((item, index) => {
				return new Promise((resolve) => {
					AlgorithmUtils.reverseGeoCode(item)
						.then((item) => {
							//console.log(`INDEX ${index} IS CONTAINING ITEM ${item}`);
							savedLocation = AlgorithmUtils.createLocationModel(item);
							Location.saveLocation(savedLocation).then(location => {
								if (index === 0) {
									routeModel.startingAddress = location._id;
								}
								else if (index === endPoint) {
									routeModel.endingAddress = location._id;
								}
								routeModel.stops[index] = location._id ; // Set all of them into the stops array.

								resolve();
							}).catch(next);
						});
				});
			});
			let results = Promise.all(actions);
			results.then(() => {
				//if all of the requests sucessfully completed
				routeModel.stops.splice(0,1); //remove first element from array, the starting address
        routeModel.stops.pop(); //remove last element from array, the ending address
				let currentUserStops = null;
				if(res.locals.user.currentStops){// if user currently has stops set, delete them from the DB
					currentUserStops = res.locals.user.currentStops;
				}
				Route.saveRoute(routeModel, currentUserStops)
					.then((route) => {
						// Need to now update the User.......
						User.updateRoute(res.locals.user, route._id)
							.then((user) => {
								User.getRoute(user._id).then((usersRoute) => {
									//console.log(usersRoute);
									res.status(200).json({ success: true, message: 'User Route Successfully retrieved', status: 200, data: usersRoute });
								}).catch(next);
							}).catch(next);
					}).catch(next);
			});
		})
		.catch(error => {
			return Utils.throwError(503, error, '/profile', next);
		});
});
module.exports = router;
