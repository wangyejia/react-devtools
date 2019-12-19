import { SET_EDITOR_CATALOG } from 'Constants';

export default (state = {}, action) => {
    switch (action.type) {
        case SET_EDITOR_CATALOG:
            return { ...state, catalog: action.catalog };
        default:
            return state;
    }
};
