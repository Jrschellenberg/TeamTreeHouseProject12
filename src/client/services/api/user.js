import axios from 'axios';

export default {
	updatePhoneNumber(id, payload){
		return axios.put('/api/users/phone/'+id, payload);
	}
}