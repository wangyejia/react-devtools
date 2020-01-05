import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tree } from 'antd';
import {
    setEditorCatalog,
    resetEditorCatalog,
    addEditorCatalogFile,
    deleteEditorCatalog,
    setActiveContent,
    resetEditorContent,
    deleteEditorContent
} from 'Actions';
const { ipcRenderer } = window.require('electron');

const { TreeNode, DirectoryTree } = Tree;
export const EditorCatalog = () => {
    const dispatch = useDispatch();
    const catalog = useSelector(state => state.editor.catalog) || [];
    const editorContents = useSelector(state => state.editor.contents) || [];
    useEffect(() => {
        ipcRenderer.send('get-catalog');
        ipcRenderer.once('get-catalog-reply', (event, data) => {
            dispatch(setEditorCatalog(data));
        });
    }, []);
    const handleLoadData = treeNode =>
        new Promise(resolve => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            ipcRenderer.send('get-catalog', treeNode.props.eventKey);
            ipcRenderer.once('get-catalog-reply', (event, data) => {
                treeNode.props.dataRef.children = data;
                dispatch(setEditorCatalog(catalog));
                resolve();
            });
        });
    const renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode
                        title={item.title}
                        key={`catalog-${item.key}`}
                        dataRef={item}
                    >
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={`catalog-${item.key}`}
                    {...item}
                    dataRef={item}
                />
            );
        });
    const handleSelete = (key, e) => {
        key = key[0];
        const isOpen = editorContents.filter(item => item.key === key).length;
        if (isOpen) {
            dispatch(setActiveContent(key));
        } else if (e.node.props.dataRef.isLeaf) {
            ipcRenderer.send('open-file', key);
        }
    };
    const handleRename = (target, key, fromAdd, isLeaf) => {
        target.contentEditable = 'true';
        target.focus();
        let textContent = target.textContent;
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        const removeContentEditable = () => {
            target.contentEditable = 'false';
            selection = null;
            range = null;
        };
        target.addEventListener('keydown', e => {
            if (e.code === 'Enter') {
                e.preventDefault();
                textContent = target.textContent;
                removeContentEditable();
                let newKey = key.split('/');
                newKey.splice(-1, 1, textContent);
                newKey = newKey.join('/');
                ipcRenderer.send('rename-file', [key, newKey]);
                ipcRenderer.once('rename-file-reply', () => {
                    dispatch(resetEditorCatalog(key, newKey));
                    dispatch(resetEditorContent(key, newKey));
                });
            }
        });
        target.addEventListener('blur', () => {
            setTimeout(() => {
                if (fromAdd && target.textContent === 'Untitle') {
                    removeContentEditable();
                    handleDelete(key, isLeaf);
                } else {
                    target.textContent = textContent;
                    removeContentEditable();
                }
            }, 100);
        });
    };
    const handleAddFile = (key, isLeaf) => {
        const fileKey = key + '/Untitle';
        ipcRenderer.send('add-file', [fileKey, isLeaf]);
        ipcRenderer.once('add-file-reply', () => {
            dispatch(addEditorCatalogFile(key, fileKey, isLeaf));
            const fileTarget = document.querySelector('span[title="Untitle"]')
                .children[1];
            handleRename(fileTarget, fileKey, true, isLeaf);
        });
    };
    const handleDelete = (key, isLeaf) => {
        ipcRenderer.send('delete-file', [key, isLeaf]);
        ipcRenderer.once('delete-file-reply', () => {
            dispatch(deleteEditorCatalog(key));
            dispatch(deleteEditorContent(key));
        });
    };
    const handleRightClick = ({ event, node }) => {
        const target = event.currentTarget.children[1];
        const { key, isLeaf } = node.props.dataRef;
        ipcRenderer.send('open-right-click-menu', isLeaf);
        ipcRenderer.once('open-right-click-menu-reply', (event, value) => {
            switch (value) {
                case 'addFile':
                    handleAddFile(key, true);
                    break;
                case 'addFolder':
                    handleAddFile(key, false);
                    break;
                case 'rename':
                    handleRename(target, key);
                    break;
                case 'delete':
                    handleDelete(key, isLeaf);
                    break;
                default:
                    break;
            }
        });
    };
    return (
        <DirectoryTree
            loadData={handleLoadData}
            onSelect={handleSelete}
            onRightClick={handleRightClick}
        >
            {renderTreeNodes(catalog)}
        </DirectoryTree>
    );
};
