const { ipcMain } = require('electron');
const shell = require('shelljs');
const nodePath = shell.which('node').toString();
shell.config.execPath = nodePath;

ipcMain.on('create-project', (event, arg) => {
    const { pName, pPath } = arg;
    shell.cd(pPath);
    event.reply('create-project-reply', [
        arg,
        shell.exec('npx create-react-app ' + pName).code === 0
    ]);
});
