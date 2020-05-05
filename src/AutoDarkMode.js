const os = require('os');

const cron = require('node-cron');
const PowerShell = require('powershell');

const scripts = require('./scripts.json');
const conf = require('./../config.json');

module.exports = class AutoDarkMode {
	Main() {
		if (os.release().split('.')[0] === '10') {
			console.clear();
			this.printTime();

			cron.schedule(
				`0 ${conf.day.from.minutes},${conf.day.to.minutes} ${conf.day.from.hours},${conf.day.to.hours} * * *`,
				() => {
					this.printTime();
				},
				{
					scheduled: true
				}
			);
		} else {
			console.log("I'm sorry, this program is only for users of Windows 10.");
			process.exit(1);
		}
	}

	getTimeConfig(interval) {
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
	}

	printTime() {
		console.log(
			"It's",
			new Date().toLocaleTimeString(),
			`- setting ${
				new Date().toLocaleTimeString() < this.getTimeConfig('from') ||
				new Date().toLocaleTimeString() >= this.getTimeConfig('to') ? 'Night' :
				'Day'} Mode.`
		);

		let appsMode, systemMode;
		if (
			new Date().toLocaleTimeString() < this.getTimeConfig('from') ||
			new Date().toLocaleTimeString() >= this.getTimeConfig('to')
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

		console.log(
			`Waiting for next time change at ${
				new Date().toLocaleTimeString() >= this.getTimeConfig('to') ||
				new Date().toLocaleTimeString() < this.getTimeConfig('from') ? this.getTimeConfig('from') +
				' (tomorrow)' :
				this.getTimeConfig('to')}...`
		);
	}
}