const os = require('os');

const cron = require('node-cron');
const PowerShell = require('powershell');

const scripts = require('./scripts.json');
const conf = require('./../config.json');

const getTimeConfig = (interval) => {
	const now = new Date();
	return new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),

			interval === 'from' ? conf.day.from.hours :
			conf.day.to.hours,

			interval === 'from' ? conf.day.from.minutes :
			conf.day.to.minutes
	).toLocaleTimeString();
};

const printTime = () => {
	console.log(
		"It's",
		new Date().toLocaleTimeString(),
		`- setting ${
			new Date().toLocaleTimeString() < getTimeConfig('from') ||
			new Date().toLocaleTimeString() >= getTimeConfig('to') ? 'Night' :
			'Day'} Mode.`
	);

	let appsMode, systemMode;
	if (
		new Date().toLocaleTimeString() < getTimeConfig('from') ||
		new Date().toLocaleTimeString() >= getTimeConfig('to')
	) {
		if (conf.setting.apps) appsMode = new PowerShell(scripts.apps.dark);
		if (conf.setting.system) systemMode = new PowerShell(scripts.system.dark);
	} else {
		if (conf.setting.apps) appsMode = new PowerShell(scripts.apps.light);
		if (conf.setting.system) systemMode = new PowerShell(scripts.system.light);
	}

	[ appsMode, systemMode ].forEach((field) => {
		if (field) {
			// Handle process errors (e.g. powershell not found)
			field.on('error', (err) => {
				console.error(err);
			});
			// // Stdout
			// field.on('output', (data) => {
			// 	console.log(data);
			// });
			// Stderr
			field.on('error-output', (data) => {
				console.error(data);
			});
			// // End
			// field.on('end', (code) => {
			// 	// Do Something on end
			// 	console.log("Script successfully applied.")
			// });
		}
	});

	console.log('Waiting for time change...');
};

if (os.release().split('.')[0] === '10') {
	console.clear();
	printTime();

	cron.schedule(
		`0 ${conf.day.from.minutes},${conf.day.to.minutes} ${conf.day.from.hours},${conf.day.to.hours} * * *`,
		() => {
			printTime();
		},
		{
			scheduled: true
		}
	);
} else {
	console.log("I'm sorry, this program is only for users of Windows 10.");
	process.exit(1);
}
