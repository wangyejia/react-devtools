import { combineReducers } from 'redux';
import home from './home';
import editor from './editor';
import ast from './ast';
import dnd from './dnd';
import toolbar from './toolbar';

export default combineReducers({
    home,
    editor,
    ast,
    dnd,
    toolbar
});
