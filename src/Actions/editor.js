import { SET_EDITOR_CATALOG } from 'Constants';

export const setEditorCatalog = catalog => {
    return {
        type: SET_EDITOR_CATALOG,
        catalog
    };
};
