import React from 'react';
import { Input, Select } from 'antd';
import * as attrs from './attrItem';

export const attrs4DoubleClick = {
    Button: attrs.BUTTON
};

export const attrs4Style = {
    width: <Input autoFocus placeholder='属性值' />,
    height: <Input autoFocus placeholder='属性值' />,
    color: <Input autoFocus placeholder='属性值' />
};
