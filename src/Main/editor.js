const fs = require('fs');
const path = require('path');
const {
    BrowserView,
    BrowserWindow,
    Menu,
    MenuItem,
    ipcMain
} = require('electron');
const shell = require('shelljs');
const rimraf = require('rimraf');
const { parseElement, stringify } = require('./utils');
const prettier = require('prettier/standalone');
const plugins = [require('prettier/parser-babylon')];

let editorMainWindow,
    editorMainWindowX,
    editorMainWindowY,
    editorMainWindowWidth,
    editorMainWindowHeight;
let emulatorWindow,
    emulatorX,
    emulatorY,
    emulatorWidth,
    emulatorHeight,
    showEmulator = true;
let emulatorView;
let emulatorToolBarView,
    emulatorToolBarViewHeight = 40;
let editorWindow,
    editorX,
    editorY,
    editorWidth,
    editorHeight,
    showEditor = true;
let devToolsWindow,
    devToolsX,
    devToolsY,
    devToolsWidth,
    devToolsHeight,
    showDevTools = true;
let toolBarView;
const toolBarViewHeight = 60;
let dndWindow;
let catalog;
let isToggling = false;
let terminalWindow;
let execRes;
let projectPath;
let activeContent = '';
let activeAst = {};
let sourceData = '';
const deviceTypeMenu = new Menu();
const deviceSizeMenu = new Menu();

const execCommand = ({
    command,
    onData = () => {},
    onError = () => {},
    onComplete = () => {}
}) => {
    let isSuccess = false;
    execRes = shell.exec(command, { async: true });
    execRes.stderr.on('data', error => {
        onError(error);
    });
    execRes.stdout
        .on('data', data => {
            if (data.includes('successfully')) {
                isSuccess = true;
            }
            onData(data, isSuccess);
        })
        .on('end', () => {
            console.log('end');
            console.log(isSuccess);
            onComplete(isSuccess);
        });
    ipcMain.once('exit-command', () => {
        const pid = execRes.pid;
        process.kill(pid);
        process.kill(pid + 1);
        process.kill(pid + 2);
        onError('exit.');
    });
};

