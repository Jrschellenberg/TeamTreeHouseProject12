import Bootstrap from './dependencies/bootstrap';
//import Navigation from './navigation';

export default class Middleware {
    constructor(page) {
	      page('*', Bootstrap);
	      //page('*', Navigation);
    }
}