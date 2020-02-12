import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Select, Form, Radio } from 'antd';
import { setFuncVoidElement } from 'Actions';

const { Option } = Select;

export const DndItemAttrImpl4Func = ({ ast, form }) => {
    const dispatch = useDispatch();
    const { target = '', name = '', params = [], voidElement, attrs } = ast;
    const { id: funcAstId } = attrs;
    const { getFieldDecorator } = form;
    const handleRadioChange = e => {
        dispatch(setFuncVoidElement(funcAstId, e.target.value));
    };
    return (
        <Fragment>
            <Radio.Group
                defaultValue={false}
                buttonStyle='solid'
                style={{ marginBottom: '10px' }}
                onChange={handleRadioChange}
            >
                <Radio.Button value={false}>非空函数</Radio.Button>
                <Radio.Button value={true}>空函数</Radio.Button>
            </Radio.Group>
            <Form.Item label='函数对象'>
                {getFieldDecorator('target', {
                    initialValue: target
                })(
                    <Input
                        placeholder='请输入函数对象'
                        disabled={voidElement}
                    />
                )}
            </Form.Item>
            <Form.Item label='函数类型'>
                {getFieldDecorator('name', {
                    initialValue: name
                })(
                    <Select
                        allowClear
                        placeholder='请选择函数类型'
                        disabled={voidElement}
                    >
                        <Option value='map'>map</Option>
                        <Option value='filter'>filter</Option>
                        <Option value='reduce'>reduce</Option>
                    </Select>
                )}
            </Form.Item>
            <Form.Item label='函数参数'>
                {getFieldDecorator('params', {
                    initialValue: params.join('|')
                })(
                    <Input
                        placeholder='请输入函数参数'
                        disabled={voidElement}
                    />
                )}
            </Form.Item>
            <Form.Item label='函数体'>
                {getFieldDecorator('name', {
                    initialValue: name
                })(
                    <Input placeholder='请输入函数体' disabled={!voidElement} />
                )}
            </Form.Item>
        </Fragment>
    );
};
