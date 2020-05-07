const cron = require('node-cron');
const regedit = require('regedit');
const notifier = require('node-notifier');

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
		console.log(this.getPrintMessage());

		this.setMode();
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

		if (conf.notification) this.notify();
	}

	getPrintMessage() {
		return `It's ${new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})} - setting ${
			new Date().toLocaleTimeString() < this.getTimeConfig('from') ||
			new Date().toLocaleTimeString() >= this.getTimeConfig('to') ? 'Night' :
			'Day'} Mode.\nWaiting for next time change at ${
			new Date().toLocaleTimeString() >= this.getTimeConfig('to') ||
			new Date().toLocaleTimeString() < this.getTimeConfig('from') ? this.getTimeConfig('from') + ' (tomorrow)' :
			this.getTimeConfig('to')}...`;
	}

	notify() {
		// new nn.NotificationCenter(options).notify();
		// new nn.NotifySend(options).notify();
		// new nn.WindowsToaster(options).notify(options);
		// new nn.WindowsBalloon(options).notify(options);
		// new nn.Growl(options).notify(options);

		notifier.notify(
			{
				title: 'Auto-Dark-Mode',
				subtitle: undefined,
				message: this.getPrintMessage(),
				sound: false, // Case Sensitive string for location of sound file, or use one of macOS' native sounds (see below)
				icon: 'Terminal Icon', // Absolute Path to Triggering Icon
				contentImage: undefined, // Absolute Path to Attached Image (Content Image)
				open: undefined, // URL to open on Click
				wait: false, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

				// New in latest version. See `example/macInput.js` for usage
				timeout: 5, // Takes precedence over wait if both are defined.
				closeLabel: undefined, // String. Label for cancel button
				actions: undefined, // String | Array<String>. Action label or list of labels in case of dropdown
				dropdownLabel: undefined, // String. Label to be used if multiple actions
				reply: false // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
			},
			function(err, response){
				// Response is response from notification
			}
		);

		notifier.on('click', function(notifierObject, options, event){
			// Triggers if `wait: true` and user clicks notification
			console.log('test');
		});
	}
};
