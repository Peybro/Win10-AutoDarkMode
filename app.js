const os = require('os');

const cron = require('node-cron');
const PowerShell = require('powershell');

const { scripts } = require('./scripts');

const conf = {
	day     : {
		from : 7,
		to   : 20
	},
	setting : {
		system : true,
		apps   : true
	}
};

const printTime = () => {
	console.log(
		"It's",
		new Date().toLocaleTimeString(),
		`- setting ${new Date().getHours() < conf.day.from || new Date().getHours() >= conf.day.to
			? 'Night'
			: 'Day'} Mode.`
	);

	let appsMode, systemMode;
	if (new Date().getHours() >= conf.day.to) {
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
};

if (os.platform() === 'win32') {
	console.clear();
	printTime();
	console.log('Waiting for time change...');

	cron.schedule(
		`0 0 ${conf.day.from},${conf.day.to} * * *`,
		() => {
			printTime();
		},
		{
			scheduled : true
		}
	);
} else {
	console.log("I'm sorry, this program is only for users of Windows.");
	process.exit(1);
}
