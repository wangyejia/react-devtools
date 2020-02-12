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
    SET_PAGE_ATTR,
    ADD_PAGE_ATTR,
    DELETE_PAGE_ATTR,
    SET_FUNC_ATTR,
    SET_FUNC_VOIDELEMENT,
    displayTypes,
    directionTypes
} from 'Constants';
import {
    getRandomId,
    findAst,
    findFatherAst,
    createAst,
    createFuncAst,
    appendAst,
    insertAst,
    deleteAst
} from 'Helpers';
import { cloneDeep } from 'lodash';

const getResetIdx = (idx, direction) => {
    return direction === directionTypes.BEFORE ? idx : idx + 1;
};

const shouldReset4Inline = (
    sourceIdx,
    targetIdx,
    direction,
    sourceFatherAstChildren,
    isGrandFather
) => {
    switch (direction) {
        case directionTypes.BEFORE:
            return (
                sourceIdx !== targetIdx - 1 ||
                isGrandFather ||
                sourceFatherAstChildren.length > 1
            );
        case directionTypes.AFTER:
            return (
                sourceIdx !== targetIdx + 1 ||
                isGrandFather ||
                sourceFatherAstChildren.length > 1
            );
        default:
            return true;
    }
};

const shouldReset4Other = (sourceIdx, targetIdx, direction, isFather) => {
    switch (direction) {
        case directionTypes.BEFORE:
            return sourceIdx !== targetIdx - 1 || isFather;
        case directionTypes.AFTER:
            return sourceIdx !== targetIdx + 1 || isFather;
        default:
            return true;
    }
};

