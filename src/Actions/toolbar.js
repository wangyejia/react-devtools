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

export const toggleEmulator = () => {
    return {
        type: TOGGLE_EMULATOR
    };
};

export const toggleEditor = () => {
    return {
        type: TOGGLE_EDITOR
    };
};

export const toggleDevtools = () => {
    return {
        type: TOGGLE_DEVTOOLS
    };
};

export const toggleRunProject = () => {
    return {
        type: RUN_PROJECT
    };
};

export const toggleLoading = () => {
    return {
        type: TOGGLE_LOADING
    };
};

export const toggleEmulatorDevice = () => {
    return {
        type: TOGGLE_EMULATOR_DEVICE
    };
};

export const setDeviceType = deviceType => {
    return {
        type: SET_DEVICE_TYPE,
        deviceType
    };
};

export const setDeviceSize = deviceSize => {
    return {
        type: SET_DEVICE_SIZE,
        deviceSize
    };
};

export const toggleToolBar = isDnd => {
    return {
        type: TOGGLE_TOOLBAR,
        isDnd
    };
};
