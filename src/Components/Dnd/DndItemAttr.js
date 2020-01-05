import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Form, Row, Col, Button, Select, Icon } from 'antd';
import { useForm } from 'sunflower-antd';
import {
    setDoubleClickAst,
    setAstAttrs,
    deleteAstAttrs,
    setAstAttrNames,
    setAstAttrStyle
} from 'Actions';
import { attrs4DoubleClick, attrs4Style, attrs4Event } from 'Constants';

const { Option, OptGroup } = Select;

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

const getAttrNameOption = (attrNames4DoubleClick, attrNames4Select, label) => {
    return attrNames4DoubleClick
        .filter(item => !attrNames4Select.includes(item))
        .map((item, index) => (
            <Option value={item} key={`attr-name-${label}-${index}`}>
                {item}
            </Option>
        ));
};

const DndItemAttrImpl = props => {
    const {
        form,
        attrName,
        index,
        attrs4Select,
        attrNames4Style,
        attrNames4Select,
        attrNames4Event,
        attrNames4DoubleClick,
        doubleClickAttrs
    } = props;
    const { style: doubleClickStyle = {} } = doubleClickAttrs;
    const attrs = { ...attrs4Select, ...attrs4Style, ...attrs4Event };
    const dispatch = useDispatch();
    const { getFieldDecorator } = form;
    const hanldeAttrNameChange = value => {
        attrNames4Select[index] = value;
        dispatch(setAstAttrNames(attrNames4Select));
    };
    const handleDeleteAttr = idx => {
        attrNames4Select.splice(idx, 1);
        !attrNames4Select.length && attrNames4Select.push('');
        dispatch(setAstAttrNames(attrNames4Select));
    };
    console.log(attrName);
    return (
        <Row gutter={24} style={{ marginBottom: '10px' }}>
            <Col span={10}>
                <Select
                    allowClear
                    showSearch
                    filterOption
                    defaultValue={attrName || undefined}
                    placeholder='属性名'
                    onChange={hanldeAttrNameChange}
                >
                    <OptGroup label='antd'>
                        {getAttrNameOption(
                            attrNames4DoubleClick,
                            attrNames4Select,
                            'antd'
                        )}
                    </OptGroup>
                    <OptGroup label='样式'>
                        {getAttrNameOption(
                            attrNames4Style,
                            attrNames4Select,
                            'global'
                        )}
                    </OptGroup>
                    <OptGroup label='通用'>
                        <Option value='className'>className</Option>
                    </OptGroup>
                    <OptGroup label='事件'>
                        {getAttrNameOption(
                            attrNames4Event,
                            attrNames4Select,
                            'event'
                        )}
                    </OptGroup>
                </Select>
            </Col>
            <Col span={10}>
                {attrName ? (
                    <Form.Item>
                        {getFieldDecorator(attrName, {
                            initialValue:
                                doubleClickAttrs[attrName] ||
                                doubleClickStyle[attrName]
                        })(attrs[attrName])}
                    </Form.Item>
                ) : null}
            </Col>
            <Col
                span={4}
                style={{
                    height: '32px',
                    lineHeight: '32px',
                    textAlign: 'right'
                }}
            >
                <Button
                    type='dashed'
                    shape='circle'
                    size='small'
                    icon='close'
                    onClick={() => {
                        handleDeleteAttr(index);
                    }}
                />
            </Col>
        </Row>
    );
};

export const DndItemAttr = Form.create()(({ form }) => {
    const dispatch = useDispatch();
    const doubleClickAst = useSelector(state => state.ast.doubleClickAst) || {};
    const attrNames4Select = useSelector(state => state.ast.attrNames) || [];
    const {
        attrs: doubleClickAttrs = {},
        name: doubleClickName,
        children: doubleClickChildren = []
    } = doubleClickAst;
    const { id: doubleClickId } = doubleClickAttrs;
    const attrs4Select = attrs4DoubleClick[doubleClickName] || {};
    const attrNames4DoubleClick = Object.keys(attrs4Select);
    const attrNames4Style = Object.keys(attrs4Style);
    const attrNames4Event = Object.keys(attrs4Event);
    const { validateFieldsAndScroll } = form;
    if (doubleClickChildren.length && doubleClickChildren[0].type === 'text') {
        doubleClickAttrs.text = doubleClickChildren[0].content;
    }
    useEffect(() => {
        dispatch(setAstAttrNames(getAttrNames(doubleClickAttrs)));
    }, [doubleClickId]);
    const handleClose = () => {
        dispatch(setDoubleClickAst());
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
                    deleteAstAttrs(doubleClickId, values, deleteWidthAndHeight)
                );
                dispatch(setAstAttrStyle(doubleClickId, styleValues));
                handleClose();
            });
        }
    });
    return (
        <Drawer
            title='设置属性'
            width={360}
            onClose={() => {
                handleClose();
            }}
            visible={!!doubleClickId}
            bodyStyle={{ paddingBottom: 80 }}
            className='dnd-item-attr'
        >
            <Form>
                {attrNames4Select.map((attrName, index) => (
                    <DndItemAttrImpl
                        key={`attr-name-${attrName}-${index}`}
                        form={form}
                        attrName={attrName}
                        index={index}
                        doubleClickAttrs={doubleClickAttrs}
                        attrs4Select={attrs4Select}
                        attrNames4Style={attrNames4Style}
                        attrNames4Select={attrNames4Select}
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
