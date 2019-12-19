const fs = require('fs');
const path = require('path');
const { BrowserView, BrowserWindow, ipcMain } = require('electron');
let mainWindow;
let emulatorView;
let editorView;
let devToolsView;
let catalog;

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}
function createEmulatorView() {
    emulatorView = new BrowserView();
    mainWindow.addBrowserView(emulatorView);
    const { width, height } = mainWindow.getBounds();
    emulatorView.setBounds({
        x: 0,
        y: 0,
        width: Math.floor(width / 3),
        height
    });
    emulatorView.webContents.loadURL('https://electronjs.org');
}
function createEditorView() {
    editorView = new BrowserView({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.addBrowserView(editorView);
    const { width, height } = mainWindow.getBounds();
    editorView.setBounds({
        x: Math.floor(width / 3),
        y: 0,
        width: Math.floor((width * 2) / 3),
        height: Math.floor((height * 2) / 3)
    });

    editorView.webContents.loadURL('http://localhost:3000/editor');
}
function createDevToolsView() {
    devToolsView = new BrowserView();
    mainWindow.addBrowserView(devToolsView);
    const { width, height } = mainWindow.getBounds();
    devToolsView.setBounds({
        x: Math.floor(width / 3),
        y: Math.floor((height * 2) / 3),
        width: Math.floor((width * 2) / 3),
        height: Math.floor(height / 3)
    });
}
function readFile(filePath) {
    const files = fs.readdirSync(filePath);
    return files.map(fileName => {
        const fileDir = path.join(filePath, fileName);
        const stat = fs.statSync(fileDir);
        const isLeaf = stat.isFile();
        return isLeaf
            ? {
                  title: fileName,
                  key: fileDir,
                  isLeaf: stat.isFile()
              }
            : {
                  title: fileName,
                  key: fileDir,
                  children: []
              };
    });
}
ipcMain.on('open-project', (event, arg) => {
    catalog = readFile(arg.pPath);
    createWindow();
    mainWindow.maximize();
    createEditorView();
    createDevToolsView();
    createEmulatorView();
    emulatorView.webContents.setDevToolsWebContents(devToolsView.webContents);
    emulatorView.webContents.openDevTools({ mode: 'detach' });
});
ipcMain.on('get-catalog', event => {
    event.reply('get-catalog-reply', catalog);
});
