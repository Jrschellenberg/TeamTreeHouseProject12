import Utils from '../utilities/utils';
const User = require('../models/user');
const Request = require('../models/request');

/*
This middleware will be the sub controller, calling the functions below to break code into smaller chunks.
 */



export function handleRequest(req, res, next) {
	let request = new RequestClass(req.session.passport.user, next);
	// getRequest(req.session.passport.user).then((request) => {
	// 	console.log(request) // This test passes.
	// }).catch(next);
	
	//delete request; // We delete this after..?
}

export class RequestClass {
	constructor(id, next){
		this._id = id;
		this.lastReqTimeStamp = null;
		this.currentNumberRequestAttempts = null;
		this.requestLimitMaximum = null;
		this.requestCooldownTimeMS = null;
		this.requestLimitMaxTimestamp = null;
		this.allowRequestExecution = false;
		this.next = next;
	}
	
	processRequest(){
		this.initializeInstance().then(() => {
			this.lastReqTimeStamp = Date.now();  // Set our last req timestamp now to check against database..
			if(this.isRequestAuthorized(this.lastReqTimeStamp, this.requestLimitMaxTimestamp, this.requestCooldownTimeMS,
					this.currentNumberRequestAttempts, this.requestLimitMaximum)){
				this.currentNumberRequestAttempts++;
				//Handle request here...
				this.allowRequestExecution = true;
			}
			else {
				this.requestLimitMaxTimestamp = Date.now(); // Since they hit the max, 
				this.currentNumberRequestAttempts = 0; // Reset their max request attempts now, since they are throttled by time now.
			}
		}).catch(this.next);
	}
	
	isRequestExecutionAllowed(){
		return this.allowRequestExecution;
	}

	
	isRequestAuthorized(lastReqTime, reqLimitMaxTime, requestCoolDown, currentNumberReqAttempt, requestLimitMaximum){
		// Has it been less than a minute since last recorded requests happened and is current requests > 5?
		return (this.isRequestCooldownTimePassed(lastReqTime, reqLimitMaxTime, requestCoolDown)) ||
			currentNumberReqAttempt < requestLimitMaximum;
	}
	
	initializeInstance(){
		return new Promise((resolve, reject) => {
			this.getRequest().then((request) => {
				this.lastReqTimeStamp = request.lastReqTimeStamp;
				this.currentNumberRequestAttempts = request.currentNumberRequestAttempts;
				this.requestLimitMaximum = request.requestLimitMaximum;
				this.requestCooldownTimeMS = request.requestCooldownTimeMS;
				this.requestLimitMaxTimestamp = request.requestLimitMaxTimestamp;
				resolve();
			}).catch((err) => {
				reject(err);
			});
		});
		
	}
	
	getRequest(){
		return new Promise((resolve, reject) => {
			User.getRequest(this._id).then((request) => {
				resolve(request);
			}).catch((err) => {
				reject(err);
			});
		});
	}
	
	convertDateUnix(date){
		return date.getTime();
	}
	
	isRequestCooldownTimePassed(lastRequestTimeStamp, requestLimitHitTimeStamp, requestCooldown){
		return (this.convertDateUnix(lastRequestTimeStamp) - this.convertDateUnix(requestLimitHitTimeStamp))
			> requestCooldown;
	}
	
	// isRequestLimitMaximumHit(isMaxHit){
	// 	if(isMaxHit){ //If max still 
	// 		this.lastReqTimeStamp = Date.now();
	// 		this.requestLimitMaxTimestamp = Date.now();
	// 		return true;
	// 	}
	// 	return false;
	// }

}



// export function isRequestAllowed(request){
// 	return new Promise((resolve, reject) => {
// 		if(request.)
// 		resolve(true);
// 		if(request.isRequestLimitMaximumHit || ){
// 			reject(Utils.rejectError(429, "Too Many Requests"));
// 		}
// 	});
// }
