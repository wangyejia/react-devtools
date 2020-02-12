import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Row, Col, Button, Select } from 'antd';
import { setAstAttrNames } from 'Actions';
import { attrs4Style, attrs4Event, attrs4Global } from 'Constants';

const { Option, OptGroup } = Select;

const getAttrNameOption = (attrNames4DoubleClick, attrNames4Select, label) => {
    return attrNames4DoubleClick
        .filter(item => !attrNames4Select.includes(item))
        .map((item, index) => (
            <Option value={item} key={`attr-name-${label}-${index}`}>
                {item}
            </Option>
        ));
};

export const DndItemAttrImpl4Comp = props => {
    console.log(props);
    const {
        form,
        attrName,
        index,
        attrs4Select,
        attrNames4Style,
        attrNames4Select,
        attrNames4Global,
        attrNames4Event,
        attrNames4DoubleClick,
        doubleClickAttrs
    } = props;
    const { style: doubleClickStyle = {} } = doubleClickAttrs;
    const attrs = {
        ...attrs4Select,
        ...attrs4Style,
        ...attrs4Event,
        ...attrs4Global
    };
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
                            'style'
                        )}
                    </OptGroup>
                    <OptGroup label='通用'>
                        {getAttrNameOption(
                            attrNames4Global,
                            attrNames4Select,
                            'global'
                        )}
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
