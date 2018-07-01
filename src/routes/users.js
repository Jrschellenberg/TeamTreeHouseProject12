import Utils from '../utilities/utils';
var express = require('express');
var router = express.Router();
const User = require('../models/user');
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";

/* GET users listing. */
// router.get('/', (req, res, next) => {
// 	// if (!req.session || !req.session.userId) {
// 	// 	return Utils.throwError(401, 'Invalid or missing SessionId', next);
// 	// }
// 	User.findById(req.session.userId)
// 		.exec((err, user) => {
// 			if (err) { return Utils.propagateError(err, 400, next) }
// 			let status = 200;
//			
// 			res.status(status).json({ success: true, message: 'User Successfully retrieved', status: status, user: user });
// 		});
// });


router.get('/', setResponseAPI, isUserAuthenticated, (req, res, next) => {
	User.findAll(res.locals.user.isAdmin).then((userArray) => {
		res.status(200).json({ success: true, message: 'Users Successfully retrieved', status: 200, users: userArray });
	}).catch((status, err) => {
		return Utils.throwError(status, err, null, next);
	});
});


module.exports = router;
