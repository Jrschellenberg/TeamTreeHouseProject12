import Utils from '../utilities/utils';
const User = require('../models/user');
const Request = require('../models/request');



/*
This middleware will be the sub controller, calling the functions below to break code into smaller chunks.
 */
export function handleRequest(req, res, next) {
	getRequest(req.session.passport.user).then((request) => {
		console.log(request)
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

export function isRequestAllowed(request){
	return new Promise((resolve, reject) => {
		
		
	})
	
}