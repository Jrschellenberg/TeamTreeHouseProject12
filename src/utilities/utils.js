const bunyan = require('bunyan');
let errorLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'error',
			path: './error.log'
		}
	]
});
let warningLog = bunyan.createLogger({
	name: "myapp",
	streams: [
		{
			level: 'info',
			path: './warning.log'
		}
	]
});

export default class Utils {
	static toDate(dateStr){
		return Date.parse(dateStr);
	}
	static throwError(status, message, link, next){
		let err = new Error(message);
		err.status = status;
		err.link = link;
		return next(err);
	}
	static renderView(view, obj, req, res){
		if (req.query.errorMessage && req.query.errorStatus && req.query.error) {
			obj.errorMessage = req.query.errorMessage;
			obj.errorStatus = req.query.errorStatus;
			obj.error = req.query.error;
		}
		return res.render(view, obj);
	}
	static logError(err){
		errorLog.error({
			time: new Date().toString(),
			error: err
		});
	}
	static logWarning(err){
		warningLog.info({
			time: new Date().toString(),
			warning: err
		});
	}
	static returnJson(status, success, message, errorMessage, res){
		return res.status(status).json({success: success, status: status, message :message, errorMessage: errorMessage});
	}
	static sleep(ms = 0) {
		return new Promise(r => setTimeout(r, ms));
	}
}