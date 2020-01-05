import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Layout, Avatar, Button, Icon } from 'antd';
import { HomeSider } from 'Components';
import { setReactProject } from 'Actions';
const { dialog } = window.require('electron').remote;

const { Content } = Layout;

export const HomeIndex = () => {
    const reactProject = useSelector(state => state.home.reactProject) || [];
    const dispatch = useDispatch();
    let reactProjectStorage = localStorage.getItem('reactProject');
    reactProjectStorage = reactProjectStorage
        ? JSON.parse(reactProjectStorage)
        : [];
    useEffect(() => {
        dispatch(setReactProject(reactProjectStorage));
    }, [reactProject.length]);
    return (
        <Layout style={{ height: '100vh' }}>
            {reactProject.length ? <HomeSider /> : null}
            <Content
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10% 20%',
                    marginLeft: reactProject.length ? '300px' : '0'
                }}
            >
                <Avatar
                    shape='square'
                    size={64}
                    src={require('../../assets/logo.png')}
                />
                <h1 style={{ fontSize: '25px', marginTop: '5px' }}>
                    React Devtools
                </h1>
                <h6>Version 2019.10.11</h6>
                <NavLink to='/home/project' style={{ marginTop: '50px' }}>
                    <Button
                        style={{
                            width: '200px',
                            textAlign: 'left'
                        }}
                    >
                        <Icon type='plus' />
                        Create New Project
                    </Button>
                </NavLink>
                <Button
                    style={{
                        width: '200px',
                        textAlign: 'left',
                        marginTop: '5px'
                    }}
                    onClick={() => {
                        dialog
                            .showOpenDialog({
                                properties: ['openDirectory']
                            })
                            .then(rst => {
                                const filePaths = rst.filePaths[0].split('/');
                                const pPath = filePaths.slice(0, -1).join('/');
                                const pName = filePaths.slice(-1)[0];
                                reactProjectStorage.unshift({ pName, pPath });
                                localStorage.setItem(
                                    'reactProject',
                                    JSON.stringify(reactProjectStorage)
                                );
                                dispatch(setReactProject(reactProjectStorage));
                            });
                    }}
                >
                    <Icon type='import' />
                    Import Project
                </Button>
            </Content>
        </Layout>
    );
};
