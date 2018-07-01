//@ts-check

import Utils from '../utilities/utils';
const User = require('../models/user');
const request = require('request');
const secretCaptcha = process.env.RECAPTCHA_SECRET;

const redirectUrl = '/login';

export function loggedOut(req, res, next) {
	if(req.session && req.session.userId){
		return res.redirect('/profile');
	}
	return next();
}

export function setResponseAPI(req, res, next){
	res.locals.isAPICall = true;
	return next();
}

export function isUserAuthenticated(req, res, next){
	//console.log(req);
	console.log(req.session);
	console.log(req.passport);
	if(!req.session || !req.session.passport || !req.session.passport.user){
		console.log("this SHIT HITTING INSIDE IFF?")
		return Utils.throwError(401, 'You must be logged in to view Profile Assets, Please login now', redirectUrl, next);
	}
	let userId = req.session.passport.user;
	console.log(`THE USER ID IS ${userId}`);
	
	User.authenticate(userId).then((user) => {
		res.locals.user = user;
		return next();
	}).catch((status, err) => {
		return Utils.throwError(status, err, redirectUrl, next);
	});
}

export function getUser(req, res, next){
	if(req.session.passport.user){
		User.findById(req.session.passport.user)
			.exec(function (error, user) {
				if (error) {
					return next(error);
				}
				res.locals.user = user;
				return next();
			});
	}
	else { //Need the else or it will hit both next() and get race conditions...
		res.locals.user = "";
		return next();
	}
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