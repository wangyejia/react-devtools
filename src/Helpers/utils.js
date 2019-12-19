export const getRandomId = () =>
    Math.random()
        .toString(36)
        .slice(-8)
        .toUpperCase();

const getLastNode = (typeArr, idx, element) => {
    if (idx === typeArr.length - 1) {
        return element[typeArr[idx]];
    }
    return getLastNode(typeArr, idx + 1, element[typeArr[idx]]);
};

export const getNodeByType = type => {
    const typeArr = type.split('.');
    if (type === 'div' || type === 'span') {
        return type;
    }
    return getLastNode(typeArr, 0, window.antd);
};
