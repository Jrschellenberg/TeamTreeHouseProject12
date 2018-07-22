import axios from 'axios';

export default {
	submitRoute(payload){
		return axios.post('/api/algorithmia/', payload);
	}
}