//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;

import {beforeTest} from "./utilities";

import {handleRequest, getRequest, isRequestAllowed } from "../src/middleware/request";


chai.use(chaiHttp);

describe('Request Limits', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	
	it('should Get the proper Request Document when supplied with correct ID', () => {
		let id = "57029ed4795118be119cc438";
		getRequest(id).then((request) => {
			console.log(request._id);
			console.log(request);
			expect(request._id).to.be.equal("57029ed4795118be119cc43c");
		});
	});

});
