import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, List, Icon } from 'antd';
import { setReactProject } from 'Actions';
const { ipcRenderer } = window.require('electron');

const { Sider } = Layout;

export const HomeSider = () => {
    const reactProject = useSelector(state => state.home.reactProject) || [];
    const dispatch = useDispatch();
    const handleClose = (e, project) => {
        e.stopPropagation();
        reactProject.splice(reactProject.indexOf(project), 1);
        localStorage.setItem('reactProject', JSON.stringify(reactProject));
        dispatch(setReactProject(reactProject));
    };
    const openProject = project => {
        ipcRenderer.send('open-project', project);
    };
    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0
            }}
        >
            <List
                split={false}
                itemLayout='horizontal'
                dataSource={reactProject}
                renderItem={item => (
                    <List.Item onClick={() => openProject(item)}>
                        <List.Item.Meta
                            title={item.pName}
                            description={item.pPath}
                        />
                        <Icon
                            type='close'
                            onClick={e => handleClose(e, item)}
                        />
                    </List.Item>
                )}
            ></List>
        </Sider>
    );
};
