require('dotenv').config();  // Get all of our secrets...

//Require all of our dependencies...
const express = require('express'),
 logger = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser = require('body-parser'),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth20'),
	User = require('./models/user'),
	Request = require('./models/request'),
	mongoose = require('mongoose'),
	seeder = require('mongoose-seed'),
	data = require('./data/seedData.json'),
	config = require('config'),
	path = require('path'),
	dbConfig = config.get('DBHost');

//Configure sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

//Configure google Strategy.
passport.use(new GoogleStrategy({
	
	clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
	clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/google/return"
}, function(accessToken, refreshToken, profile, done){
	console.log("hitting this");
	let request = new Request({
		_id: new mongoose.Types.ObjectId(),
	});
	if(!profile.emails[0]) {
		console.log("we hitting this here?!?!");
		let noEmailError = new Error("Your email privacy settings prevent you from authorizing with this application!");
		done(noEmailError, null);
	}
	
	let userProfile = {
		email: profile.emails[0].value,
		firstName: profile.name.givenName,
		lastName: profile.name.familyName,
		request: request._id
	};
	User.findOne((err, result) => {
		if (err){
			done(err, null);
		}
		if(!result){ //There is no users currently in the database. Set our First user as admin
			userProfile.isAdmin = true;
		}
		User.findOneAndUpdate({
			email: profile.emails[0].value
		}, userProfile, {
			upsert: true,
			new: true
		}, (err, user) => {
			if(err){
				done(err, null);
			}
			return done(null, user);
		});
	});
}));

passport.serializeUser(function(user, done){
	done(null, user._id);
});

passport.deserializeUser(function(userId, done){
	User.findById(userId, done);
});


/*
Initialize Database, Or seed it if we are testing!!
 */
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
					path.join(__dirname, '/models/request'),
					path.join(__dirname, '/models/currentRoute')
				]);
				// Clear specified collections
				seeder.clearModels(['User', 'Request', 'Location', 'CurrentRoute'], function () {
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

/*
Setup our Sessions and bind them with our passport!
 */
app.use(session({
	secret: 'The Session secret, which should not be public. Put into a secrets.js',
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: db})
}));

app.use(passport.initialize());

//Restore Sesssion
app.use(passport.session());

if (config.util.getEnv('NODE_ENV') === 'test') {
	process.env.NODE_ENV = 'test';
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



if(process.env.NODE_ENV !== 'test') {
	app.use((req, res, next) =>{
		res.locals.currentUser = req.session.passport.user;
		next();
	});
	app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error('Not Found');
	
	err.status = 404;
	next(err);
});

// error handler
// app.use(function (err, req, res, next) {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message;
// 	res.locals.error = req.app.get('env') === 'development' ? err : {};
//
// 	const status = err.status || 500;
// 	// render the error page
//
// 	res.status(status).json({success: false, status: status, message: err.message});
// });

app.use(function(err, req, res, next) {
	//TODO: Add a dual logic check in here if res.locals.isAPICall is true handle errors for API aka in JSON
	//TODO: IF not, then handle rendering ones.
	
	console.log("hitting the errors here...");
	
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.status(err.status || 500);
	
	if(res.locals.isAPICall){
		const status = err.status || 500;
		console.log("hitting inside this if statement?");
		res.status(status).json({success: false, status: status, message: err.message});
	}
	if(err.link){
		res.redirect(err.link+'?errorMessage='+res.locals.message+'&errorStatus='+err.status+'&error='+res.locals.error);
	}
	if(err.status === 404){ // Handle our 404 cases for now. Should render pages. eventually
		res.status(err.status).json({success: false, status: err.status, message: err.message});
	}
	else{ //Fall back if can't redirect error to same page.
		
		res.render('error', { title: "Error", errorMessage: res.locals.message, errorStatus: err.status, error: res.locals.error });
	}
});

module.exports = app; // This for testing...
