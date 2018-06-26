const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new mongoose.Schema({
	lastReqTimeStamp: {
		type: Date,
	},
	currentNumberRequestAttempts: {
		type: Number,
		default: 0
	},
	requestLimitMaximum: {
		type: Number,
		default: 5
	},
	isRequestLimitMaximumHit: {
		type: Boolean,
		default: false
	},
	requestLimitMaxTimestamp: {
		type: Date,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;