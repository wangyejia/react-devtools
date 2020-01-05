import {
    TOGGLE_EMULATOR,
    TOGGLE_EDITOR,
    TOGGLE_DEVTOOLS,
    RUN_PROJECT,
    TOGGLE_LOADING,
    TOGGLE_EMULATOR_DEVICE,
    SET_DEVICE_TYPE,
    SET_DEVICE_SIZE,
    TOGGLE_TOOLBAR
} from 'Constants';

export default (state = {}, action) => {
    switch (action.type) {
        case TOGGLE_EMULATOR:
            return { ...state, hideEmulator: !state.hideEmulator };
        case TOGGLE_EDITOR:
            return { ...state, hideEditor: !state.hideEditor };
        case TOGGLE_DEVTOOLS:
            return { ...state, hideDevtools: !state.hideDevtools };
        case RUN_PROJECT:
            return { ...state, isRunProject: !state.isRunProject };
        case TOGGLE_LOADING:
            return { ...state, showLoading: !state.showLoading };
        case TOGGLE_EMULATOR_DEVICE:
            return { ...state, isMobile: !state.isMobile };
        case SET_DEVICE_TYPE:
            return { ...state, deviceType: action.deviceType };
        case SET_DEVICE_SIZE:
            return { ...state, deviceSize: action.deviceSize };
        case TOGGLE_TOOLBAR:
            return { ...state, isDnd: action.isDnd };
        default:
            return state;
    }
};
