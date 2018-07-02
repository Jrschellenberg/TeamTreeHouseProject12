//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';
import Utils from '../src/utilities/utils';
const User = require('../src/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;
const spies = require('chai-spies');

chai.use(chaiHttp);
chai.use(spies);

const postAPI = '/api/users';
const getAPI = postAPI;

const spy = chai.spy();

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
	
	// afterEach((done) => {
	// 	Utils.sleep(2000).then(() => {
	// 		done();
	// 	});
	// });
	//
	//let users = true;
	let users = [ { 
		_id: "57029ed4795118be119cc437",
		email: 'tooth.paste.hurt@gmail.com',
		firstName: 'Joe',
		lastName: 'Smith',
		request: "57029ed4795118be119cc43a",
		isAdmin: true,
		currentStops: "5b39440fcda6237afb56e1b9",
		__v: 0 },
		{
			_id: "57029ed4795118be119cc438",
			email: 'sam@jones.com',
			firstName: 'Sam',
			lastName: 'Jones',
			request: "57029ed4795118be119cc43c",
			currentStops: "5b3943f3cda6237afb56e1b8",
			__v: 0 },
		{ 
			_id: "57029ed4795118be119cc439",
			email: 'sam@smith.com',
			firstName: 'Sam',
			lastName: 'Smith',
			request: "57029ed4795118be119cc43b",
			__v: 0 }
		 ];
	
	it('should throw 401 error if user is not logged in', (done) => {
		let msg = 'You must be logged in to view Profile Assets, Please login now';
		getAuthRequest(401, false, msg, null, done);
	});
	it('should give 422 if user supplied malformed _id format', (done) => {
		let id = '?sessionID=thisISBadSessionID';
		getAuthRequest(422, false, "Unprocessable Entity", id, done);
	});
	
	it('should give 401 if supplied with invalid _id', (done) => {
		let id = '?sessionID=5b3a4c68cda6237afb56e1ba';
		getAuthRequest(401, false, "Unauthorized", id, done);
	});
	it('should give us 403 error if we are not admin, but supply a valid session ID', (done) => {
		let id = '?sessionID=57029ed4795118be119cc439';
		getAuthRequest(403, false, "Forbidden", id, done);
	});
	it('should return us all Users if we supply valid SessionID and are Admin user', (done) => {
		let id = '?sessionID=57029ed4795118be119cc437';
		getAuthRequest(200, true, "Users Successfully retrieved", id, done);
	});
	
	function getAuthRequest(status, success, msg, id, done) {
		if(!id){
			id = '';
		}
		chai.request(server)
			.get(getAPI+id)
			.end((err, res) => {
				res.should.have.status(status);
				res.body.should.have.property('success').equal(success);
				res.body.should.have.property('message').equal(msg);
				// if(users){
				// 	res.body.should.have.property('users').deep.equal(users);
				// }
				done();
			});
	}
});
