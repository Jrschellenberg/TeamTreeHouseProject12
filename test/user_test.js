//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const User = require('../src/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

const postAPI = '/api/users';
const getAPI = postAPI;

import {dataBaseFinishSeed} from "../src/finishSeed";


describe('Users', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		if (dataBaseFinishSeed) {
			done();
		} //if it has finished seeding it will hit callback, else forever hangs
		server.on('appStarted', () => { //Once finish seed, set to true and stop hang.
			done();
		});
	});
	
	let users = [ { currentStops: [],
		_id: "57029ed4795118be119cc437",
		email: 'tooth.paste.hurt@gmail.com',
		firstName: 'Joe',
		lastName: 'Smith',
		request: "57029ed4795118be119cc43a",
		__v: 0 },
		{ currentStops: [],
			_id: "57029ed4795118be119cc439",
			email: 'sam@smith.com',
			firstName: 'Sam',
			lastName: 'Jones',
			request: "57029ed4795118be119cc43b",
			__v: 0 },
		{ currentStops: [],
			_id: "57029ed4795118be119cc438",
			email: 'sam@jones.com',
			firstName: 'Sam',
			lastName: 'Jones',
			request: "57029ed4795118be119cc43c",
			__v: 0 }
		 ];
	
	it('should throw 401 error if user is not logged in', (done) => {
		let msg = 'You must be logged in to view Profile Assets, Please login now';
		requestUsers(401, false, msg, null, done);
	});
	it('should give 401 if user supplied wrong _id', (done) => {
		let auth = {
			user: "THIS IS AN INVALID USER!"
		};
		getAuthRequest(auth, 200, true, "User Successfully retrieved", done);
	});
	
	
	function getAuthRequest(auth, status, success, msg, done) {
		chai.request(server)
			.get(getAPI)
			.auth(auth.user)
			.end((err, res) => {
				res.should.have.status(status);
				res.body.should.have.property('success').equal(success);
				res.body.should.have.property('message').equal(msg);
				// if(user){
				// 	res.body.should.have.property('user').property('fullName').equal(user.fullName);
				// 	res.body.should.have.property('user').property('emailAddress').equal(user.emailAddress);
				// 	res.body.should.have.property('user').property('_id').equal(user._id);
				// }
				done();
			});
	}
	
	
	function requestUsers(status, success, message, users, done){
		chai.request(server)
			.get(getAPI)
			.end((err, res) => {
				res.should.have.status(status);
				res.body.should.have.property('success').equal(success);
				res.body.should.have.property('message').equal(message);
				if(users) {
					res.body.should.have.property('users').deep.equal(users);
				}
				done();
			});
	}
	
});
