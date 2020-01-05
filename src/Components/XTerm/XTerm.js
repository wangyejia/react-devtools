import React, { useEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Button } from 'antd';
import { codeTypes, keyTypes } from 'Constants';
import 'xterm/css/xterm.css';
import './index.less';
const { ipcRenderer } = window.require('electron');

const terminal = new Terminal({
    convertEol: true, //启用时，光标将设置为下一行的开头
    cursorStyle: 'bar', //光标样式
    cursorBlink: true, //光标闪烁
    theme: {
        foreground: '#1DA57A', //字体
        background: '#001529', //背景色
        cursor: 'help' //设置光标
    }
});
const fitAddon = new FitAddon();

export const XTerm = () => {
    let keyBuffer = [];
    let commandBuffer = [];
    let commandIdx = 0;
    useEffect(() => {
        terminal.loadAddon(fitAddon);
        terminal.open(document.getElementById('J-xterm'));
        terminal.writeln('Welcome to React Devtools');
        terminal.write('$ ');
        terminal.focus();
        terminal.onKey(({ key, domEvent }) => {
            const { code } = domEvent;
            switch (code) {
                case codeTypes.ENTER:
                    terminal.write('\n');
                    const command = commandBuffer.join('').trim();
                    command ? execShellCommand(command) : terminal.write('$ ');
                    commandBuffer = [];
                    commandIdx = 0;
                    break;
                case codeTypes.BACKSPACK:
                    if (commandIdx) {
                        commandBuffer.splice(--commandIdx, 1);
                        terminal.write('[D [D');
                    }
                    break;
                case codeTypes.ARROW_LEFT:
                    if (commandIdx) {
                        terminal.write(key);
                        commandIdx--;
                    }
                    break;
                case codeTypes.ARROW_RIGHT:
                    ++commandIdx > commandBuffer.length &&
                        commandBuffer.splice(commandIdx, 1, ' ');
                    terminal.write(key);
                    break;
                default:
                    const keys = keyBuffer.join('+');
                    if (keys === 'Control+c') {
                        terminal.writeln('^c');
                        terminal.write('$ ');
                    } else {
                        commandBuffer.splice(commandIdx++, 1, key);
                        terminal.write(key);
                    }
                    break;
            }
        });
        terminal.attachCustomKeyEventHandler(e => {
            const { type, key } = e;
            if (type === keyTypes.KEY_UP || type === keyTypes.KEY_PRESS) {
                const keys = keyBuffer.join('+');
                if (keys === 'Control+c') {
                    exitShellCommand();
                }
                const keyIdx = keyBuffer.indexOf(key);
                keyBuffer.splice(keyIdx, 1);
                return;
            }
            keyBuffer.push(key);
        });
        ipcRenderer.on('exec-command-reply', (event, res) => {
            const { status, data, error } = res;
            if (status === 'success') {
                terminal.writeln(data);
            } else if (status === 'error') {
                terminal.writeln(error);
            } else {
                terminal.write('$ ');
            }
        });
        ipcRenderer.on('write-command', (event, command) => {
            terminal.writeln(command);
        });
        ipcRenderer.on('fit-terminal', () => {
            fitAddon.fit();
        });
    }, []);
    const execShellCommand = command => {
        ipcRenderer.send('exec-command', command);
    };
    const exitShellCommand = () => {
        ipcRenderer.send('exit-command');
    };
    const handleCloseTerminal = () => {
        ipcRenderer.send('close-terminal');
    };
    return (
        <div className='xterm-container'>
            <div id='J-xterm' className='xterm'></div>
            <Button
                ghost
                type='link'
                icon='close'
                className='xterm-close'
                onClick={handleCloseTerminal}
            ></Button>
        </div>
    );
};
