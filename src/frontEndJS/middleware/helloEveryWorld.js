import HelloEveryWorldController from '../controllers/helloWorld';

export default function(ctx, next) {
	new HelloEveryWorldController();
	next();
}