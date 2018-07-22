require('dotenv').config();  // Get all of our secrets...

import Utils from '../utilities/utils';
const express = require('express');
const router = express.Router();
const algorithmia = require('algorithmia');
const client = algorithmia(process.env.ALGORITHMIA_API_KEY);


import { isUserAuthenticated, setResponseAPI} from "../middleware/index";



router.post('/', setResponseAPI, isUserAuthenticated, (req, res, next) => {
	let startTime = Date.now();
	console.log(req.body);
	
	if(!req.body || !req.body.points || !req.body.startpoint || !req.body.endpoint){
		return Utils.throwError(422, 'Unprocessable Entity', '/profile', next);
	}
	let input = {
		"points": req.body.points,
		"startpoint": req.body.startpoint,
		"endpoint": req.body.endpoint
	};
	console.log(input);
	
	client.algo("akadal/TSP/0.2.1")
		.pipe(input)
		.then(response => {
			let timeTaken = Math.floor((Date.now() - startTime) / 1000);
			console.log(`time taken to execute algorithm was ${timeTaken} seconds`)
			
			let algoResponse = response.get();
			console.log(algoResponse);
			// Do some writing using modals at this point.....
			res.status(200).json({ success: true, message: 'successfully called API', status: 200, data: algoResponse, algoTime: timeTaken });
			
		});
});


module.exports = router;