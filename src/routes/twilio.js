const express = require('express');
const router = express.Router();
var twilio = require('twilio');
var accountSid = process.env.TWILIO_ACCOUNT_SID_SECRET; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
var twilioNumber = process.env.TWILLIO_ACCOUNT_PHONE_NUMBER;
var twilioClient = new twilio(accountSid, authToken);
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";
import Utils from '../utilities/utils';


router.post('/', setResponseAPI, isUserAuthenticated, (req, res, next) => {
	if(!res.locals.user.phoneNumber || !req.body.data){
		return Utils.throwError(422, 'Unprocessable Entity', '/profile', next);
	}
	const sendTextTo = '+1' + res.locals.user.phoneNumber.toString();
	let body = 'Thank you for Using Justins Route Calculator!\n';
	
	req.body.data.forEach((val, index) => {
		body += `${index +1}). ${val.message}\n For directions, please click ${val.url}\n\n`;
	});
	twilioClient.messages.create({
		body: body,
		to: sendTextTo,  // Text this number
		from: twilioNumber // From a valid Twilio number
	})
		.then((message) => {
		if(message.errorCode){
			return Utils.throwError(message.errorCode, message.errorMessage, '/profile', next);
		}
			res.status(200).json({ success: true, message: "Successfully Sent Text!", status: 200, data: message.sid });
		});
});

module.exports = router;
