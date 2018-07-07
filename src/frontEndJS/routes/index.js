import Middleware from '../middleware';
import route from 'page';
import HelloWorld from './helloWorld';


export default class Router extends Middleware {
    constructor() {
        super(route);
        this._bindRoutes();
        route.start({ click: false });
    }

    _bindRoutes() {
	    route('/', HelloWorld);
    }

    refresh() {
        route(window.location.pathname);
    }
}
