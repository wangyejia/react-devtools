import { combineReducers } from 'redux';
import home from './home';
import editor from './editor';
import ast from './ast';
import dnd from './dnd';

export default combineReducers({
    home,
    editor,
    ast,
    dnd
});
