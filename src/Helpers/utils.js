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
    if (type === 'div' || type === 'span' || type === 'ul' || type === 'li') {
        return type;
    }
    return getLastNode(typeArr, 0, window.antd);
};

export const getNodeByFunc = ast => {
    const { name, voidElement } = ast;
    if (voidElement) {
        return `{${name}}`;
    }
    return 'div';
};

export const findCatalogItem = (catalog, key) => {
    for (const item of catalog) {
        const { key: catalogKey, isLeaf, children } = item;
        if (catalogKey === key) {
            return item;
        }
        const prev = key
            .split('/')
            .slice(0, -1)
            .join('/');
        if (prev.includes(catalogKey) && !isLeaf) {
            const result = findCatalogItem(children, key);
            if (result) {
                return result;
            }
        }
    }
};
