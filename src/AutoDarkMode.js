const cron = require('node-cron');
const regedit = require('regedit');

const conf = require('./../config.json');

module.exports = class AutoDarkMode {
	startListening() {
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
		).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	printTime() {
		console.log(
			"It's",
			new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			`- setting ${
				new Date().toLocaleTimeString() < this.getTimeConfig('from') ||
				new Date().toLocaleTimeString() >= this.getTimeConfig('to') ? 'Night' :
				'Day'} Mode.`
		);

		this.setMode();

		console.log(
			`Waiting for next time change at ${
				new Date().toLocaleTimeString() >= this.getTimeConfig('to') ||
				new Date().toLocaleTimeString() < this.getTimeConfig('from') ? this.getTimeConfig('from') +
				' (tomorrow)' :
				this.getTimeConfig('to')}...`
		);
	}

	setMode() {
		let valuesToAdd = {};
		if (
			new Date().toLocaleTimeString() < this.getTimeConfig('from') ||
			new Date().toLocaleTimeString() >= this.getTimeConfig('to')
		) {
			if (conf.setting.apps) valuesToAdd['AppsUseLightTheme'] = { value: 0, type: 'REG_DWORD' };
			if (conf.setting.system) valuesToAdd['SystemUsesLightTheme'] = { value: 0, type: 'REG_DWORD' };
		} else {
			if (conf.setting.apps) valuesToAdd['AppsUseLightTheme'] = { value: 1, type: 'REG_DWORD' };
			if (conf.setting.system) valuesToAdd['SystemUsesLightTheme'] = { value: 1, type: 'REG_DWORD' };
		}

		let val = {};
		val['HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize'] = valuesToAdd;

		regedit.putValue(val, (err) => {
			if (err) console.error(err);
		});
	}
};
