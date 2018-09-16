import axios from 'axios';

export default {
	updatePhoneNumber(payload){
		return axios.put('/api/users/update/phone', payload);
	}
}