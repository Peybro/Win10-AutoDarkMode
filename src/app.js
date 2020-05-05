const os = require('os');
const AutoDarkMode = require('./AutoDarkMode');

if (os.release().split('.')[0] === '10') {
	new AutoDarkMode().startListening();
} else {
	console.log("I'm sorry, this program is only for users of Windows 10.");
	process.exit(1);
}
