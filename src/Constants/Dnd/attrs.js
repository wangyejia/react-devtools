import React from 'react';
import { Input, Select } from 'antd';
import * as attrs from './attrItem';

const { TextArea } = Input;

export const attrs4DoubleClick = {
    Button: attrs.BUTTON
};

export const attrs4Style = {
    width: <Input autoFocus placeholder='属性值' />,
    height: <Input autoFocus placeholder='属性值' />,
    color: <Input autoFocus placeholder='属性值' />
};

export const attrs4Event = {
    onClick: <TextArea autoSize={{ minRows: 1, maxRows: 6 }} />
};
