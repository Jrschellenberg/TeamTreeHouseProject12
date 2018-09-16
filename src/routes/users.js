const express = require('express');
const router = express.Router();
const User = require('../models/user');
import Utils from '../utilities/utils';
import { isUserAuthenticated, setResponseAPI, isUserAuthorized} from "../middleware/index";



router.get('/', setResponseAPI, isUserAuthenticated, isUserAuthorized, (req, res, next) => {
	User.findAll().then((userArray) => {
		res.status(200).json({ success: true, message: 'Users Successfully retrieved', status: 200, data: userArray });
	}).catch(next);
});

router.get('/:id', setResponseAPI, isUserAuthenticated, isUserAuthorized, (req, res, next) => {
	User.findUserById(req.params.id).then((user) => {
		res.status(200).json({ success: true, message: 'User Successfully retrieved', status: 200, data: user });
	}).catch(next);
});

router.get('/route/:id', setResponseAPI, isUserAuthenticated, isUserAuthorized, (req, res, next) => {
	User.getRoute(req.params.id).then((route) => {
		res.status(200).json({ success: true, message: 'User Route Successfully retrieved', status: 200, data: route });
	}).catch(next);
});

router.put('/phone/:id', setResponseAPI, isUserAuthenticated, (req, res, next) => {
	if(req.params.id.toString() !== res.locals.user._id.toString()){
		return Utils.throwError(403, 'Forbidden', '/profile', next);
	}
	if(!req.body.phoneNumber || !/^[0][1-9]\d{9}$|^[1-9]\d{9}$/g.test(req.body.phoneNumber)){
		return Utils.throwError(400, 'Bad Request', '/profile', next);
	}

	
	res.status(200).json({ success: true, message: "successfully Hit api", status: 200});
});

module.exports = router;
