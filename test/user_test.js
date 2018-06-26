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
	
	describe('/GET users', () => {
		it('should get all users from the database', (done) => {
			chai.request(server)
				.get(getAPI)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('success').equal(false);
					res.body.should.have.property('message').equal("Access Denied: Please supply login credentials!");
					done();
				});
		});
	});
});