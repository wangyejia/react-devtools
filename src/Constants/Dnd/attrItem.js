import React from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

export const BUTTON = {
    text: <Input autoFocus placeholder='属性值' />,
    href: <Input autoFocus placeholder='属性值' />,
    target: <Input autoFocus placeholder='属性值' />,
    icon: <Input autoFocus placeholder='属性值' />,
    type: (
        <Select autoFocus allowClear placeholder='属性值'>
            <Option value='primary'>primary</Option>
            <Option value='dashed'>dashed</Option>
            <Option value='danger'>danger</Option>
            <Option value='link'>link</Option>
        </Select>
    ),
    shape: (
        <Select autoFocus allowClear placeholder='属性值'>
            <Option value='round'>round</Option>
            <Option value='circle'>circle</Option>
        </Select>
    ),
    block: (
        <Select autoFocus allowClear placeholder='属性值'>
            <Option value='true'>true</Option>
            <Option value='false'>false</Option>
        </Select>
    ),
    disabled: (
        <Select autoFocus allowClear placeholder='属性值'>
            <Option value='true'>true</Option>
            <Option value='false'>false</Option>
        </Select>
    ),
    ghost: (
        <Select autoFocus allowClear placeholder='属性值'>
            <Option value='true'>true</Option>
            <Option value='false'>false</Option>
        </Select>
    ),
    htmlType: (
        <Select autoFocus allowClear placeholder='属性值'>
            <Option value='button'>button</Option>
            <Option value='submit'>submit</Option>
            <Option value='reset'>reset</Option>
        </Select>
    )
};
