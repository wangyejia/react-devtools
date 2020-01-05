import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { EditorToolBar, EmulatorToolBar } from 'Components';
import './index.less';

export const ToolBar = () => {
    return (
        <span>
            <Route
                path='/toolbar'
                exact
                render={() => <Redirect to='/toolbar/editor' />}
            />
            <Route path='/toolbar/editor' component={EditorToolBar} />
            <Route path='/toolbar/emulator' component={EmulatorToolBar} />
        </span>
    );
};
