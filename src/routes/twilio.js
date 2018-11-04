import "@babel/polyfill"; //polyfill async await

const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID_SECRET; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const twilioNumber = process.env.TWILLIO_ACCOUNT_PHONE_NUMBER;
const twilioClient = new twilio(accountSid, authToken);
import { isUserAuthenticated, setResponseAPI} from "../middleware/index";
import Utils from '../utilities/utils';


router.post('/', setResponseAPI, isUserAuthenticated, async(req, res, next) => {
	if(!res.locals.user.phoneNumber || !req.body.data){
		return Utils.throwError(422, 'Unprocessable Entity', '/profile', next);
	}
	const sendTextTo = '+1' + res.locals.user.phoneNumber.toString();
	let body = 'Thank you for Using Justins Route Calculator!\n';
	
	let bodyMessage = [];
	let messageIDs = [];
	
	req.body.data.forEach((val, index) => {
		if(index % 6 === 5 ){ // every 5th value, break the body message out, so we will send multiple texts. Char limit is 1600 from Twilio..
			bodyMessage.push(body);
			body = '';
		}
    body += `${index +1}). ${val.message}\n For directions, please click ${val.url}\n\n`;
	});
	if(body !== ''){ // If we left loop and there is still body text to be added on, lets do it now!
    bodyMessage.push(body);
	}
	
	for(let i=0; i<bodyMessage.length; i++){
		try{
      const msgID = await sendMessage(bodyMessage[i], sendTextTo); // will pause and wait until the previous one successfully sends.
      messageIDs.push(msgID);
		}
		catch(err){
      return Utils.throwError(503, err, '/profile', next);
		}
	}
	
	// We successfully sent all of our messages!
  res.status(200).json({ success: true, message: "Successfully Sent Text!", status: 200, data: messageIDs });
	
});

const sendMessage = (msg, sendTextTo) => {
	return new Promise( (resolve, reject) => {
    twilioClient.messages.create({
      body: msg,
      to: sendTextTo,  // Text this number
      from: twilioNumber // From a valid Twilio number
    })
      .then((message) => {
        if(message.errorCode){
          reject(message);
        }
        resolve(message.sid);
      }).catch((err) => {
        reject(err);
    });
	});
}

module.exports = router;
