nmp i -g pm2
npm i -g pm2-windows-startup
pm2-startup install
pm2 start ./src/app.js --name AutoDarkMode --watch
pm2 save