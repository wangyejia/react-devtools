import React from 'react';
import { useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { Menu, Icon } from 'antd';
import { menuTypes, menus, dndTypesArr, dropTypes } from 'Constants';
import { DndMenuItem } from 'Components';

const { SubMenu } = Menu;

const getMenuItem = menus =>
    menus.map(item => {
        const { type, displayType, title, icon, key, children } = item;
        switch (type) {
            case menuTypes.SUB:
                return (
                    <SubMenu
                        key={key}
                        title={
                            <span>
                                {icon ? <Icon type={icon} /> : null}
                                <span>{title}</span>
                            </span>
                        }
                    >
                        {getMenuItem(children)}
                    </SubMenu>
                );
            case menuTypes.ITEMGROUP:
                return (
                    <Menu.ItemGroup key={key} title={title}>
                        {getMenuItem(children)}
                    </Menu.ItemGroup>
                );
            default:
                return (
                    <Menu.Item key={key}>
                        <DndMenuItem
                            title={title}
                            type={type}
                            displayType={displayType}
                        />
                    </Menu.Item>
                );
        }
    });

export const DndSider = () => {
    const isDrag = useSelector(state => state.dnd.isDrag);
    const [{ isOverCurrent }, drop] = useDrop({
        accept: dndTypesArr,
        drop: (item, monitor) => {
            if (monitor.isOver({ shallow: true })) {
                return { type: dropTypes.DELETE };
            }
        },
        collect: monitor => ({
            isOverCurrent: monitor.isOver({ shallow: true })
        })
    });
    return (
        <Menu theme='dark' mode='inline' defaultOpenKeys={['global']}>
            {getMenuItem(menus)}
            <Menu.Item key='delete'>
                <span
                    className={`dnd-delete ${isDrag ? 'dnd-delete-show' : ''} ${
                        isOverCurrent ? 'dnd-delete-hover' : ''
                    }`}
                    ref={drop}
                >
                    <Icon type='delete' style={{ fontSize: '20px' }} />
                </span>
            </Menu.Item>
        </Menu>
    );
};
