import HelloWorldController from '../controllers/helloWorld';

export default function(ctx, next) {
	new HelloWorldController();
	next();
}