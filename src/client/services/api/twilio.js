import axios from 'axios';

export default {
	sendText(payload){
		return axios.post('/api/twilio/', payload);
	}
}