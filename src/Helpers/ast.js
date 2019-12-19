import { displayTypes } from 'Constants';
import { getRandomId } from 'Helpers';

export const findAst = (ast, target) => {
    const { attrs, children } = ast;
    if (attrs.id === target) {
        return ast;
    }
    for (const child of children) {
        if (child.type === 'text') {
            continue;
        }
        const result = findAst(child, target);
        if (result) {
            return result;
        }
    }
};

export const findFatherAst = (ast, target) => {
    const { children } = ast;
    for (const child of children) {
        if (child.attrs.id === target) {
            return ast;
        }
    }
    for (const child of children) {
        if (child.type === 'text') {
            continue;
        }
        const result = findFatherAst(child, target);
        if (result) {
            return result;
        }
    }
};

export const createAst = (
    name = 'div',
    displayType = 'container',
    children = [],
    className = '',
    type = 'tag'
) => ({
    type,
    name,
    displayType,
    attrs: {
        className,
        id: getRandomId()
    },
    voidElement: false,
    children
});

const shouldCreateInlineBlock = (targetAst, sourceAst) => {
    return (
        targetAst.displayType === displayTypes.CONTAINER &&
        sourceAst.displayType === displayTypes.INLINE
    );
};

export const appendAst = (targetAst, sourceAst) => {
    const tmpAst = shouldCreateInlineBlock(targetAst, sourceAst)
        ? createAst('div', displayTypes.INLINE_BLOCK, [sourceAst])
        : sourceAst;
    targetAst.children.push(tmpAst);
};

export const insertAst = (targetAst, sourceAst, idx) => {
    targetAst.children.splice(
        idx,
        0,
        shouldCreateInlineBlock(targetAst, sourceAst)
            ? createAst('div', displayTypes.INLINE_BLOCK, [sourceAst])
            : sourceAst
    );
};

export const deleteAst = (sourceAst, idx) => {
    sourceAst.children.splice(idx, 1);
};
