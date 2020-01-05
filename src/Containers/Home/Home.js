import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { HomeIndex, HomeProject } from 'Components';
import './index.less';

export const Home = () => {
    return (
        <span>
            <Route
                path='/home'
                exact
                render={() => <Redirect to='/home/index' />}
            />
            <Route path='/home/index' component={HomeIndex} />
            <Route path='/home/project' component={HomeProject} />
        </span>
    );
};
