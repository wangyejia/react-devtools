import {
    GET_AST,
    SET_AST,
    RESET_AST,
    DELETE_AST,
    SET_AST_ATTRS,
    DELETE_AST_ATTRS,
    SET_AST_ATTR_STYLE,
    SET_AST_ATTR_NAMES,
    SET_DOUBLE_CLICK_AST,
    SET_HOVER_ID,
    SET_DRAG_STAT,
    SET_RESIZE_STAT
} from 'Constants';

export const getAst = target => {
    return {
        type: GET_AST,
        target
    };
};

export const setAst = (dndType, displayType, target) => {
    return {
        type: SET_AST,
        dndType,
        displayType,
        target
    };
};

export const resetAst = (source, target, direction, displayType) => {
    return {
        type: RESET_AST,
        source,
        target,
        direction,
        displayType
    };
};

export const deleteAst = (source, displayType) => {
    return {
        type: DELETE_AST,
        source,
        displayType
    };
};

export const setAstAttrs = (target, attrs) => {
    return {
        type: SET_AST_ATTRS,
        target,
        attrs
    };
};

export const deleteAstAttrs = (target, attrs, deleteWidthAndHeight = false) => {
    return {
        type: DELETE_AST_ATTRS,
        target,
        attrs,
        deleteWidthAndHeight
    };
};

export const setAstAttrNames = attrNames => {
    return {
        type: SET_AST_ATTR_NAMES,
        attrNames
    };
};

export const setAstAttrStyle = (target, style) => {
    return {
        type: SET_AST_ATTR_STYLE,
        target,
        style
    };
};

export const setDoubleClickAst = doubleClickId => {
    return {
        type: SET_DOUBLE_CLICK_AST,
        doubleClickId
    };
};

export const setHoverId = hoverId => {
    return {
        type: SET_HOVER_ID,
        hoverId
    };
};

export const setDragStat = isDrag => {
    return {
        type: SET_DRAG_STAT,
        isDrag
    };
};

export const setResizeStat = isResizing => {
    return {
        type: SET_RESIZE_STAT,
        isResizing
    };
};
