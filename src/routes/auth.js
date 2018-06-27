const express = require('express');
const router = express.Router();
const passport = require('passport');


//GET /auth/login/google
router.get('/login/google',
	passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));

//GET /auth/google/return
router.get('/google/return', 
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
	//Successful login
		res.send("You Logged in Successfully yay!");
	});

//GET /auth/logout
router.get('/logout', (req, res) => {
	req.logout();
	res.send("logged OUT!");
});

module.exports = router;