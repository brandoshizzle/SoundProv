const electron = require("electron");
const {app, BrowserWindow} = electron;
//const buzz = require("buzz");

app.on('ready', function(){
  var win = new BrowserWindow({
    width: 800,
    height: 600
  });
  win.loadURL('file://' + __dirname + '/main.html');
  //win.openDevTools();
})