import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import {
    addEditorContent,
    setEditorContent,
    setActiveContent,
    deleteEditorContent
} from 'Actions';
import { CodeMirrorWrap } from 'Components';
const { ipcRenderer } = window.require('electron');

const { TabPane } = Tabs;
let newContentIdx = 1;

export const EditorContent = () => {
    const dispatch = useDispatch();
    const editorContents = useSelector(state => state.editor.contents) || [];
    const activeContent =
        useSelector(state => state.editor.activeContent) || '';
    useEffect(() => {
        ipcRenderer.on('open-file-reply', (event, arg) => {
            const { key, data } = arg;
            const tab = key.split('/').slice(-1)[0];
            dispatch(addEditorContent({ key, data, tab }));
        });
        ipcRenderer.on('set-editor-content', (event, arg) => {
            const [key, data] = arg;
            dispatch(setEditorContent(key, data));
        });
    }, []);
    useEffect(() => {
        ipcRenderer.send('send-active-content', activeContent);
    }, [activeContent]);
    const renderTabPanes = contents => {
        return contents.map(content => {
            const { tab, key, data, ...others } = content;
            return (
                <TabPane tab={tab} key={key} {...others}>
                    <CodeMirrorWrap data={data} file={key} />
                </TabPane>
            );
        });
    };
    const handleChange = key => {
        if (key === 'add-content') {
            dispatch(
                addEditorContent({
                    key: `Untitled-${newContentIdx}`,
                    data: '',
                    tab: `Untitled-${newContentIdx}`
                })
            );
            newContentIdx++;
        } else {
            dispatch(setActiveContent(key));
        }
    };
    const handleEdit = targetKey => {
        handleRemove(targetKey);
    };
    const handleRemove = key => {
        dispatch(deleteEditorContent(key));
    };
    return (
        <Tabs
            hideAdd
            type='editable-card'
            activeKey={activeContent}
            onEdit={handleEdit}
            onChange={handleChange}
        >
            {renderTabPanes(editorContents)};
            <TabPane tab='+' key='add-content' closable={false}></TabPane>
        </Tabs>
    );
};
