import React from 'react';
import { Layout } from 'antd';
import { DndContent, DndSider } from 'Components';

const { Content, Sider } = Layout;

export const DndEditor = () => {
    return (
        <Layout style={{ height: '100vh' }}>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0
                }}
            >
                <DndSider />
            </Sider>
            <Layout style={{ marginLeft: 300 }}>
                <Content style={{ margin: '16px' }}>
                    <DndContent />
                </Content>
            </Layout>
        </Layout>
    );
};
