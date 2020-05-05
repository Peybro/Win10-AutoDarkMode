This program makes your Windows change the theme automaticallyy based on the time of the day.

1)
`npm start`
--> bat file for it in autostart

2) = 1) in background
start_bg.vbs (in autostart)

3) --> quick: install-service.bat
https://pm2.keymetrics.io/docs/usage/quick-start/
--> start_pm.bat in autostart oder:
https://www.npmjs.com/package/pm2-windows-startup

4) bad
./ps1 scripts/AutoDarkMode.ps1 in autostart
./ps1 scripts/ einzeln

5) direct
`npm run *[apps|system-][light|dark]`
