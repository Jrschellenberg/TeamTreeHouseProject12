const express = require('express');
const router = express.Router();
import User from '../models/user';
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";

router.get('/', isUserAuthenticated, (req, res, next) => {
	User.getRoute(res.locals.user._id).then((route) => {
		res.render('page/profile', { title: 'Welcome to Profile Page', currentRoute: route});
	}).catch(next);
});

module.exports = router;