export default (
    state = { astState: createAst('div', 'container', [], 'dnd-container') },
    action
) => {
    const { displayType, target, source, direction } = action;
    const astState = cloneDeep(state.astState);
    switch (action.type) {
        case INIT_DND_AST:
            astState.children = [];
            return { ...state, astState };
        case INIT_AST:
            const { sourceAst: sourceAst4Init } = action;
            const targetAst4Init = findAst(astState, target);
            appendAst(targetAst4Init, cloneDeep(sourceAst4Init));
            return { ...state, astState };
        case GET_AST:
            return {
                ...state,
                ast: target ? findAst(astState, target) : astState
            };
        case SET_DOUBLE_CLICK_AST:
            const { doubleClickId } = action;
            const doubleClickAst = doubleClickId
                ? findAst(astState, doubleClickId)
                : null;
            return { ...state, doubleClickAst };
        case SET_AST:
            const { dndType } = action;
            const targetAst4Set = findAst(astState, target);
            const sourceAst4Set =
                dndType === 'func'
                    ? createFuncAst(dndType, displayType)
                    : createAst(dndType, displayType);
            appendAst(targetAst4Set, sourceAst4Set);
            return { ...state, dragId: sourceAst4Set.attrs.id, astState };
        case RESET_AST:
            // dragSource
            const sourceAst4Reset = findAst(astState, source);
            const sourceFatherAst4Reset = findFatherAst(astState, source);
            const sourceGrandFatherAst4Reset = findFatherAst(
                astState,
                sourceFatherAst4Reset.attrs.id
            );
            // dropTarget
            const targetAst4Reset = findAst(astState, target) || astState;
            const targetFatherAst4Reset =
                findFatherAst(astState, target) || astState;
            const {
                children: sourceFatherAstChildren4Reset
            } = sourceFatherAst4Reset;
            const {
                children: targetFatherAstChildren4Reset
            } = targetFatherAst4Reset;
            // idx
            const sourceIdx4Reset = sourceFatherAstChildren4Reset.indexOf(
                sourceAst4Reset
            );
            const targetIdx4Reset = targetFatherAstChildren4Reset.indexOf(
                targetAst4Reset
            );
            // 若dropTarget为自身father，则直接返回
            if (
                (sourceFatherAst4Reset === targetAst4Reset &&
                    (displayType === displayTypes.INLINE ||
                        direction === directionTypes.MIDDLE)) ||
                (displayType === displayTypes.INLINE &&
                    (direction === directionTypes.MIDDLE ||
                        targetAst4Reset.attrs.className === 'dnd-container') &&
                    sourceGrandFatherAst4Reset === targetAst4Reset)
            ) {
                return { ...state, astState };
            }
            if (displayType === displayTypes.INLINE) {
                const sourceFatherIdx4Reset = sourceGrandFatherAst4Reset.children.indexOf(
                    sourceFatherAst4Reset
                );
                if (
                    shouldReset4Inline(
                        sourceFatherIdx4Reset,
                        targetIdx4Reset,
                        direction,
                        sourceFatherAstChildren4Reset,
                        sourceGrandFatherAst4Reset === targetAst4Reset
                    )
                ) {
                    // 添加新AST
                    if (direction === directionTypes.MIDDLE) {
                        appendAst(targetAst4Reset, sourceAst4Reset);
                    } else {
                        insertAst(
                            targetFatherAst4Reset,
                            sourceAst4Reset,
                            getResetIdx(targetIdx4Reset, direction)
                        );
                    }
                    // 删除原有AST
                    if (sourceFatherAstChildren4Reset.length === 1) {
                        deleteAst(
                            sourceGrandFatherAst4Reset,
                            sourceFatherIdx4Reset
                        );
                    } else {
                        deleteAst(sourceFatherAst4Reset, sourceIdx4Reset);
                    }
                }
            } else {
                if (
                    shouldReset4Other(
                        sourceIdx4Reset,
                        targetIdx4Reset,
                        direction,
                        sourceFatherAst4Reset === targetAst4Reset
                    )
                ) {
                    if (direction === directionTypes.MIDDLE) {
                        appendAst(targetAst4Reset, sourceAst4Reset);
                    } else {
                        insertAst(
                            targetFatherAst4Reset,
                            sourceAst4Reset,
                            getResetIdx(targetIdx4Reset, direction)
                        );
                    }
                    deleteAst(sourceFatherAst4Reset, sourceIdx4Reset);
                }
            }
            return { ...state, astState };
        case DELETE_AST:
            const sourceAst4Delete = findAst(astState, source);
            const sourceFatherAst4Delete = findFatherAst(astState, source);
            const {
                attrs: sourceFatherAstAttrs4Delete,
                children: sourceFatherAstChildren4Delete
            } = sourceFatherAst4Delete;
            if (
                displayType === displayTypes.INLINE &&
                sourceFatherAstChildren4Delete.length === 1
            ) {
                const sourceGrandFatherAst4Delete = findFatherAst(
                    astState,
                    sourceFatherAstAttrs4Delete.id
                );
                const sourceFatherIdx4Delete = sourceGrandFatherAst4Delete.children.indexOf(
                    sourceFatherAst4Delete
                );
                deleteAst(sourceGrandFatherAst4Delete, sourceFatherIdx4Delete);
            } else {
                const sourceIdx4Delete = sourceFatherAstChildren4Delete.indexOf(
                    sourceAst4Delete
                );
                deleteAst(sourceFatherAst4Delete, sourceIdx4Delete);
            }
            return { ...state, astState };
        case SET_AST_ATTRS:
            const { attrs: sourceAttrs, target: target4Attrs } = action;
            const targetAst4Attrs = findAst(astState, target4Attrs);
            const { text: sourceText } = sourceAttrs;
            const {
                attrs: targetAttrs4Attrs,
                children: targetChildren4Attrs
            } = targetAst4Attrs;
            const { style: targetAttrsStyle4Attrs = {} } = targetAttrs4Attrs;
            // 添加文本子元素
            if (sourceText) {
                targetChildren4Attrs.length
                    ? (targetChildren4Attrs[0].content = sourceText.trim())
                    : targetChildren4Attrs.push({
                          type: 'text',
                          content: sourceText.trim(),
                          attrs: {
                              id: getRandomId()
                          }
                      });
            }

            // 将属性合并
            Object.assign(targetAttrs4Attrs, sourceAttrs);
            return { ...state, astState };
        case DELETE_AST_ATTRS:
            const {
                attrs: sourceAttrs4DeleteAttrs,
                target: target4DeleteAttrs,
                deleteWidthAndHeight
            } = action;
            const targetAst4DeleteAttrs = findAst(astState, target4DeleteAttrs);
            const {
                attrs: targetAttrs4DeleteAttrs,
                children: targetChildren4DeleteAttrs
            } = targetAst4DeleteAttrs;
            const {
                style: targetAttrStyle4DeleteAttrs = {}
            } = targetAttrs4DeleteAttrs;
            // 删除宽高
            if (deleteWidthAndHeight) {
                delete targetAttrStyle4DeleteAttrs.width;
                delete targetAttrStyle4DeleteAttrs.height;
            }
            // 删除属性
            console.log(targetAttrs4DeleteAttrs);
            Object.keys(targetAttrs4DeleteAttrs)
                .filter(item => {
                    return (
                        item !== 'className' &&
                        item !== 'id' &&
                        item !== 'style' &&
                        !sourceAttrs4DeleteAttrs[item]
                    );
                })
                .forEach(item => {
                    // 删除文本子元素
                    if (item === 'text') {
                        targetChildren4DeleteAttrs.pop();
                    }
                    delete targetAttrs4DeleteAttrs[item];
                });
            return { ...state, astState };
        case SET_AST_ATTR_STYLE:
            const { target: target4Style, style: style4Style } = cloneDeep(
                action
            );
            const targetAst4Style = findAst(astState, target4Style);
            const { attrs: targetAstAttrs4Style } = targetAst4Style;
            const { style: targetAstAttrStyle4Style } = targetAstAttrs4Style;
            Object.assign(targetAstAttrStyle4Style, style4Style);
            return { ...state, astState };
        case SET_AST_ATTR_NAMES:
            const attrNames = cloneDeep(action.attrNames);
            return { ...state, attrNames };
        case SET_PAGE_ATTR:
            const {
                value4PageAttr,
                type4PageAttr,
                keyOrVal4PageAttr,
                index4PageAttr
            } = action;
            const target4PageAttr = astState.children[0][type4PageAttr];
            target4PageAttr[index4PageAttr][keyOrVal4PageAttr] = value4PageAttr;
            return { ...state, astState };
        case ADD_PAGE_ATTR:
            const { type4AddPageAttr } = action;
            const target4AddPageAttr = astState.children[0][type4AddPageAttr];
            target4AddPageAttr.push({ '': '' });
            return { ...state, astState };
        case DELETE_PAGE_ATTR:
            const { type4DeletePageAttr, index4DeletePageAttr } = action;
            const target4DeletePageAttr =
                astState.children[0][type4DeletePageAttr];
            target4DeletePageAttr.splice(index4DeletePageAttr, 1);
            return { ...state, astState };
        case SET_FUNC_ATTR:
            const {
                attrObj: attrObj4FuncAttr,
                target: targetId4FuncAttr
            } = action;
            const {
                target: target4FuncAttr,
                name: name4FuncAttr,
                params: params4FuncAttr
            } = attrObj4FuncAttr;
            const targetAst4FuncAttr = findAst(astState, targetId4FuncAttr);
            targetAst4FuncAttr.target = target4FuncAttr;
            targetAst4FuncAttr.name = name4FuncAttr;
            targetAst4FuncAttr.params = [...params4FuncAttr.split('|')];
            return { ...state, astState };
        case SET_FUNC_VOIDELEMENT:
            const { target: target4FuncVoidElement, voidElement } = action;
            const targetAst4FuncVoidElement = findAst(
                astState,
                target4FuncVoidElement
            );
            targetAst4FuncVoidElement.voidElement = voidElement;
            return {
                ...state,
                astState,
                doubleClickAst: targetAst4FuncVoidElement
            };
        default:
            return state;
    }
};
