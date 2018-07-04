require('dotenv').config();  // Get all of our secrets...
//Require all of our dependencies...
const express = require('express'),
 logger = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser = require('body-parser'),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth20'),
	User = require('./models/user'),
	mongoose = require('mongoose'),
	seeder = require('mongoose-seed'),
	data = require('./data/seedData.json'),
	config = require('config'),
	expressSanitizer = require('express-sanitizer'),
	path = require('path'),
	RateLimit = require('express-rate-limit'),
	dbConfig = config.get('DBHost');

//Configure sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

/*
Add Rate Limiting
 */

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

const apiLimiter = new RateLimit({
	windowMs: 2*60*1000, // 2 minutes
	max: 15,
	delayMs: 0 // disabled
});




//Configure google Strategy.
passport.use(new GoogleStrategy({
	
	clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
	clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/google/return"
}, function(accessToken, refreshToken, profile, done){
	if(!profile.emails[0]) {
		let noEmailError = new Error("Your email privacy settings prevent you from authorizing with this application!");
		done(noEmailError, null);
	}
	
	let userProfile = {
		email: profile.emails[0].value,
		firstName: profile.name.givenName,
		lastName: profile.name.familyName
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
			// console.log('seeder connected to Database ' + dbConfig);
			// console.log("Deleting Test Database...");
			db.dropDatabase(function(){
				//console.log("dropping Database Finished ------ Now Seeding");
				// Load Mongoose models
				seeder.loadModels([
					path.join(__dirname, '/models/user'),
					path.join(__dirname, '/models/location'),
					path.join(__dirname, '/models/route')
				]);
				// Clear specified collections
				seeder.clearModels(['User', 'Location', 'Route'], function () {
					// Callback to populate DB once collections have been cleared
					seeder.populateModels(data, function () {
						//console.log('Finished seeding Database!');
						app.emit('appStarted'); // Emits an event to tell our tests it is ok to now test.
					});
				});
			});
		});
	}
});
/*
End Database Logic
 */

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
	app.use((req, res, next) => {
		res.locals.testSession = true; // Used for mocking session object during testing..
		next();
	});
}
/*
End session Logic.
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



if(process.env.NODE_ENV !== 'test') {
	app.use(logger('dev'));
	// only apply to requests that begin with /api/
	app.use('/api/', apiLimiter); // Only apply this if we are not testing.. IE Server is running
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSanitizer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	const status = err.status || 500;
	
	if(res.locals.isAPICall){
		return res.status(status).json({success: false, status: status, message: err.message});
	}
	else{
		if(err.link){
			return res.redirect(err.link+'?errorMessage='+res.locals.message+'&errorStatus='+err.status+'&error='+res.locals.error);
		}
		if(err.status === 404){ // Handle our 404 cases for now. Should render pages. eventually
			return res.status(status).json({success: false, status: status, message: err.message});
		}
		else{ //Fall back if can't redirect error to same page.
			
			return res.render('error', { title: "Error", errorMessage: res.locals.message, errorStatus: status, error: res.locals.error });
		}
	}
});

module.exports = app; // This for testing...
