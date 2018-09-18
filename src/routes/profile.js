const express = require('express');
const router = express.Router();
import User from '../models/user';
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";

router.get('/', isUserAuthenticated, (req, res, next) => {
	User.getRoute(res.locals.user._id).then((route) => {
		let phone = false;
		if(!route){
			route = false;
		}
		if(res.locals.user.phoneNumber){
			phone = res.locals.user.phoneNumber;
		}
		res.render('page/profile', { title: 'Welcome to Profile Page', currentRoute: route, phoneNumber: phone, baseURL: res.locals.baseURL});
	}).catch(next);
});

module.exports = router;