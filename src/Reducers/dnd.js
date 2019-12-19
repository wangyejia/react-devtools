import { SET_HOVER_ID, SET_DRAG_STAT, SET_RESIZE_STAT } from 'Constants';

export default (state = {}, action) => {
    switch (action.type) {
        case SET_HOVER_ID:
            return { ...state, hoverId: action.hoverId };
        case SET_DRAG_STAT:
            return { ...state, isDrag: action.isDrag };
        case SET_RESIZE_STAT:
            return { ...state, isResizing: action.isResizing };
        default:
            return state;
    }
};
