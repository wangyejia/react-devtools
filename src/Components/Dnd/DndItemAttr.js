import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Form, Button, Icon, Divider, Dropdown, Menu } from 'antd';
import { useForm } from 'sunflower-antd';
import {
    setDoubleClickAst,
    setAstAttrs,
    deleteAstAttrs,
    setAstAttrNames,
    setAstAttrStyle,
    togglePageAttr,
    addPageAttr,
    deletePageAttr,
    setFuncAttr
} from 'Actions';
import {
    attrs4DoubleClick,
    attrs4Style,
    attrs4Event,
    attrs4Global
} from 'Constants';
import {
    DndItemAttrImpl4Comp,
    DndItemAttrImpl4Page,
    DndItemAttrImpl4Func
} from 'Components';

const getAttrNames = attrs => {
    const styleNames = Object.keys(attrs.style || {}).filter(item => {
        return item !== 'width' && item !== 'height';
    });
    const attrNames = Object.keys(attrs).filter(item => {
        return item !== 'id' && item !== 'style' && attrs[item];
    });
    const names = [...attrNames, ...styleNames];
    return names.length ? names : [''];
};

export const DndItemAttr = Form.create()(({ form, showPageAttr, ast }) => {
    const dispatch = useDispatch();
    const doubleClickAst = useSelector(state => state.ast.doubleClickAst) || {};
    const attrNames4Select = useSelector(state => state.ast.attrNames) || [];
    const {
        attrs: doubleClickAttrs = {},
        name: doubleClickName,
        children: doubleClickChildren = [],
        type: doubleClickType
    } = doubleClickAst;
    const { id: doubleClickId } = doubleClickAttrs;
    const attrs4Select = attrs4DoubleClick[doubleClickName] || {};
    const attrNames4DoubleClick = Object.keys(attrs4Select);
    const attrNames4Style = Object.keys(attrs4Style);
    const attrNames4Event = Object.keys(attrs4Event);
    const attrNames4Global = Object.keys(attrs4Global);
    const { validateFieldsAndScroll } = form;
    const { dependencies = [], variables = [], functions = [] } = ast;
    if (doubleClickChildren.length && doubleClickChildren[0].type === 'text') {
        doubleClickAttrs.text = doubleClickChildren[0].content;
    }
    useEffect(() => {
        addPageAttrImpl();
        if (!showPageAttr) {
            dependencies.forEach((item, index) => {
                !item.key && dispatch(deletePageAttr('dependencies', index));
            });
            variables.forEach((item, index) => {
                !item.key && dispatch(deletePageAttr('variables', index));
            });
            functions.forEach((item, index) => {
                !item.key && dispatch(deletePageAttr('functions', index));
            });
        }
    }, [showPageAttr]);
    useEffect(() => {
        addPageAttrImpl();
    }, [dependencies, variables, functions]);
    useEffect(() => {
        dispatch(setAstAttrNames(getAttrNames(doubleClickAttrs)));
    }, [doubleClickId]);
    const addPageAttrImpl = type => {
        if (showPageAttr) {
            if (type) {
                dispatch(addPageAttr(type));
            } else {
                !dependencies.length && dispatch(addPageAttr('dependencies'));
                !variables.length && dispatch(addPageAttr('variables'));
                !functions.length && dispatch(addPageAttr('functions'));
            }
        }
    };
    const handleClose = () => {
        showPageAttr
            ? dispatch(togglePageAttr())
            : dispatch(setDoubleClickAst());
        dispatch(setAstAttrNames([]));
    };
    const handleAddAttr = () => {
        attrNames4Select.push('');
        dispatch(setAstAttrNames(attrNames4Select));
    };
    const { submit } = useForm({
        form,
        submit() {
            validateFieldsAndScroll((err, values) => {
                if (err) {
                    return;
                }
                if (!showPageAttr) {
                    if (doubleClickType === 'func') {
                        dispatch(setFuncAttr(doubleClickId, values));
                    } else {
                        const valueNames = Object.keys(values);
                        const styleValues = {};
                        valueNames.forEach(name => {
                            !values[name] && delete values[name];
                            if (attrNames4Style.includes(name)) {
                                styleValues[name] =
                                    name === 'width' || name === 'height'
                                        ? Number(values[name])
                                        : values[name];
                                delete values[name];
                            }
                        });
                        const deleteWidthAndHeight =
                            !styleValues.width && !styleValues.height;
                        dispatch(setAstAttrs(doubleClickId, values));
                        dispatch(
                            deleteAstAttrs(
                                doubleClickId,
                                values,
                                deleteWidthAndHeight
                            )
                        );
                        dispatch(setAstAttrStyle(doubleClickId, styleValues));
                    }
                }
                handleClose();
            });
        }
    });
    const handleMenuClick = ({ key }) => {
        addPageAttrImpl(key);
    };
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key='dependencies'>
                <Icon type='plus' /> 增加依赖项
            </Menu.Item>
            <Menu.Item key='variables'>
                <Icon type='plus' /> 增加变量
            </Menu.Item>
            <Menu.Item key='functions'>
                <Icon type='plus' /> 增加函数
            </Menu.Item>
        </Menu>
    );
    return (
        <Drawer
            title='设置属性'
            width={360}
            onClose={() => {
                handleClose();
            }}
            visible={!!doubleClickId || showPageAttr}
            bodyStyle={{ paddingBottom: 80 }}
            className='dnd-item-attr'
        >
            {showPageAttr ? (
                <Form>
                    <Divider orientation='left'>依赖项</Divider>
                    {dependencies.map((data, index) => (
                        <DndItemAttrImpl4Page
                            key={`denp-${data.key}-${index}`}
                            type='dependencies'
                            data={data}
                            index={index}
                        />
                    ))}
                    <Divider orientation='left'>变量</Divider>
                    {variables.map((data, index) => (
                        <DndItemAttrImpl4Page
                            key={`var-${data.key}-${index}`}
                            type='variables'
                            data={data}
                            index={index}
                        />
                    ))}
                    <Divider orientation='left'>函数</Divider>
                    {functions.map((data, index) => (
                        <DndItemAttrImpl4Page
                            key={`func-${data.key}-${index}`}
                            type='functions'
                            data={data}
                            index={index}
                        />
                    ))}
                    <Divider />
                    <Dropdown overlay={menu}>
                        <Button>
                            增加属性 <Icon type='down' />
                        </Button>
                    </Dropdown>
                </Form>
            ) : doubleClickType === 'func' ? (
                <Form layout='vertical'>
                    <DndItemAttrImpl4Func ast={doubleClickAst} form={form} />
                </Form>
            ) : (
                <Form>
                    {attrNames4Select.map((attrName, index) => (
                        <DndItemAttrImpl4Comp
                            key={`attr-name-${attrName}-${index}`}
                            form={form}
                            attrName={attrName}
                            index={index}
                            doubleClickAttrs={doubleClickAttrs}
                            attrs4Select={attrs4Select}
                            attrNames4Style={attrNames4Style}
                            attrNames4Select={attrNames4Select}
                            attrNames4Global={attrNames4Global}
                            attrNames4Event={attrNames4Event}
                            attrNames4DoubleClick={attrNames4DoubleClick}
                        />
                    ))}
                    <div
                        style={{
                            color: '#1da57a',
                            cursor: 'pointer'
                        }}
                        onClick={handleAddAttr}
                    >
                        <Icon type='plus' />
                        增加属性
                    </div>
                </Form>
            )}
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right'
                }}
            >
                <Button
                    style={{ marginRight: 8 }}
                    onClick={() => {
                        handleClose();
                    }}
                >
                    取消
                </Button>
                <Button
                    type='primary'
                    onClick={() => {
                        submit();
                    }}
                >
                    确认
                </Button>
            </div>
        </Drawer>
    );
});
