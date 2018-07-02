//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;

import {beforeTest} from "./utilities";

import {handleRequest, getRequest, convertDateUnix, isRequestCooldownTimePassed } from "../src/middleware/request";


chai.use(chaiHttp);

describe('Request Limit MIDDLEWARE', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	
	describe('FUNCTION - getRequest(id)', () => {
		it('should Get the proper Request Document when supplied with correct ID', () => {
			let id = "57029ed4795118be119cc438";
			getRequest(id).then((request) => {
				// console.log(request._id);
				// console.log(request);
				expect(request._id).to.be.equal("57029ed4795118be119cc43c");
			});
		});
	});
	
	describe('FUNCTION - convertDateUnix', () => {
		it('Return correct Unix time given a Date', () => {
			let dateOne = new Date('2018-07-02T19:56:09.870Z');
			let dateTwo = new Date('2018-07-02T19:46:09.870Z');
			expect(convertDateUnix(dateOne)).to.be.equal(1530561369870);
			expect(convertDateUnix(dateTwo)).to.be.equal(1530561369870 - 600000);
		});
	});
	
	describe('FUNCTION - isRequestCooldownTimePassed', () => {
		let dateOne = new Date('2018-07-02T19:56:09.870Z');
		let dateTwo = new Date('2018-07-02T19:46:09.870Z');
		it('Should return true if more than one minute has passed since the request Limit timestamp was hit', () => {
			expect(isRequestCooldownTimePassed(dateOne, dateTwo, 60000)).to.be.true;
		});
		it('should return false if less than a minute has passed since the request Limit timestamp was hit', () => {
			let dateOne = new Date('2018-07-02T19:46:49.870Z');
			let dateTwo = new Date('2018-07-02T19:46:09.870Z');
			expect(isRequestCooldownTimePassed(dateOne, dateTwo, 60000)).to.be.false;
		});
	});
	
	
	
	// it('Returns true if ')

});
