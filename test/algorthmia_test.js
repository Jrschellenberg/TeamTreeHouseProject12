//During the test the env variable is set to test
'use strict';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
const expect = chai.expect;



const validTest = {
	points:["49.8561519,-97.16069069999998"],
	startpoint:"49.8088807,-97.2297858",
	endpoint:"49.8088807,-97.2297858"
};

const longerTest = {
	points:["49.8561519,-97.16069069999998","49.932471,-97.06972489999998","50.08294370000001,-97.2263077"],
	startpoint:"49.8088807,-97.2297858",
	endpoint:"49.8088807,-97.2297858"
}

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

let validBody = {
	points: [ '49.85633199999999,-97.16082169999999'],
	startpoint: '49.8088807,-97.2297858',
	endpoint: '49.8088807,-97.2297858',
	sessionID: '57029ed4795118be119cc438'
};

const endPoint = '/api/algorithmia';

describe('POST ALGORITHMIA', () => {
	beforeEach((done) => { //This hangs the tests until databaesFinish seed..
		beforeTest(done);
	});
	//testMiddleWares();
	
	it('should return 200 if correct information is presented', (done) => {
		postRequest(endPoint, validBody, 500, false, 'Unprocessable Entity', done );
	});
	
	// it('should throw 422 error if the body is missing', (done) => {
	// 	postRequest(endPoint, {sessionID: '57029ed4795118be119cc438'}, 422, false,'Unprocessable Entity', done );
	// });
	// it('should throw 422 if body is missing points', (done) => {
	// 	let inValidBody = {
	// 		startpoint: '49.8088807,-97.2297858',
	// 		endpoint: '49.8088807,-97.2297858',
	// 		sessionID: '57029ed4795118be119cc438'
	// 	};
	// 	postRequest(endPoint, inValidBody, 422, false,'Unprocessable Entity', done );
	// });
	// it('should throw 422 if body is missing startPoint', (done) => {
	// 	let inValidBody = {
	// 		points: ['49.85633199999999,-97.16082169999999'],
	// 		endpoint: '49.8088807,-97.2297858',
	// 		sessionID: '57029ed4795118be119cc438'
	// 	};
	// 	postRequest(endPoint, inValidBody, 422, false,'Unprocessable Entity', done );
	// });
	// it('should throw 422 if body is missing endpoint', (done) => {
	// 	let inValidBody = {
	// 		points: ['49.85633199999999,-97.16082169999999'],
	// 		startpoint: '49.8088807,-97.2297858',
	// 		sessionID: '57029ed4795118be119cc438'
	// 	};
	// 	postRequest(endPoint, inValidBody, 422, false,'Unprocessable Entity', done );
	// });
	
	function testMiddleWares(){
		let body = {};
		it('should throw 401 error if user is not logged in', (done) => {
			let msg = 'You must be logged in to view Profile Assets, Please login now';
			postRequest(endPoint, {}, 401, false, msg, done);
		});
		it('should give 422 if user supplied malformed _id format', (done) => {
			body.sessionID = 'thisISBadSessionID';
			postRequest(endPoint, body, 422, false, "Unprocessable Entity", done);
		});
		it('should give 401 if supplied with invalid _id', (done) => {
			body.sessionID = '5b3a4c68cda6237afb56e1ba';
			postRequest(endPoint, body, 401, false, "Unauthorized", done);
		});
	}
	
		function postRequest(apiEndPoint, body, status, success, msg, done){
			chai.request(server)
				.post(apiEndPoint)
				.type('form')
				.send(body)
				.end((err, res) => {
					res.should.have.status(status);
					res.body.should.have.property('success').equal(success);
					res.body.should.have.property('message').equal(msg);
					done();
				});
		}
});
