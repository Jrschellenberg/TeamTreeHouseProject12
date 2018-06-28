var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/failure', function(req, res, next) {
	res.render('index', { title: 'Failed To Login' });
});


router.get('/', function(req, res, next) {
	res.render('index', { title: 'Base Home Root' });
});


router.get('/', function(req, res, next) {
	res.render('index', { title: 'Base Home Root' });
});

module.exports = router;
