import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Icon, Input } from 'antd';
import { toggleEmulatorDevice, setDeviceType, setDeviceSize } from 'Actions';
import { deviceMenuTypes, deviceTypeItem } from 'Constants';
const { ipcRenderer, remote } = window.require('electron');

export const EmulatorToolBar = () => {
    const dispatch = useDispatch();
    const toolBarState = useSelector(state => state.toolbar);
    const {
        isMobile,
        deviceType = 'Responsive',
        deviceSize = 1
    } = toolBarState;
    const setEnableDeviceEmulation = options => {
        ipcRenderer.send('set-enable-device-emulation', options);
    };
    const handleToggleDevice = () => {
        const [width, height] = deviceTypeItem[deviceType];
        isMobile
            ? setEnableDeviceEmulation({
                  screenPosition: 'desktop',
                  scale: 1
              })
            : setEnableDeviceEmulation({
                  screenPosition: 'mobile',
                  viewSize: { width, height },
                  scale: deviceSize
              });
        dispatch(toggleEmulatorDevice());
    };
    const handleDeviceTypeClick = () => {
        ipcRenderer.send('show-device-type-menu');
    };
    const handleDeviceSizeClick = () => {
        ipcRenderer.send('show-device-size-menu');
    };
    useEffect(() => {
        ipcRenderer.on('menu-item-click', (event, arg) => {
            const {
                width: screenWidth,
                height: screenHeight
            } = remote.getCurrentWindow().getBounds();
            const [type, value] = arg;
            switch (type) {
                case deviceMenuTypes.DEVICETYPE:
                    const [width4type, height4type] = deviceTypeItem[value];
                    const positionX = Math.floor(
                        (screenWidth - width4type) / 2
                    );
                    const positionY = Math.floor(
                        (screenHeight - height4type) / 2
                    );
                    setEnableDeviceEmulation({
                        screenPosition: 'mobile',
                        viewSize: {
                            width: width4type,
                            height: height4type
                        },
                        viewPosition: { x: positionX, y: positionY },
                        scale: deviceSize
                    });
                    dispatch(setDeviceType(value));
                    break;
                case deviceMenuTypes.DEVICESIZE:
                    const [width4size, height4size] = deviceTypeItem[
                        deviceType
                    ];
                    setEnableDeviceEmulation({
                        screenPosition: 'mobile',
                        viewSize: {
                            width: width4size,
                            height: height4size
                        },
                        scale: value
                    });
                    dispatch(setDeviceSize(value));
                    break;
                default:
                    break;
            }
        });
    }, []);
    return (
        <Row className='emulator-toolbar-container'>
            <Col span={2}>
                <Button
                    type={isMobile ? 'primary' : ''}
                    icon='switcher'
                    size='small'
                    onClick={handleToggleDevice}
                />
            </Col>
            <Col span={20}>
                <Row>
                    <Col span={8}>
                        <Button
                            disabled={isMobile ? false : true}
                            type='link'
                            onClick={handleDeviceTypeClick}
                            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                        >
                            {deviceType} <Icon type='down' />
                        </Button>
                    </Col>
                    <Col span={8}>
                        <Row type='flex' justify='center' align='middle'>
                            <Input
                                disabled={
                                    isMobile && deviceType === 'Responsive'
                                        ? false
                                        : true
                                }
                                size='small'
                                style={{ width: 50, marginRight: 5 }}
                                value={deviceTypeItem[deviceType][0]}
                            />{' '}
                            X
                            <Input
                                disabled={
                                    isMobile && deviceType === 'Responsive'
                                        ? false
                                        : true
                                }
                                size='small'
                                style={{ width: 50, marginLeft: 5 }}
                                value={deviceTypeItem[deviceType][1]}
                            />
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Button
                            disabled={isMobile ? false : true}
                            type='link'
                            onClick={handleDeviceSizeClick}
                            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
                        >
                            {deviceSize * 100 + '%'} <Icon type='down' />
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col span={2}></Col>
        </Row>
    );
};
