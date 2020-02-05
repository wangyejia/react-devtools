import React from 'react';
import { useDispatch } from 'react-redux';
import { useDrag } from 'react-dnd';
import { setAst } from 'Actions';

export const DndMenuItem = ({ title, type, displayType }) => {
    const dispatch = useDispatch();
    const [, drag] = useDrag({
        item: { type, displayType },
        end: (item, monitor) => {
            if (!monitor.didDrop()) {
                return;
            }
            dispatch(
                setAst(item.type, displayType, monitor.getDropResult().id)
            );
        }
    });
    return <span ref={drag}>{title}</span>;
};
