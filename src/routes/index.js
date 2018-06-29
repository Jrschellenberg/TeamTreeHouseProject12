var express = require('express');
var router = express.Router();

router.use('/api/users', require('./users'));
router.use('/auth', require('./auth'));



/* GET home page. */
router.get('/home', function(req, res, next) {
  //console.log(req.session.passport.user);
  res.render('index', { title: 'The home Page' });
});


router.get('/failure', function(req, res, next) {
	res.render('index', { title: 'Failed To Login' });
});


router.get('/', function(req, res, next) {
	res.render('index', { title: 'Base Home Root' });
});


// router.get('/', function(req, res, next) {
// 	res.render('index', { title: 'Base Home Root' });
// });

module.exports = router;
