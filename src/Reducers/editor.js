import {
    SET_EDITOR_CATALOG,
    RESET_EDITOR_CATALOG,
    ADD_EDITOR_CATALOG_FILE,
    DELETE_EDITOR_CATALOG,
    ADD_EDITOR_CONTENT,
    SET_EDITOR_CONETNT,
    RESET_EDITOR_CONTENT,
    DELETE_EDITOR_CONTENT,
    SET_ACTIVE_CONTENT
} from 'Constants';
import { findCatalogItem } from 'Helpers';
import { cloneDeep } from 'lodash';

export default (state = {}, action) => {
    const { contents = [], catalog = [] } = cloneDeep(state);
    switch (action.type) {
        case SET_EDITOR_CATALOG:
            return { ...state, catalog: cloneDeep(action.catalog) };
        case RESET_EDITOR_CATALOG:
            const { oldKey, newKey } = action;
            const targetCatalogItem = findCatalogItem(catalog, oldKey);
            targetCatalogItem.key = newKey;
            targetCatalogItem.title = newKey.split('/').slice(-1)[0];
            return { ...state, catalog };
        case ADD_EDITOR_CATALOG_FILE:
            const { dirKey, fileKey, isLeaf } = action;
            const targetCatalogItem4AddFile = findCatalogItem(catalog, dirKey);
            targetCatalogItem4AddFile.children.unshift(
                isLeaf
                    ? {
                          title: 'Untitle',
                          key: fileKey,
                          isLeaf: true
                      }
                    : {
                          title: 'Untitle',
                          key: fileKey
                      }
            );
            return { ...state, catalog };
        case DELETE_EDITOR_CATALOG:
            const { key: key4Delete } = action;
            const keyParent4Delete = key4Delete
                .split('/')
                .slice(0, -1)
                .join('/');
            const targetCatalogParent4Delete = findCatalogItem(
                catalog,
                keyParent4Delete
            );
            targetCatalogParent4Delete.children = targetCatalogParent4Delete.children.filter(
                item => {
                    return item.key !== key4Delete;
                }
            );
            return { ...state, catalog };
        case ADD_EDITOR_CONTENT:
            const { content } = cloneDeep(action);
            contents.push(content);
            return { ...state, contents, activeContent: content.key };
        case SET_EDITOR_CONETNT:
            const { key: key4Set, content: content4Set } = cloneDeep(action);
            contents.forEach(item => {
                if (item.key === key4Set) {
                    item.data = content4Set;
                }
            });
            return { ...state, contents };
        case RESET_EDITOR_CONTENT:
            const { oldKey: oldKey4Content, newKey: newKey4Content } = action;
            contents.forEach(item => {
                if (item.key === oldKey4Content) {
                    item.key = newKey4Content;
                    item.tab = newKey4Content.split('/').slice(-1)[0];
                }
            });
            const newActiveContent4Content =
                state.activeContent === oldKey4Content
                    ? newKey4Content
                    : state.activeContent;
            return {
                ...state,
                contents,
                activeContent: newActiveContent4Content
            };
        case DELETE_EDITOR_CONTENT:
            let deleteIdx = 0;
            const deleteKey = action.key;
            const activeKey = state.activeContent;
            const newContents = contents.filter((item, index) => {
                if (item.key === deleteKey) {
                    deleteIdx = index;
                    return false;
                }
                return true;
            });
            const newActiveContent = !newContents.length
                ? ''
                : deleteIdx === contents.length - 1
                ? newContents[deleteIdx - 1].key
                : deleteKey === activeKey
                ? newContents[deleteIdx].key
                : activeKey;
            return {
                ...state,
                contents: newContents,
                activeContent: newActiveContent
            };
        case SET_ACTIVE_CONTENT:
            return { ...state, activeContent: action.key };
        default:
            return state;
    }
};
