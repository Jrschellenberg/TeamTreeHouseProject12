const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new mongoose.Schema({
	lastReqTimeStamp: {
		type: Date,
		default: Date.now()
	},
	currentNumberRequestAttempts: {
		type: Number,
		default: 0
	},
	requestLimitMaximum: {
		type: Number,
		default: 5
	},
	requestCooldownTimeMS: {
		type: Number,
		default: 60 * 1000 // 1 Minute
	},
	isRequestLimitMaximumHit: {
		type: Boolean,
		default: false
	},
	requestLimitMaxTimestamp: {
		type: Date,
		default: Date.now()
	},
});

const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;