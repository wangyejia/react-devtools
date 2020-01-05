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

export const setEditorCatalog = catalog => {
    return {
        type: SET_EDITOR_CATALOG,
        catalog
    };
};

export const resetEditorCatalog = (oldKey, newKey) => {
    return {
        type: RESET_EDITOR_CATALOG,
        oldKey,
        newKey
    };
};

export const addEditorCatalogFile = (dirKey, fileKey, isLeaf) => {
    return {
        type: ADD_EDITOR_CATALOG_FILE,
        dirKey,
        fileKey,
        isLeaf
    };
};

export const deleteEditorCatalog = key => {
    return {
        type: DELETE_EDITOR_CATALOG,
        key
    };
};

export const addEditorContent = content => {
    return {
        type: ADD_EDITOR_CONTENT,
        content
    };
};

export const setEditorContent = (key, content) => {
    return {
        type: SET_EDITOR_CONETNT,
        key,
        content
    };
};

export const resetEditorContent = (oldKey, newKey) => {
    return {
        type: RESET_EDITOR_CONTENT,
        oldKey,
        newKey
    };
};

export const deleteEditorContent = key => {
    return {
        type: DELETE_EDITOR_CONTENT,
        key
    };
};

export const setActiveContent = key => {
    return {
        type: SET_ACTIVE_CONTENT,
        key
    };
};
