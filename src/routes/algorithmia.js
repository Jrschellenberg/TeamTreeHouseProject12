import AlgorithmUtils from '../utilities/algorithmUtils';
import Utils from '../utilities/utils';
const express = require('express');
const router = express.Router();

import { isUserAuthenticated, setResponseAPI} from "../middleware/index";

router.post('/', setResponseAPI, isUserAuthenticated, (req, res, next) => {
	if(!req.body || !req.body.points || !Array.isArray(req.body.points) || req.body.points.length === 0 ||
		!req.body.startpoint || typeof req.body.startpoint  !== 'string' || !req.body.endpoint || typeof req.body.endpoint !== 'string' ){
		return Utils.throwError(422, 'Unprocessable Entity', '/profile', next);
	}
	AlgorithmUtils.setStartTime(Date.now());
	
	AlgorithmUtils.computeAlgorithm(req.body)
		.then((algoResponse, timeTaken) => {
			res.status(200).json({ success: true, message: 'successfully called API', status: 200, data: algoResponse, algoTime: timeTaken });
		})
		.catch(error => {
			return Utils.throwError(503, error, '/profile', next);
		});
});

module.exports = router;