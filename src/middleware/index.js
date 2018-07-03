
import Utils from '../utilities/utils';
const User = require('../models/user');
const request = require('request');
const secretCaptcha = process.env.RECAPTCHA_SECRET;

const redirectUrl = '/login';


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

export function passCaptcha(req, res, next){
	if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' ||	req.body['g-recaptcha-response'] === null){
		let status = 422;
		return res.status(status).json({success: false, status: status, message:"", errorMessage: "Please Select captcha"});
	}
	const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretCaptcha}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;
	
	request(verifyUrl, (err, response, body) => {
		body = JSON.parse(body);
		if(body.success !== undefined && !body.success){
			Utils.logWarning(body);
			let status = 400;
			return res.status(status).json({success: false, status: status, message:"", errorMessage: "Captcha URL potentially malformed, Please try again."});
		}
		next();
	});
}

function isAuthorized(req, res){
	return new Promise((resolve, reject) => {
		if(res.locals.user.isAdmin || req.params.id.toString() === res.locals.user._id.toString()){
			resolve();
		}
		else {
			reject(Utils.rejectError(403, "Forbidden"));
		}
	});
}