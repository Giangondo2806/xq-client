import { app, BrowserWindow, ipcMain, protocol, screen, session } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';

// Initialize remote module
require('@electron/remote/main').initialize();
let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');


protocol.registerSchemesAsPrivileged([{
  scheme: 'atom',
  privileges: {
    standard: true,
    secure: true,
    allowServiceWorkers: true,
    supportFetchAPI: true
  }
}]);


function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.webContents.openDevTools();
  if (serve) {

    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex)
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  win.setMenuBarVisibility(false);

  return win;
}

ipcMain.on('loginScreen', () => {
  win.unmaximize();
  win.setSize(400, 600, false);
  // win.resizable = false;
  // const cookie = { url: 'http://localhost:3333/api/security/refresh-token', name: 'rtok', value: 'dummy' }
  // session.defaultSession.cookies.set(cookie)


})


ipcMain.on('homeScreen', () => {
  win.unmaximize();
  win.setSize(1200, 900, false);
})

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    protocol.registerFileProtocol('app', (request, callback) => {
      const url = request.url.substr(6);
      callback({
        path: path.normalize(`${__dirname}/${url}`)
      });
    });
    session.defaultSession.cookies.remove('http://localhost','rtok');
    session.defaultSession.cookies.get({}).then(data => console.log(data));
    createWindow();


  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
