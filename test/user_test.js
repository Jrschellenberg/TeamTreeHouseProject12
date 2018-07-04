//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;

import {beforeTest} from "./utilities";

chai.use(chaiHttp);

describe('GET Users', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	
	let getAPI = '/api/users';
	testMiddleWares(getAPI);

	it('should return us all Users if we supply valid SessionID and are Admin user', (done) => {
		let id = '?sessionID=57029ed4795118be119cc437';
		getAuthRequest(200, true, "Users Successfully retrieved", getAPI, id, done);
	});
});

describe('GET USER', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	const testID = '57029ed4795118be119cc438';
	let getAPI = '/api/users/'+testID;

	testMiddleWares(getAPI);
	it('should return us the user whose id we specified if we are authenticated and authorized', (done) => {
		let id = '?sessionID=57029ed4795118be119cc437';
		let user = {
			_id: "57029ed4795118be119cc438",
			email: "sam@jones.com",
			firstName: "Sam",
			lastName: "Jones",
			currentStops: "5b3943f3cda6237afb56e1b8",
			__v: 0
		};
		getAuthRequest(200, true, "User Successfully retrieved", getAPI, id, done, user);
	});
});

describe('GET USER ROUTE', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	const testID = '57029ed4795118be119cc438';
	let getAPI = '/api/users/route/'+testID;

	testMiddleWares(getAPI);
	it('should return us the Current route of user whose id we specified if we are authenticated and authorized', (done) => {
		let id = '?sessionID=57029ed4795118be119cc438';
		let route = {
			__v: 0,
			_id: "5b3943f3cda6237afb56e1b8",
			endingAddress: {
				__v: 0,
				_id: "54759eb3c090d83494e2d805",
				isGeoEncoded: false,
				lat: null,
				long: null,
				postalCode: "R4G0B3",
				streetAddress: "2595-B McGillivray Blvd"
			},
			startingAddress: {
				__v: 0,
				_id: "54759eb3c090d83494e2d805",
				isGeoEncoded: false,
				lat: null,
				long: null,
				postalCode: "R4G0B3",
				streetAddress: "2595-B McGillivray Blvd"
			},
			stops: [
				{
					__v: 0,
					_id: "57029ed4795118be119cc43d",
					isGeoEncoded: false,
					lat: null,
					long: null,
					postalCode: "R3M2H9",
					streetAddress: "556 Wilton Bay"
				},
				{
					__v: 0,
					_id: "57029ed4795118be119cc440",
					isGeoEncoded: false,
					lat: null,
					long: null,
					postalCode: "R3Y0L6",
					streetAddress: "50 Fultz Blvd"
				}
			]
		};
		
		getAuthRequest(200, true, "User Route Successfully retrieved", getAPI, id, done, route);
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
	it('should give us 403 error if we are not admin, but supply a valid session ID', (done) => {
		let id = '?sessionID=57029ed4795118be119cc439';
		getAuthRequest(403, false, "Forbidden", endPoint, id, done);
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
