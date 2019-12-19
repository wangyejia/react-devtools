import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndItem, DndItemAttr } from 'Components';

export const DndContent = () => {
    const ast = useSelector(state => state.ast.astState) || {};
    return (
        <div style={{ background: '#fff', height: '100%' }}>
            <DndItem ast={ast} />
            <DndItemAttr />
        </div>
    );
};
