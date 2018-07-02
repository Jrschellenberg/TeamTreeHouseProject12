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
	it('should give 422 if user supplied wrong _id format', (done) => {
		let id = '?sessionID=thisISBadSessionID';
		getAuthRequest(422, false, "Unprocessable Entity", id, done);
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
