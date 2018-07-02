import Utils from '../utilities/utils';
const User = require('../models/user');
const Request = require('../models/request');

let currentNumberRequestAttempts;

/*
This middleware will be the sub controller, calling the functions below to break code into smaller chunks.
 */

// export default class Request {
//	
//	
// }

export function handleRequest(req, res, next) {
	getRequest(req.session.passport.user).then((request) => {
		console.log(request) // This test passes.
	}).catch(next);
}

export function getRequest(id){
	return new Promise((resolve, reject) => {
		User.getRequest(id).then((request) => {
			resolve(request);
		}).catch((err) => {
			reject(err);
		});
	});
}

// export function isRequestAllowed(request){
// 	return new Promise((resolve, reject) => {
// 		if(request.)
// 		resolve(true);
// 		if(request.isRequestLimitMaximumHit || ){
// 			reject(Utils.rejectError(429, "Too Many Requests"));
// 		}
// 	});
// }

export function convertDateUnix(date){
	return date.getTime();
}

export function isRequestCooldownTimePassed(lastRequestTimeStamp, requestLimitHitTimeStamp, requestCooldown){
	return (convertDateUnix(lastRequestTimeStamp) - convertDateUnix(requestLimitHitTimeStamp))
		> requestCooldown;
}

// export function resetCoolDown