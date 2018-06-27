const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const seeder = require('mongoose-seed');
const data = require('./data/seedData.json');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('./models/user');

import {googleAuthClientId,googleAuthClientSecret} from "./secrets";

const config = require('config');

console.log("hit here?");
console.log(process.NODE_ENV);

const dbConfig = config.get('DBHost');

console.log(dbConfig);

const course = require('./routes/index');
const user = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

//Configure google Strategy.
passport.use(new GoogleStrategy({
	clientID: googleAuthClientId,
	clientSecret: googleAuthClientSecret,
	callbackURL: "http://localhost:3000/auth/google/return"
}, function(acessToken, refreshToken, profile, done){
	console.log("profile is");
	console.log(profile);
	//TODO: ADD CHECK IF FIRST USER BEING ADDED TO DATABASE, MAKE THEM ADMIN!
	
	
	//TODO: SET UP MONGOOSE ADD/UPDATE METHOD HERE FOR USER WHEN THEY LOG INTO APP
	// User.findOneAndUpdate({
	// 	email: profile.emails[0].value
	// }, {
	// 	name: profile.displayName || profile.username,
	// 	email: profile.emails[0].value,
	// 	photo:
	// })
	done();
}));

passport.serializeUser(function(user, done){
	done(null, user._id);
});

passport.deserializeUser(function(userId, done){
	User.findById(userId, done);
});


// const env = process.env.NODE_ENV || 'dev';

// mongoDb Connection
mongoose.connect(dbConfig);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.on('connected', function () {
	if(config.util.getEnv('NODE_ENV') === 'test') { // If the environment is test, then nuke the Test Database
		seeder.connect(dbConfig, function () {
			console.log('seeder connected to Database ' + dbConfig);
			console.log("Deleting Test Database...");
			db.dropDatabase(function(){
				console.log("dropping Database Finished ------ Now Seeding");
				// Load Mongoose models
				seeder.loadModels([
					path.join(__dirname, '/models/user'),
					path.join(__dirname, '/models/location'),
					path.join(__dirname, '/models/request')
				]);
				// Clear specified collections
				seeder.clearModels(['User', 'Request', 'Location'], function () {
					// Callback to populate DB once collections have been cleared
					seeder.populateModels(data, function () {
						console.log('Finished seeding Database!');
						
						app.emit('appStarted'); // Emits an event to tell our tests it is ok to now test.
					});
				});
			});
		});
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
	secret: 'The Session secret, which should not be public. Put into a secrets.js',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: db})
}));

app.use(passport.initialize());

//Restore Sesssion
app.use(passport.session());


if (config.util.getEnv('NODE_ENV') !== 'test') {
	app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/courses', course);
app.use('/api/users', user);

app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error('Not Found');
	
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	const status = err.status || 500;
	// render the error page
	
	res.status(status).json({success: false, status: status, message: err.message});
});

module.exports = app; // This for testing...
