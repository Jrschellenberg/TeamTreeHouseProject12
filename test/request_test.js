//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;

import {beforeTest} from "./utilities";

import {handleRequest, RequestClass} from "../src/middleware/request";


chai.use(chaiHttp);

let id = "57029ed4795118be119cc438";
let request = new RequestClass(id);

describe('Request Limit MIDDLEWARE', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	
	describe('FUNCTION - getRequest(id)', () => {
		it('should Get the proper Request Document when supplied with correct ID', () => {
			request.getRequest().then((request) => {
				 console.log(request._id);
				// console.log(request);
				expect(request._id).to.be.equal("57029ed4795118be119cc43c");
			}).catch((err) => {
				//console.log(err);
			});
		});
	});
	
	describe('FUNCTION - convertDateUnix', () => {
		it('Return correct Unix time given a Date', () => {
			let dateOne = new Date('2018-07-02T19:56:09.870Z');
			let dateTwo = new Date('2018-07-02T19:46:09.870Z');
			expect(request.convertDateUnix(dateOne)).to.be.equal(1530561369870);
			expect(request.convertDateUnix(dateTwo)).to.be.equal(1530561369870 - 600000);
		});
	});
	
	describe('FUNCTION - isRequestCooldownTimePassed', () => {
		let dateOne = new Date('2018-07-02T19:56:09.870Z');
		let dateTwo = new Date('2018-07-02T19:46:09.870Z');
		it('Should return true if more than one minute has passed since the request Limit timestamp was hit', () => {
			expect(request.isRequestCooldownTimePassed(dateOne, dateTwo, 60000)).to.be.true;
		});
		it('should return false if less than a minute has passed since the request Limit timestamp was hit', () => {
			let dateOne = new Date('2018-07-02T19:46:49.870Z');
			let dateTwo = new Date('2018-07-02T19:46:09.870Z');
			expect(request.isRequestCooldownTimePassed(dateOne, dateTwo, 60000)).to.be.false;
		});
	});
	
	
	describe('FUNCTION - initializeInstance', () => {
		let id = "57029ed4795118be119cc438";
		let reqClass = new RequestClass(id);
		it('should have all values equal to null before initialize is called.', () => {
			expect(reqClass.lastReqTimeStamp).to.be.null;
			expect(reqClass.currentNumberRequestAttempts).to.be.null;
			expect(reqClass.requestLimitMaximum).to.be.null;
			expect(reqClass.requestCooldownTimeMS).to.be.null;
			expect(reqClass.requestLimitMaxTimestamp).to.be.null;
		});
		
		it('should initialize our class with request data.. After InitializeInstance() is called..', () => {
			let id = "57029ed4795118be119cc438";
			let reqClass = new RequestClass(id);
			reqClass.initializeInstance().then(() => {
				expect(reqClass.lastReqTimeStamp).to.be.equal("2018-07-02T21:03:26.813Z");
				expect(reqClass.currentNumberRequestAttempts).to.be.equal(0);
				expect(reqClass.requestLimitMaximum).to.be.equal(5);
				expect(reqClass.requestCooldownTimeMS).to.be.equal(60000);
				expect(reqClass.requestLimitMaxTimestamp).to.be.equal("2018-07-02T21:03:26.813Z");
			}).catch((err) => {
				//console.log(err);
			});
		});
	});
	
	describe('FUNCTION - isRequestAuthorized', () => {
		it('should authorize request if givenn time between requests is short, however current requests is less than maximum', () => {
			let dateOne = new Date('2018-07-02T19:46:49.870Z');
			let dateTwo = new Date('2018-07-02T19:46:09.870Z');
			expect(request.isRequestCooldownTimePassed(dateOne, dateTwo, 60000)).to.be.false;
			expect(request.isRequestAuthorized(dateOne, dateTwo, 60000, 0, 5)).to.be.true;
		});
		
		it('should NOT authorize request if givenn time between requests is short, and current requests is greater than maximum', () => {
			let dateOne = new Date('2018-07-02T19:46:49.870Z');
			let dateTwo = new Date('2018-07-02T19:46:09.870Z');
			expect(request.isRequestCooldownTimePassed(dateOne, dateTwo, 60000)).to.be.false;
			expect(request.isRequestAuthorized(dateOne, dateTwo, 60000, 5, 5)).to.be.false;
		});
		
		it('should authorize request if givenn time between requests Has passed, while current requests is greater than maximum', () => {
			let dateOne = new Date('2018-07-02T19:47:49.870Z');
			let dateTwo = new Date('2018-07-02T19:46:09.870Z');
			expect(request.isRequestCooldownTimePassed(dateOne, dateTwo, 60000)).to.be.true;
			expect(request.isRequestAuthorized(dateOne, dateTwo, 60000, 5, 5)).to.be.true;
		});
	});
	
	
	
	
});
