const express = require('express');
const router = express.Router();
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";



router.get('/', isUserAuthenticated, (req, res, next) => {
	res.render('page/profile', { title: 'Welcome to Profile Page' });
});


module.exports = router;