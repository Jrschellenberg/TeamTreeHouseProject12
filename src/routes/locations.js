const express = require('express');
const router = express.Router();
const Location = require('../models/location');
import { isUserAuthenticated, setResponseAPI, isUserAuthorized} from "../middleware/index";



router.get('/', setResponseAPI, isUserAuthenticated, isUserAuthorized, (req, res, next) => {
	Location.findAll().then((locationArray) => {
		res.status(200).json({ success: true, message: 'Locations Successfully retrieved', status: 200, data: locationArray });
	}).catch(next);
});

router.get('/:id', setResponseAPI, isUserAuthenticated, isUserAuthorized, (req, res, next) => {
	Location.findUserById(req.params.id).then((location) => {
		res.status(200).json({ success: true, message: 'Location Successfully retrieved', status: 200, data: location });
	}).catch(next);
});


module.exports = router;
