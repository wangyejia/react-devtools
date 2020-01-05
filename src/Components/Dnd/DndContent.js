import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndItem, DndItemAttr } from 'Components';
import { initAst, initDndAst } from 'Actions';
const { ipcRenderer } = window.require('electron');

export const DndContent = () => {
    const dispatch = useDispatch();
    const ast = useSelector(state => state.ast.astState) || {};
    useEffect(() => {
        ipcRenderer.on('set-ast', (event, sourceAst) => {
            dispatch(initAst(ast.attrs.id, sourceAst));
        });
        ipcRenderer.on('init-dnd', () => {
            dispatch(initDndAst());
        });
    }, []);
    useEffect(() => {
        ipcRenderer.send('send-active-ast', ast);
    }, [ast]);
    return (
        <div style={{ background: '#fff', height: '100%' }}>
            <DndItem ast={ast} />
            <DndItemAttr />
        </div>
    );
};
