import React, { createElement, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import './index.less';
import {
    dndTypesArr,
    displayTypes,
    directionTypes,
    dropTypes
} from 'Constants';
import { getNodeByType } from 'Helpers';
import {
    resetAst,
    deleteAst,
    setAstAttrs,
    setHoverId,
    setDoubleClickAst,
    setDragStat,
    setResizeStat
} from 'Actions';
import { cloneDeep } from 'lodash';

const createReactElement = ({ id, ast, width, height }) => {
    const { type, content, name, attrs, children } = ast;
    const style4Attr = cloneDeep(attrs.attrs || {});
    const style4Resize =
        width && height ? { width: `${width}px`, height: `${height}px` } : {};
    if (type === 'text') {
        return content;
    }
    return createElement(
        getNodeByType(name),
        {
            ...attrs,
            style: { ...style4Attr, ...style4Resize }
        },
        children.map(item => {
            return <DndItem id={id} key={item.attrs.id} ast={item}></DndItem>;
        })
    );
};

const getResetDirection = (smBound, lgBound, point, offset) => {
    if (point - smBound < offset) {
        return directionTypes.BEFORE;
    }
    if (lgBound - point < offset) {
        return directionTypes.AFTER;
    }
    return directionTypes.MIDDLE;
};

const DndItemImpl = props => {
    return createReactElement(props);
};

export const DndItem = ({ ast }) => {
    const ref = useRef(null);
    const dispatch = useDispatch();
    const hoverId = useSelector(state => state.dnd.hoverId);
    const isResizing = useSelector(state => state.dnd.isResizing);
    const doubleClickAst = useSelector(state => state.ast.doubleClickAst) || {};
    const { attrs: doubleClickAttrs = {} } = doubleClickAst;
    const { style: doubleClickStyle = {} } = doubleClickAttrs;
    const { type, name, attrs, displayType } = ast;
    const { id, className, style } = attrs;
    const { width, height } = style || {};
    const isContainer = className === 'dnd-container';
    const isText = type === 'text';
    let timer = null;
    const handleMouseEvent = (e, id) => {
        e.stopPropagation();
        dispatch(setHoverId(id));
    };
    const handleDoubleClick = e => {
        e.stopPropagation();
        dispatch(setDoubleClickAst(id));
    };
    const [{ isOverCurrent }, drop] = useDrop({
        accept: dndTypesArr,
        drop: (item, monitor) => {
            if (monitor.isOver({ shallow: true })) {
                return { id, type: dropTypes.ADD };
            }
        },
        hover: (item, monitor) => {
            const { reset, id: dragId, displayType: dragDisplayType } = item;
            if (
                displayType === displayTypes.INLINE ||
                !isOverCurrent ||
                !reset ||
                dragId === id ||
                timer
            ) {
                return;
            }
            const {
                top: hoverTop,
                bottom: hoverBottom,
                left: hoverLeft,
                right: hoverRight
            } = ref.current.getBoundingClientRect();
            const { x: hoverX, y: hoverY } = monitor.getClientOffset();
            const horizontalOffset = (hoverRight - hoverLeft) / 5;
            const verticalOffset = (hoverBottom - hoverTop) / 5;
            const resetDirection =
                displayType === displayTypes.INLINE
                    ? getResetDirection(
                          hoverLeft,
                          hoverRight,
                          hoverX,
                          horizontalOffset
                      )
                    : getResetDirection(
                          hoverTop,
                          hoverBottom,
                          hoverY,
                          verticalOffset
                      );
            timer = setTimeout(() => {
                dispatch(resetAst(dragId, id, resetDirection, dragDisplayType));
                timer = null;
            }, 500);
        },
        canDrop: () => {
            if (!isOverCurrent) {
                return false;
            }
            return displayType !== displayTypes.INLINE;
        },
        collect: monitor => ({
            isOverCurrent: monitor.isOver({ shallow: true })
        })
    });
    const [, drag] = useDrag({
        item: { type: name || '', id, displayType, reset: true },
        begin: () => {
            dispatch(setHoverId(''));
            dispatch(setDragStat(true));
        },
        end: (item, monitor) => {
            const { type: dropResultType } = monitor.getDropResult();
            timer = null;
            dispatch(setHoverId(''));
            dispatch(setDragStat(false));
            if (dropResultType === dropTypes.DELETE) {
                dispatch(deleteAst(id, displayType));
            }
        },
        canDrag: () => {
            return !isContainer && !isResizing;
        }
    });
    drag(drop(ref));
    useEffect(() => {
        const { clientWidth, clientHeight } = ref.current || {};
        if (!isText && (clientWidth || clientHeight)) {
            dispatch(
                setAstAttrs(id, {
                    style: { width: clientWidth, height: clientHeight }
                })
            );
        }
    }, []);
    useEffect(() => {
        if (ref.current && !isContainer) {
            const node = ref.current.children[0].children[0];
            const { clientWidth, clientHeight } = node;
            dispatch(
                setAstAttrs(id, {
                    style: {
                        width: width || clientWidth,
                        height: height || clientHeight
                    }
                })
            );
        }
    }, [width, height]);
    return isText ? (
        <DndItemImpl id={id} ast={ast} />
    ) : (
        <span
            className={`dnd-wrapper ${
                !isContainer && hoverId === id ? 'dnd-wrapper-hover' : ''
            } dnd-${displayType}-wrapper ${isOverCurrent ? 'dnd-hover' : ''}`}
            ref={ref}
            style={{ width: `${width}px`, height: `${height}px` }}
            onMouseOver={e => {
                handleMouseEvent(e, id);
            }}
            onMouseLeave={e => {
                handleMouseEvent(e, '');
            }}
            onDoubleClick={e => {
                handleDoubleClick(e);
            }}
        >
            <ResizableBox
                width={width}
                height={height}
                onResizeStart={() => {
                    dispatch(setResizeStat(true));
                }}
                onResizeStop={() => {
                    dispatch(setResizeStat(false));
                }}
                onResize={(e, data) => {
                    const {
                        width: width4Resize,
                        height: height4Resize
                    } = data.size;
                    dispatch(
                        setAstAttrs(id, {
                            style: {
                                width: width4Resize,
                                height: height4Resize
                            }
                        })
                    );
                }}
            >
                <DndItemImpl id={id} ast={ast} width={width} height={height} />
            </ResizableBox>
        </span>
    );
};
