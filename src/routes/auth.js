const express = require('express');
const router = express.Router();
const passport = require('passport');


//GET /auth/login/google
router.get('/login/google',
	passport.authenticate('google', {scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email'
	]}));

//GET /auth/google/return
router.get('/google/return', 
	passport.authenticate('google', { failureRedirect: '/failure' }),
	(req, res) => {
	//Successful login
		req.session.token = req.user.token;
		res.redirect("/home");
	});

//GET /auth/logout
router.get('/logout', (req, res) => {
	req.logout();
	res.send("logged OUT!");
});

module.exports = router;