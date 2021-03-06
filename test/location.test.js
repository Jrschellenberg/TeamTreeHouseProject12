//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;

let dataBaseFinishSeed = false;

server.on('appStarted', () => {
	dataBaseFinishSeed = true;
});

const beforeTest = done => {
	if (dataBaseFinishSeed) {
		done();
	} //if it has finished seeding it will hit callback, else forever hangs
	server.on('appStarted', () => { //Once finish seed, set to true and stop hang.
		done();
	});
};

chai.use(chaiHttp);

describe('GET LOCATIONS', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	
	let getAPI = '/api/locations';
	testMiddleWares(getAPI);
	
	it('should return us all locations if we supply valid SessionID and are Admin user', (done) => {
		let id = '?sessionID=57029ed4795118be119cc437';
		getAuthRequest(200, true, "Locations Successfully retrieved", getAPI, id, done);
	});
});

describe('GET LOCATION', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	const testID = '57029ed4795118be119cc43d';
	let getAPI = '/api/locations/'+testID;
	
	testMiddleWares(getAPI);
	it('should return us the location whose id we specified if we are authenticated and authorized', (done) => {
		let id = '?sessionID=57029ed4795118be119cc437';
		let location = {
			_id: "57029ed4795118be119cc43d",
			lat: null,
			long: null,
			isGeoEncoded: false,
			streetAddress: "556 Wilton Bay",
			postalCode: "R3M2H9",
			__v: 0
		};
		getAuthRequest(200, true, "Location Successfully retrieved", getAPI, id, done, location);
	});
});


function testMiddleWares(endPoint){
	it('should throw 401 error if user is not logged in', (done) => {
		let msg = 'You must be logged in to view Profile Assets, Please login now';
		getAuthRequest(401, false, msg, endPoint, null, done);
	});
	it('should give 422 if user supplied malformed _id format', (done) => {
		let id = '?sessionID=thisISBadSessionID';
		getAuthRequest(422, false, "Unprocessable Entity", endPoint, id, done);
	});
	
	it('should give 401 if supplied with invalid _id', (done) => {
		let id = '?sessionID=5b3a4c68cda6237afb56e1ba';
		getAuthRequest(401, false, "Unauthorized", endPoint, id, done);
	});
}

function getAuthRequest(status, success, msg, endPoint, id, done, user) {
	if(!id){
		id = '';
	}
	chai.request(server)
		.get(endPoint+id)
		.end((err, res) => {
			res.should.have.status(status);
			res.body.should.have.property('success').equal(success);
			res.body.should.have.property('message').equal(msg);
			if(user){
				res.body.should.have.property('data').deep.equal(user);
			}
			done();
		});
}
