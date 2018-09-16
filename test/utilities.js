const server = require('../src/app');
let dataBaseFinishSeed = false;

server.on('appStarted', () => {
	dataBaseFinishSeed = true;
});

export function beforeTest(done){
	if (dataBaseFinishSeed) {
		done();
	} //if it has finished seeding it will hit callback, else forever hangs
	server.on('appStarted', () => { //Once finish seed, set to true and stop hang.
		done();
	});
	
}