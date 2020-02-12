import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col } from 'antd';
import {
    toggleEmulator,
    toggleEditor,
    toggleDevtools,
    toggleRunProject,
    toggleLoading,
    toggleToolBar,
    togglePageAttr
} from 'Actions';
const { ipcRenderer } = window.require('electron');

export const EditorToolBar = () => {
    const dispatch = useDispatch();
    const toolbarState = useSelector(state => state.toolbar);
    const {
        hideEmulator,
        hideEditor,
        hideDevtools,
        isRunProject,
        showLoading,
        isDnd,
        showPageAttr
    } = toolbarState;
    useEffect(() => {
        ipcRenderer.on('checkout-toolbar', (event, arg) => {
            dispatch(toggleToolBar(arg));
        });
        ipcRenderer.on('close-page-attr-reply', () => {
            showPageAttr && dispatch(togglePageAttr());
        });
    }, []);
    const handleEmulatorClick = () => {
        ipcRenderer.send('toggle-emulator', !hideEmulator);
        dispatch(toggleEmulator());
    };
    const handleEditorClick = () => {
        ipcRenderer.send('toggle-editor', !hideEditor);
        dispatch(toggleEditor());
    };
    const handleDevtoolsClick = () => {
        ipcRenderer.send('toggle-devtools', !hideDevtools);
        dispatch(toggleDevtools());
    };
    const handleToggleRunProject = () => {
        ipcRenderer.send('run-project', !isRunProject);
        dispatch(toggleLoading());
        ipcRenderer.once('run-project-success', () => {
            dispatch(toggleLoading());
            dispatch(toggleRunProject());
            ipcRenderer.removeAllListeners('run-project-reply');
        });
        ipcRenderer.once('run-project-reply', (event, isSuccess) => {
            dispatch(toggleLoading());
            isSuccess && dispatch(toggleRunProject());
            ipcRenderer.removeAllListeners('run-project-success');
        });
    };
    const handleTerminalClick = () => {
        ipcRenderer.send('open-terminal');
    };
    const handleDndClick = () => {
        ipcRenderer.send('open-dnd');
    };
    const handleToggleEditorClick = () => {
        ipcRenderer.send('open-editor');
    };
    const handlePageAttr = () => {
        ipcRenderer.send('toggle-page-attr', !showPageAttr);
        dispatch(togglePageAttr());
    };
    return (
        <Row className='toolbar-container'>
            <Col span={12}>
                {isDnd ? (
                    <Fragment>
                        <Button
                            className='toolbar-btn'
                            icon='file'
                            onClick={handlePageAttr}
                        >
                            页面属性
                        </Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Button
                            className='toolbar-btn'
                            icon='mobile'
                            type={hideEmulator ? '' : 'primary'}
                            onClick={handleEmulatorClick}
                        >
                            模拟器
                        </Button>
                        <Button
                            className='toolbar-btn'
                            icon='edit'
                            type={hideEditor ? '' : 'primary'}
                            onClick={handleEditorClick}
                        >
                            编辑器
                        </Button>
                        <Button
                            className='toolbar-btn'
                            icon='bug'
                            type={hideDevtools ? '' : 'primary'}
                            onClick={handleDevtoolsClick}
                        >
                            调试器
                        </Button>
                    </Fragment>
                )}
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
                {isRunProject ? (
                    <Button
                        className='toolbar-btn'
                        icon='stop'
                        onClick={handleToggleRunProject}
                    >
                        停止
                    </Button>
                ) : (
                    <Button
                        className='toolbar-btn'
                        icon='play-circle'
                        loading={showLoading}
                        onClick={handleToggleRunProject}
                    >
                        启动
                    </Button>
                )}
                <Button
                    className='toolbar-btn'
                    icon='code'
                    onClick={handleTerminalClick}
                >
                    终端
                </Button>
                {isDnd ? (
                    <Button
                        className='toolbar-btn'
                        icon='edit'
                        onClick={handleToggleEditorClick}
                    >
                        代码
                    </Button>
                ) : (
                    <Button
                        className='toolbar-btn'
                        icon='eye'
                        onClick={handleDndClick}
                    >
                        可视化
                    </Button>
                )}
            </Col>
        </Row>
    );
};
