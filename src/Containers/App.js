import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Home, Editor, DndEditor, ToolBar } from 'Containers';
import { XTerm } from 'Components';
import './index.less';

export const App = () => {
    return (
        <Router>
            <Route path='/' exact render={() => <Redirect to='/home' />} />
            <Route path='/home' component={Home}></Route>
            <Route path='/editor' component={Editor}></Route>
            <Route path='/dnd' component={DndEditor}></Route>
            <Route path='/toolbar' component={ToolBar}></Route>
            <Route path='/terminal' component={XTerm} />
        </Router>
    );
};
