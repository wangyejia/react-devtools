import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript.js';
const { ipcRenderer } = window.require('electron');

export const CodeMirrorWrap = props => {
    const { data, file } = props;
    let keyBuffer = [];
    return (
        <CodeMirror
            value={data}
            options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                styleActiveLine: true,
                lineWrapping: true,
                foldGutter: true,
                showCursorWhenSelecting: true,
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
            }}
            onKeyDown={(editor, event) => {
                const { key } = event;
                const keyBufferLength = keyBuffer.length;
                if (keyBufferLength && keyBuffer[keyBufferLength - 1] === key) {
                    return;
                }
                keyBuffer.push(key);
            }}
            onKeyUp={(editor, event) => {
                const key = keyBuffer.join('+');
                if (key === 'Meta+s') {
                    ipcRenderer.send('save-file', {
                        file,
                        value: editor.getValue()
                    });
                }
                keyBuffer = [];
            }}
        />
    );
};
