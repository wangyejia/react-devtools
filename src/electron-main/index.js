// Modules to control application life and create native browser window
const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const client = require('electron-connect').client;
const shell = require('shelljs');
const nodePath = shell.which('node').toString();
shell.config.execPath = nodePath;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let terminalWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 450,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    // 打包时使用
    // mainWindow.loadURL(
    //   url.format({
    //     pathname: path.join(__dirname, "index.html"),
    //     protocal: "file:",
    //     slashes: true
    //   })
    // );
    // 开发时使用
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    terminalWindow = new BrowserWindow({
        frame: false,
        movable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    terminalWindow.loadURL('http://localhost:3000/terminal');
    terminalWindow.hide();
    client.create(mainWindow);
    // mainWindow.maximize();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const execCommand = ({
    command,
    onData = () => {},
    onError = () => {},
    onComplete = () => {}
}) => {
    let execRes = shell.exec(command, { async: true });
    execRes.stderr.on('data', error => {
        onError(error);
    });
    execRes.stdout
        .on('data', data => {
            onData(data);
        })
        .on('end', () => {
            onComplete();
        });
    ipcMain.once('exit-command', () => {
        execRes.kill();
        onError('exit.');
    });
};
ipcMain.on('open-project', (event, arg) => {
    terminalWindow.hide();
});

ipcMain.on('create-project', (event, arg) => {
    terminalWindow.setParentWindow(mainWindow);
    const { x, y, width, height } = mainWindow.getContentBounds();
    terminalWindow.setBounds({
        x,
        y,
        width,
        height
    });
    terminalWindow.show();
    const { pName, pPath, pTool = [] } = arg;
    const command = `yarn create react-app ${pName}${
        pTool.length ? ' --template ' + pTool.sort().join('-') : ''
    }`;
    terminalWindow.webContents.send('write-command', command);
    let stat = true;
    shell.cd(pPath);
    execCommand({
        command,
        onData: data => {
            terminalWindow.webContents.send('exec-command-reply', {
                status: 'success',
                data
            });
            stat = true;
        },
        onError: error => {
            terminalWindow.webContents.send('exec-command-reply', {
                status: 'error',
                error
            });
            stat = false;
        },
        onComplete: () => {
            terminalWindow.webContents.send('exec-command-reply', {
                status: 'end'
            });
            event.reply('create-project-reply', [arg, stat]);
        }
    });
});
ipcMain.once('close-terminal', () => {
    terminalWindow.hide();
});
ipcMain.on('exec-command', (event, command) => {
    execCommand({
        command,
        onData: data => {
            event.reply('exec-command-reply', { status: 'success', data });
        },
        onError: error => {
            event.reply('exec-command-reply', { status: 'error', error });
        },
        onComplete: () => {
            event.reply('exec-command-reply', { status: 'end' });
        }
    });
});
require('./editor');
