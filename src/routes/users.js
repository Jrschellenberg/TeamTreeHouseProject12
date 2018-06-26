var express = require('express');
var router = express.Router();
const User = require('../models/user');

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


router.get('/', (req, res, next) => {
	// if (!req.session || !req.session.userId) {
	// 	return Utils.throwError(401, 'Invalid or missing SessionId', next);
	// }

	User.find()
		.exec((err, users) => {
			//if (err) { return Utils.propagateError(err, 400, next) }
      let userMap = {};
      
      users.forEach((user) => {
        userMap[user._id] = user;
      });
			let status = 200;
			
			res.status(status).json({ success: true, message: 'User Successfully retrieved', status: status, users: userMap });
		});
});


module.exports = router;
