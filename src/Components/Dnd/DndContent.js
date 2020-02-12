import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndItem, DndItemAttr } from 'Components';
import { initAst, initDndAst, togglePageAttr } from 'Actions';
const { ipcRenderer } = window.require('electron');

export const DndContent = () => {
    const dispatch = useDispatch();
    const ast = useSelector(state => state.ast.astState) || {};
    const showPageAttr = useSelector(state => state.toolbar.showPageAttr);
    useEffect(() => {
        ipcRenderer.on('set-ast', (event, sourceAst) => {
            dispatch(initAst(ast.attrs.id, sourceAst));
        });
        ipcRenderer.on('init-dnd', () => {
            dispatch(initDndAst());
        });
        ipcRenderer.on('toggle-page-attr-reply', () => {
            dispatch(togglePageAttr());
        });
    }, []);
    useEffect(() => {
        ipcRenderer.send('send-active-ast', ast);
    }, [ast]);
    useEffect(() => {
        !showPageAttr && ipcRenderer.send('close-page-attr');
    }, [showPageAttr]);
    return (
        <div style={{ background: '#fff', height: '100%' }}>
            <DndItem ast={ast} />
            <DndItemAttr
                showPageAttr={showPageAttr}
                ast={ast.children.length ? ast.children[0] : {}}
            />
        </div>
    );
};
