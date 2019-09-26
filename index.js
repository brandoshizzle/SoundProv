/*jshint esversion: 6 */
const electron = require('electron');
const { app, BrowserWindow, dialog } = electron;
const Splashscreen = require('@trodi/electron-splashscreen');
//var client = require('electron-connect').client;

app.on('ready', function() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    const windowOptions = {
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true
        },
        darkTheme: true
    };

    const delay = 2500;
    let readyToShow = false;
    const delayTimer = setTimeout(() => {
        readyToShow = true;
    }, delay);

    const win = Splashscreen.initSplashScreen({
        windowOpts: windowOptions,
        templateUrl: '/build/splash/splash.html',
        delay: 0, // force show immediately since example will load fast
        minVisible: delay, // show for 1.5s so example is obvious
        splashScreenOpts: {
            height: 500,
            width: 500,
            transparent: true,
            webPreferences: {
                nodeIntegration: true
            }
        }
    });

    //const win = new BrowserWindow(options);
    win.loadURL('file://' + __dirname + '/src/main.html');

    win.once('show', () => {
        win.maximize();
    });

    win.openDevTools();
});

app.on('window-all-closed', function() {
    app.quit();
});
