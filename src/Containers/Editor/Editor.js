import React, { useRef } from 'react';
import { EditorCatalog, EditorContent } from 'Components';
import './index.less';

export const Editor = () => {
    const ref = useRef(null);
    let editorCatalogWidth = 350;
    let mouseDown = false;
    let mouseStart = 0;
    const handleMouseDown = ({ clientX }) => {
        mouseDown = true;
        mouseStart = clientX;
    };
    const handleMouseUp = ({ clientX }) => {
        mouseDown = false;
        editorCatalogWidth += clientX - mouseStart;
    };
    const handleMouseMove = ({ clientX }) => {
        if (!mouseDown) {
            return;
        }
        const offsetX = clientX - mouseStart;
        ref.current.style.width = editorCatalogWidth + offsetX + 'px';
    };
    return (
        <div
            className='editor-container'
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className='editor-catalog' ref={ref}>
                <EditorCatalog />
            </div>
            <div
                className='editor-resize-divider'
                onMouseDown={handleMouseDown}
            ></div>
            <div className='editor-content'>
                <EditorContent />
            </div>
        </div>
    );
};
