import {
    INIT_DND_AST,
    INIT_AST,
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
    SET_RESIZE_STAT,
    SET_PAGE_ATTR,
    ADD_PAGE_ATTR,
    DELETE_PAGE_ATTR,
    SET_FUNC_ATTR,
    SET_FUNC_VOIDELEMENT
} from 'Constants';

export const initDndAst = () => {
    return {
        type: INIT_DND_AST
    };
};

export const initAst = (target, sourceAst) => {
    return {
        type: INIT_AST,
        target,
        sourceAst
    };
};
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

export const setPageAttr = (
    value4PageAttr,
    type4PageAttr,
    keyOrVal4PageAttr,
    index4PageAttr
) => {
    return {
        type: SET_PAGE_ATTR,
        value4PageAttr,
        type4PageAttr,
        keyOrVal4PageAttr,
        index4PageAttr
    };
};

export const addPageAttr = type4AddPageAttr => {
    return {
        type: ADD_PAGE_ATTR,
        type4AddPageAttr
    };
};

export const deletePageAttr = (type4DeletePageAttr, index4DeletePageAttr) => {
    return {
        type: DELETE_PAGE_ATTR,
        type4DeletePageAttr,
        index4DeletePageAttr
    };
};

export const setFuncAttr = (target, attrObj) => {
    return {
        type: SET_FUNC_ATTR,
        target,
        attrObj
    };
};

export const setFuncVoidElement = (target, voidElement) => {
    return {
        type: SET_FUNC_VOIDELEMENT,
        target,
        voidElement
    };
};
