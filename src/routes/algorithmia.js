const express = require('express');
const router = express.Router();
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";



router.post('/', setResponseAPI, isUserAuthenticated, (req, res, next) => {
	console.log("HITTING THIS !!!");
	console.log(req.body);
	res.status(200).json({ success: true, message: 'successfully called API', status: 200 });
});


module.exports = router;