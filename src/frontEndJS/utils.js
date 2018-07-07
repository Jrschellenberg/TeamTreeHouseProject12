export default class Utils {
	static sleep(ms = 0) {
		return new Promise(r => setTimeout(r, ms));
	}
}