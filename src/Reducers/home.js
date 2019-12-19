import { SET_REACT_PROJECT, TOGGLE_SPIN } from 'Constants';

export default (state = {}, action) => {
    switch (action.type) {
        case SET_REACT_PROJECT:
            return { ...state, reactProject: action.reactProject.slice() };
        case TOGGLE_SPIN:
            return { ...state, spinning: !state.spinning };
        default:
            return state;
    }
};
