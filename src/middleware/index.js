import Utils from '../utilities/utils';
const User = require('../models/user');

const redirectUrl = '/';

function isAuthorized(req, res){
	return new Promise((resolve, reject) => {
		if(!req.params.id){
			req.params.id = ""; //Type force it.
		}
		if(res.locals.user.isAdmin || req.params.id.toString() === res.locals.user._id.toString()){
			return resolve();
		}
		reject(Utils.rejectError(403, "Forbidden"));
	});
}

export function setResponseAPI(req, res, next){
	res.locals.isAPICall = true;
	return next();
}

export function isUserAuthorized(req, res, next){
	isAuthorized(req, res).then(() => {
		return next();
	}).catch(next);
}

export function isUserAuthenticated(req, res, next){
	if(res.locals.testSession && req.query.sessionID){ //We Are currently running tests and wish to authenticate......
		req.session.passport = {};
		req.session.passport.user = req.query.sessionID;
	}
	if(!req.session || !req.session.passport || !req.session.passport.user){
		return Utils.throwError(401, 'You must be logged in to view Profile Assets, Please login now', redirectUrl, next);
	}
	let userId = req.session.passport.user;
	
	User.authenticate(userId).then((user) => {
		res.locals.user = user;
		return next();
	}).catch((next));
}