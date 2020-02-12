import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button, Input } from 'antd';
import { setPageAttr, deletePageAttr } from 'Actions';

export const DndItemAttrImpl4Page = props => {
    const dispatch = useDispatch();
    const { type, data, index } = props;
    const { key, val } = data;
    const handlePageAttrChange = (e, type, keyOrVal) => {
        dispatch(setPageAttr(e.target.value, type, keyOrVal, index));
    };
    const handlePageAttrDelete = () => {
        dispatch(deletePageAttr(type, index));
    };
    return (
        <Row gutter={24} style={{ marginBottom: '10px' }}>
            <Col span={10}>
                <Input
                    value={key}
                    onChange={e => {
                        handlePageAttrChange(e, type, 'key');
                    }}
                />
            </Col>
            <Col span={10}>
                <Input
                    value={val}
                    onChange={e => {
                        handlePageAttrChange(e, type, 'val');
                    }}
                />
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
                    onClick={handlePageAttrDelete}
                />
            </Col>
        </Row>
    );
};
