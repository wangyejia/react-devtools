import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Form, Layout, Input, Button, Spin, Checkbox } from 'antd';
import { useForm } from 'sunflower-antd';
import { toggleSpin } from 'Actions';
const { ipcRenderer, remote } = window.require('electron');
const { dialog } = remote;

const { Content, Footer } = Layout;
const { Search } = Input;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
};
export const HomeProject = Form.create()(({ form }) => {
    const spinning = useSelector(state => state.home.spinning);
    const dispatch = useDispatch();
    const history = useHistory();
    const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll } = form;
    const { formProps, submit } = useForm({
        form,
        submit() {
            validateFieldsAndScroll((err, values) => {
                if (err) {
                    return;
                }
                dispatch(toggleSpin());
                setTimeout(() => {
                    ipcRenderer.send('create-project', values);
                }, 0);
            });
        }
    });
    ipcRenderer.on('create-project-reply', (event, arg) => {
        if (!spinning) {
            return;
        }
        const [project, stat] = arg;
        let reactProject = localStorage.getItem('reactProject');
        reactProject = reactProject ? JSON.parse(reactProject) : [];
        if (
            stat &&
            !reactProject.filter(
                item =>
                    item.pName === project.pName && item.pPath === project.pPath
            ).length
        ) {
            reactProject.unshift(project);
            localStorage.setItem('reactProject', JSON.stringify(reactProject));
        }
        dispatch(toggleSpin());
    });
    const formItem = [
        {
            label: '项目名称',
            name: 'pName',
            option: {
                rules: [
                    {
                        required: true,
                        message: '请输入项目名称!'
                    }
                ]
            },
            child: <Input />
        },
        {
            label: '目录',
            name: 'pPath',
            option: {
                rules: [
                    {
                        required: true,
                        message: '请输入项目目录!'
                    }
                ]
            },
            child: (
                <Search
                    enterButton='选择'
                    onSearch={() => {
                        dialog
                            .showOpenDialog({
                                properties: ['openDirectory']
                            })
                            .then(rst => {
                                rst.filePaths.length &&
                                    setFieldsValue({ pPath: rst.filePaths[0] });
                            });
                    }}
                />
            )
        },
        {
            label: '第三方工具',
            name: 'pTool',
            child: (
                <Checkbox.Group style={{ width: '100%' }}>
                    <Checkbox value='router'>Router</Checkbox>
                    <Checkbox value='redux'>Redux</Checkbox>
                    <Checkbox value='typeScript'>TypeScript</Checkbox>
                    <Checkbox value='antd'>AntD</Checkbox>
                </Checkbox.Group>
            )
        }
    ];
    return (
        <Spin spinning={!!spinning} tip='加载中...'>
            <Form {...formItemLayout} {...formProps}>
                <Layout style={{ height: '100vh' }}>
                    <Layout>
                        <Content style={{ marginTop: '20px' }}>
                            {formItem.map(item => {
                                return (
                                    <Form.Item
                                        key={item.name}
                                        label={item.label}
                                        hasFeedback={item.hasFeedback}
                                        className={item.className}
                                        {...item.args}
                                    >
                                        {getFieldDecorator(`${item.name}`, {
                                            ...item.option
                                        })(item.child)}
                                    </Form.Item>
                                );
                            })}
                        </Content>
                    </Layout>
                    <Footer
                        style={{
                            padding: '10px 50px',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Button
                            size='small'
                            onClick={() => {
                                history.goBack();
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            type='primary'
                            size='small'
                            onClick={() => submit()}
                            style={{ marginLeft: '10px' }}
                        >
                            新建
                        </Button>
                    </Footer>
                </Layout>
            </Form>
        </Spin>
    );
});