const createWindow = () => {
    editorMainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    editorMainWindow.on('closed', () => {
        editorMainWindow = null;
    });
    editorMainWindow.maximize();

    const { x, y, width, height } = editorMainWindow.getContentBounds();
    editorMainWindowX = x;
    editorMainWindowY = y;
    editorMainWindowWidth = width;
    editorMainWindowHeight = height;
};
const handleMenuItemClick = (type, value) => {
    emulatorToolBarView.webContents.send('menu-item-click', [type, value]);
};
const deviceTypeMenuItems = [
    {
        label: 'Responsive',
        checked: true,
        type: 'device-type',
        value: 'Responsive'
    },
    { label: 'iPhone 6/7/8', type: 'device-type', value: 'iPhone 6' },
    { label: 'iPhone X', type: 'device-type', value: 'iPhone X' }
];
const deviceSizeItems = [
    { label: '50%', type: 'device-size', value: 0.5 },
    { label: '75%', type: 'device-size', value: 0.75 },
    { label: '100%', type: 'device-size', value: 1, checked: true }
];
const createElmulatorWindowMenu = () => {
    // type
    deviceTypeMenuItems.forEach(item => {
        const { label, type, value, ...rest } = item;
        deviceTypeMenu.append(
            new MenuItem({
                label,
                type: 'radio',
                click: () => {
                    handleMenuItemClick(type, value);
                },
                ...rest
            })
        );
    });
    // size
    deviceSizeItems.forEach(item => {
        const { label, type, value, ...rest } = item;
        deviceSizeMenu.append(
            new MenuItem({
                label,
                type: 'radio',
                click: () => {
                    handleMenuItemClick(type, value);
                },
                ...rest
            })
        );
    });
};
ipcMain.on('show-device-type-menu', () => {
    deviceTypeMenu.popup(emulatorWindow);
});
ipcMain.on('show-device-size-menu', () => {
    deviceSizeMenu.popup(emulatorWindow);
});
const createEmulatorWindow = () => {
    // emulatorWindow
    emulatorWindow = new BrowserWindow({
        parent: editorMainWindow,
        frame: false,
        movable: false
    });

    emulatorX = editorMainWindowX;
    emulatorY = editorMainWindowY + toolBarViewHeight;
    emulatorWidth = Math.floor(editorMainWindowWidth / 3);
    emulatorHeight = editorMainWindowHeight;
    emulatorWindow.setBounds({
        x: emulatorX,
        y: emulatorY,
        width: emulatorWidth,
        height: emulatorHeight
    });
    // emulatorToolBar
    emulatorToolBarView = new BrowserView({
        webPreferences: {
            nodeIntegration: true
        }
    });
    emulatorWindow.addBrowserView(emulatorToolBarView);
    emulatorToolBarView.setBounds({
        x: emulatorX,
        y: 0,
        width: emulatorWidth,
        height: emulatorToolBarViewHeight
    });
    emulatorToolBarView.webContents.loadURL(
        'http://localhost:3000/toolbar/emulator'
    );
    // emulatorView
    emulatorView = new BrowserView();
    emulatorWindow.addBrowserView(emulatorView);
    emulatorView.setBounds({
        x: emulatorX,
        y: emulatorToolBarViewHeight,
        width: emulatorWidth,
        height: emulatorHeight - emulatorToolBarViewHeight
    });
    emulatorView.webContents.loadURL('about:blank');

    emulatorWindow.on('resize', () => {
        if (isToggling) {
            return;
        }
        const {
            x: newX,
            width: newWidth,
            height: newHeight
        } = emulatorWindow.getBounds();
        const {
            x: currentEditorX,
            width: currentEditorWidth
        } = editorWindow.getBounds();
        const {
            x: currentDevToolsX,
            width: currentDevToolsWidth
        } = devToolsWindow.getBounds();
        const widthOffset = newWidth - emulatorWidth;
        emulatorWidth = newWidth;
        editorWidth = currentEditorWidth - widthOffset;
        devToolsWidth = currentDevToolsWidth - widthOffset;
        editorWindow.setBounds({
            x: currentEditorX + widthOffset,
            width: editorWidth
        });
        devToolsWindow.setBounds({
            x: currentDevToolsX + widthOffset,
            width: devToolsWidth
        });
        emulatorView.setBounds({
            x: newX,
            y: emulatorToolBarViewHeight,
            width: newWidth,
            height: newHeight - emulatorToolBarViewHeight
        });
        emulatorToolBarView.setBounds({
            x: newX,
            y: 0,
            width: newWidth,
            height: emulatorToolBarViewHeight
        });
    });
};
const createEditorWindow = () => {
    editorWindow = new BrowserWindow({
        parent: editorMainWindow,
        frame: false,
        movable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    editorX = Math.floor(editorMainWindowWidth / 3);
    editorY = editorMainWindowY + toolBarViewHeight;
    editorWidth = Math.floor((editorMainWindowWidth * 2) / 3);
    editorHeight = Math.floor(
        ((editorMainWindowHeight - toolBarViewHeight) * 2) / 3
    );
    editorWindow.setBounds({
        x: editorX,
        y: editorY,
        width: editorWidth,
        height: editorHeight
    });

    editorWindow.webContents.loadURL('http://localhost:3000/editor');
};
const createDevToolsWindow = () => {
    devToolsWindow = new BrowserWindow({
        parent: editorMainWindow,
        frame: false,
        movable: false
    });
    devToolsX = Math.floor(editorMainWindowWidth / 3);
    devToolsY = editorMainWindowY + toolBarViewHeight + editorHeight;
    devToolsWidth = Math.floor((editorMainWindowWidth * 2) / 3);
    devToolsHeight = Math.floor(
        (editorMainWindowHeight - toolBarViewHeight) / 3
    );
    devToolsWindow.setBounds({
        x: devToolsX,
        y: devToolsY,
        width: devToolsWidth,
        height: devToolsHeight
    });
    devToolsWindow.on('resize', () => {
        if (isToggling) {
            return;
        }
        const { height: newHeight } = devToolsWindow.getBounds();
        const { height: currentEditorHeight } = editorWindow.getBounds();
        const heightOffset = newHeight - devToolsHeight;
        devToolsHeight = newHeight;
        editorHeight = currentEditorHeight - heightOffset;
        editorWindow.setBounds({
            height: editorHeight
        });
    });
};
const createToolBarView = () => {
    toolBarView = new BrowserView({
        webPreferences: {
            nodeIntegration: true
        }
    });
    editorMainWindow.addBrowserView(toolBarView);
    toolBarView.setBounds({
        x: editorMainWindowX,
        y: 0,
        width: editorMainWindowWidth,
        height: toolBarViewHeight
    });
    toolBarView.webContents.loadURL('http://localhost:3000/toolbar');
};
const createDndWindow = () => {
    dndWindow = new BrowserWindow({
        parent: editorMainWindow,
        frame: false,
        movable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    dndWindow.setBounds({
        x: editorMainWindowX,
        y: editorMainWindowY + toolBarViewHeight,
        width: editorMainWindowWidth,
        height: editorMainWindowHeight - toolBarViewHeight
    });
    dndWindow.webContents.loadURL('http://localhost:3000/dnd');
    dndWindow.hide();
};
const readFile = filePath => {
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
                  key: fileDir
              };
    });
};
const resizeWindows = () => {
    if (showEmulator) {
        emulatorWindow.setBounds({
            x: emulatorX,
            y: emulatorY,
            width:
                showEditor || showDevTools
                    ? emulatorWidth
                    : editorMainWindowWidth,
            height: emulatorHeight
        });
    }
    if (showEditor) {
        editorWindow.setBounds({
            x: showEmulator ? editorX : editorMainWindowX,
            y: editorY,
            width: showEmulator ? editorWidth : editorMainWindowWidth,
            height: showDevTools
                ? editorHeight
                : editorMainWindowHeight - toolBarViewHeight
        });
    }
    if (showDevTools) {
        devToolsWindow.setBounds({
            x: showEmulator ? devToolsX : editorMainWindowX,
            y: showEditor ? devToolsY : editorMainWindowY + toolBarViewHeight,
            width: showEmulator ? devToolsWidth : editorMainWindowWidth,
            height: showEditor
                ? devToolsHeight
                : editorMainWindowHeight - toolBarViewHeight
        });
    }
};
const addTerminalWindow = () => {
    terminalWindow = BrowserWindow.getAllWindows().filter(
        item => !item.isVisible()
    )[0];
    terminalWindow.setParentWindow(editorMainWindow);
    terminalWindow.setBounds({
        x: editorMainWindowX,
        y: editorMainWindowY,
        width: editorMainWindowWidth,
        height: editorMainWindowHeight
    });
    terminalWindow.webContents.send('fit-terminal');
};
const loadEmulator = url => {
    emulatorView.webContents.loadURL(url);
};
ipcMain.on('open-project', (event, arg) => {
    const { pName, pPath } = arg;
    projectPath = pPath + '/' + pName;
    catalog = readFile(projectPath);
    createWindow();
    createEditorWindow();
    createDevToolsWindow();
    createEmulatorWindow();
    createToolBarView();
    createElmulatorWindowMenu();
    addTerminalWindow();
    createDndWindow();
    editorWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
    editorWindow.webContents.openDevTools({ mode: 'detach' });
    // emulatorWindow.hide();
    // editorWindow.hide();
    // devToolsWindow.hide();
    // dndWindow.show();
});
ipcMain.on('get-catalog', (event, path) => {
    if (path) {
        catalog = readFile(path);
    }
    event.reply('get-catalog-reply', catalog);
});
ipcMain.on('open-file', (event, key) => {
    fs.readFile(key, 'utf8', (err, data) => {
        if (err) throw err;
        event.reply('open-file-reply', { key, data });
    });
});
ipcMain.on('save-file', (event, arg) => {
    const { file, value } = arg;
    const formatVal = prettier.format(value, { parser: 'babel', plugins });
    fs.writeFile(file, formatVal, 'utf8', err => {
        if (err) throw err;
        console.log('保存成功');
        console.log(activeContent);
        console.log(formatVal);
        editorWindow.webContents.send('set-editor-content', [
            activeContent,
            formatVal
        ]);
    });
});
ipcMain.on('toggle-emulator', (event, hideEmulator) => {
    isToggling = true;
    showEmulator = !hideEmulator;
    if (hideEmulator) {
        const bounds = emulatorWindow.getBounds();
        emulatorX = bounds.x;
        emulatorY = bounds.y;
        emulatorWidth = bounds.width;
        emulatorHeight = bounds.height;
        emulatorWindow.hide();
    } else {
        emulatorWindow.show();
    }
    resizeWindows();
    isToggling = false;
});
ipcMain.on('toggle-editor', (event, hideEditor) => {
    isToggling = true;
    showEditor = !hideEditor;
    if (hideEditor) {
        const bounds = editorWindow.getBounds();
        editorX = bounds.x;
        editorY = bounds.y;
        editorWidth = bounds.width;
        editorHeight = bounds.height;
        editorWindow.hide();
    } else {
        editorWindow.show();
    }
    resizeWindows();
    isToggling = false;
});
ipcMain.on('toggle-devtools', (event, hideDevTools) => {
    isToggling = true;
    showDevTools = !hideDevTools;
    if (hideDevTools) {
        const bounds = devToolsWindow.getBounds();
        devToolsX = bounds.x;
        devToolsY = bounds.y;
        devToolsWidth = bounds.width;
        devToolsHeight = bounds.height;
        devToolsWindow.hide();
    } else {
        devToolsWindow.show();
    }
    resizeWindows();
    isToggling = false;
});
ipcMain.on('open-terminal', event => {
    terminalWindow.show();
});
ipcMain.on('close-terminal', () => {
    terminalWindow && terminalWindow.hide();
});
ipcMain.on('run-project', (event, isRunProject) => {
    if (isRunProject) {
        shell.cd(projectPath);
        execCommand({
            command: 'yarn start',
            onData: (data, isSuccess) => {
                terminalWindow.webContents.send('exec-command-reply', {
                    status: 'success',
                    data
                });
                isSuccess && event.reply('run-project-success');
                if (isSuccess && data.includes('Local')) {
                    loadEmulator('http://localhost:7427/');
                }
            },
            onError: error => {
                terminalWindow.webContents.send('exec-command-reply', {
                    status: 'error',
                    error
                });
            },
            onComplete: isSuccess => {
                terminalWindow.webContents.send('exec-command-reply', {
                    status: 'end'
                });

                event.reply('run-project-reply', isSuccess);
            }
        });
    } else {
        const pid = execRes.pid;
        console.log(pid);
        process.kill(pid);
        process.kill(pid + 1);
        process.kill(pid + 2);
        event.reply('run-project-reply', true);
    }
});
ipcMain.on('set-enable-device-emulation', (event, options) => {
    emulatorView.webContents.enableDeviceEmulation(options);
});
ipcMain.on('send-active-content', (event, key) => {
    activeContent = key;
});
ipcMain.on('open-dnd', () => {
    if (!activeContent) {
        return;
    }
    checkoutToolBar(true);
    fs.readFile(activeContent, 'utf8', (err, data) => {
        if (err) throw err;
        const { element, compName, dependencies, variables, functions } = parse(
            data
        );
        const ast = parseElement(
            element,
            compName,
            dependencies,
            variables,
            functions
        )[0];
        sourceData = data;
        emulatorWindow.hide();
        editorWindow.hide();
        devToolsWindow.hide();
        dndWindow.show();
        dndWindow.webContents.send('set-ast', ast);
    });
});
ipcMain.on('open-editor', () => {
    sourceData = stringify(activeAst.children);
    sourceData = prettier.format(sourceData, { parser: 'babel', plugins });
    fs.writeFile(activeContent, sourceData, 'utf8', err => {
        if (err) throw err;
        console.log('修改成功');
        dndWindow.webContents.send('init-dnd');
        editorWindow.webContents.send('set-editor-content', [
            activeContent,
            sourceData
        ]);
        checkoutToolBar(false);
        emulatorWindow.show();
        editorWindow.show();
        devToolsWindow.show();
        dndWindow.hide();
        resizeWindows();
    });
});
ipcMain.on('send-active-ast', (event, ast) => {
    activeAst = ast;
});
const checkoutToolBar = isDnd => {
    toolBarView.webContents.send('checkout-toolbar', isDnd);
};
const parse = str => {
    const strArr = str
        .split('\n')
        .map(item => item.trim())
        .filter(item => !!item);
    const depReg = /import.*;/g;
    const depRegMulti = /import {$/;
    const depRegMultiEnd = /from.*;$/;
    const elementReg = /export.*=> {/;
    const functionReg = /(const|let) .+ = ((\(\)|\(?\w+.*\)?))(?=\s=>)/;
    const variableReg = /(const|let) .+ = (?!(\()|(\w* =>))/;
    const returnReg = /return \(/;
    const dependencies = [];
    const variables = [];
    const functions = [];
    const stack = [];
    let idx = 0;
    let element;
    let compName;
    while (idx < strArr.length) {
        const line = strArr[idx];
        if (depReg.test(line)) {
            // 引入文件
            parseDependencies(line, dependencies);
        } else if (depRegMulti.test(line)) {
            // 引入多行文件
            const depStart = idx;
            while (!depRegMultiEnd.test(strArr[++idx])) {}
            const depEnd = idx;
            parseDependencies(
                strArr.slice(depStart, depEnd + 1).join(''),
                dependencies
            );
        } else if (elementReg.test(line)) {
            compName = parseCompName(line);
        } else if (variableReg.test(line)) {
            if (line[line.length - 1] !== ';') {
                const varStart = idx;
                while (strArr[++idx] !== '});') {}
                const varEnd = idx;
                parseVariable(
                    strArr.slice(varStart, varEnd + 1).join(''),
                    variables
                );
            } else {
                parseVariable(line, variables);
            }
        } else if (functionReg.test(line)) {
            const functionStart = idx;
            while (strArr[++idx] !== '};') {}
            const functionEnd = idx;
            parseFunction(
                strArr.slice(functionStart, functionEnd + 1).join(''),
                functions
            );
        } else if (returnReg.test(line)) {
            stack.push(idx);
        } else if (line === ');') {
            const lastIdx = stack.pop();
            if (!stack.length) {
                element = strArr.slice(lastIdx + 1, idx).join('\n');
            }
        }
        idx++;
    }
    return { element, compName, dependencies, variables, functions };
};
const parseCompName = str => {
    return str.match(/(?<=const\s).*(?=\s\=\s)/g)[0];
};
const parseDependencies = (str, dependencies) => {
    const [key, val] = str.split('import ')[1].split(' from ');
    dependencies.push({ key, val: val.substring(0, val.length - 1) });
};
const parseVariable = (str, variables) => {
    const [key, ...val] = str.split('const ')[1].split(' = ');
    variables.push({ key, val: val.join('') });
};
const parseFunction = (str, functions) => {
    const [key, ...val] = str.split('const ')[1].split(' = ');
    functions.push({ key, val: val.join('') });
};
const rightClickMenuItem4Folder = [
    { label: '新建文件', value: 'addFile' },
    { label: '新建文件夹', value: 'addFolder' },
    { type: 'separator' }
];
const rightClickMenuItem = [
    { label: '重命名', value: 'rename' },
    { label: '删除', value: 'delete' }
];
ipcMain.on('open-right-click-menu', (event, isLeaf) => {
    let rightClickMenu = new Menu();
    (isLeaf
        ? rightClickMenuItem
        : [...rightClickMenuItem4Folder, ...rightClickMenuItem]
    ).forEach(({ label, value, type }) => {
        rightClickMenu.append(
            new MenuItem({
                label,
                type: type || 'normal',
                click: () => {
                    event.reply('open-right-click-menu-reply', value);
                    rightClickMenu = null;
                }
            })
        );
    });
    rightClickMenu.popup(editorWindow);
});
ipcMain.on('rename-file', (event, arg) => {
    const [oldPath, newPath] = arg;
    fs.rename(oldPath, newPath, err => {
        if (err) throw err;
        console.log('重命名完成');
        event.reply('rename-file-reply', true);
    });
});
ipcMain.on('add-file', (event, arg) => {
    const [key, isLeaf] = arg;
    isLeaf
        ? fs.writeFile(key, '', err => {
              if (err) throw err;
              console.log('新建文件完成');
              event.reply('add-file-reply', true);
          })
        : fs.mkdir(key, err => {
              if (err) throw err;
              console.log('新建文件夹完成');
              event.reply('add-file-reply', true);
          });
});

ipcMain.on('delete-file', (event, arg) => {
    const [key, isLeaf] = arg;
    isLeaf
        ? fs.unlink(key, err => {
              if (err) throw err;
              console.log('删除文件完成');
              event.reply('delete-file-reply', true);
          })
        : rimraf(key, err => {
              if (err) throw err;
              console.log('删除文件夹完成');
              event.reply('delete-file-reply', true);
          });
});

ipcMain.on('toggle-page-attr', (event, showPageAttr) => {
    dndWindow.webContents.send('toggle-page-attr-reply');
});
ipcMain.on('close-page-attr', () => {
    toolBarView.webContents.send('close-page-attr-reply');
});
