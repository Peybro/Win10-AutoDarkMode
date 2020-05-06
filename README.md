# Auto-Dark-Mode for Win10
This program makes your Windows change the theme automaticallyy based on the time of the day.

## Pre-Install
Install the needed dependencies:
```
$ npm i
```

## Installation
There are 5 different ways to use this:
#### 1) The "normal" way: 
This will run the program in the terminal you started it. If you want this to start with Windows you can create a batch file with the command in the main directory and put a link to it in your Windows startup folder.
```
$ npm start
```

#### 2) The "normal" way in background-mode: 
This is literally the `normal` way but it runs without a visible terminal window. Just put a link of `./start_bg.vbs` in your Windows startup folder.
To terminate the process you have to use Windows Task Manager and terminate the node.js process.

#### 3) The best way with pm2: 
This is probably the best way to run this program. To make it work you have to install [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) globally. Then hit:
```
$ pm2 start ./src/app.js --name AutoDarkMode --watch
```
**To start pm2 with windows:**
* Either put `./start_pm.bat` in Windows startup folder
* Or install [pm2-windows-startup](https://www.npmjs.com/package/pm2-windows-startup) globally and call pm2-startup once by:
    ```
    $ pm2-startup install
    ```
    After that you need to run pm2 normally and (check `$ pm2 list` if your process is running and if so) hit: 
    ```
    $ pm2 save
    ```

#### 4) The "bad" way: 
This actually does not require node.js to work. Just put `./ps1 scripts/AutoDarkMode.ps1` in your Windows startup folder. **Note:** This is not continously checking for the time - it fires just once when your system boots up or you hit it manually. You also have to change the time in the script itself if you want other day-/night times.
In addition to that you can also run each other ps1 script in `./ps1 scripts/` on its own if you're too lazy to go to the Windows settings.

#### 5) The manual way: 
Similar to the ps1 files, if you are too lazy to change the Windows settings manually you can hit 
```
$ npm run *[apps-|system-][light|dark]
``` 
whereas you can decide wether you want to change only apps or only system mode or both together (apps/system) is optionally.

### Comparison
|    | run on startup                        | hot reload (change config.json) | background (run forever) |
|----|--------------------------------|------------------|--------------------------|
| 1) | ✔ (with .bat)                  | ✔                | ❌                        |
| 2) | ✔ (with .vbs)                  | ✔                | ✔                        |
| 3) | ✔  (with .bat  or pm2-startup) | ✔ (with --watch) | ✔                        |
| 4) | ✔ (with .ps1)                  | ❌                | ❌                        |
| 5) | ❌                              | ❌                | ❌                        |

## Change settings (`./config.json`)
* To change the times in which Day/Night Mode shall take effect, just change from when - until when your Day (Light) Mode shall be activated. The Night (Dark) Mode will the be the opposite of the setting.
* To change wether your system or your apps shall not be affected by a change, just toggle true/false on system/apps in setting.

## Built With
*  [node-cron](https://nodecron.com/) - Task scheduler for continous intervalling
*  [regedit](https://github.com/ironSource/node-regedit) - to change Dark/Light Mode in Registry
*  [nodemon](https://nodemon.io/) - Hot Reloader on file change
*  [pm2](https://pm2.keymetrics.io/) - Process Manager for scripts
*  [pm2-windows-startup](https://github.com/marklagendijk/node-pm2-windows-startup) - to run pm2 on startup

## License
This project is licensed under the MIT License.


