import { SET_REACT_PROJECT, TOGGLE_SPIN } from 'Constants';

export const setReactProject = reactProject => {
    return {
        type: SET_REACT_PROJECT,
        reactProject
    };
};

export const toggleSpin = () => {
    return {
        type: TOGGLE_SPIN
    };
};
