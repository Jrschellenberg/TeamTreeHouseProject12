const express = require('express');
const router = express.Router();

router.use('/api/users', require('./users'));
router.use('/api/locations', require('./locations'));
router.use('/auth', require('./auth'));
router.use('/profile', require('./profile'));



/* GET home page. */
router.get('/home', function(req, res, next) {
  //console.log(req.session.passport.user);
  res.render('page/index', { title: 'The home Page' });
});

router.get('/failure', function(req, res, next) {
	res.render('page/index', { title: 'Failed To Login' });
});


router.get('/', function(req, res, next) {
	res.render('page/index', { title: 'Base Home Root' });
});



module.exports = router;
