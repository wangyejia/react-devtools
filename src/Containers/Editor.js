import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { Row, Col } from 'antd';
import { EditorCatalog } from 'Components';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './index.less';
import 'codemirror/mode/javascript/javascript.js';

export const Editor = () => {
    let code =
        "import React from 'react'\nimport ReactDOM from 'react-dom';\nimport { createStore } from 'redux';\nimport { Provider } from 'react-redux';\nimport reducer from './Reducers';\nimport App from './Containers/App';\nimport * as serviceWorker from './serviceWorker';\nconst store = createStore(reducer);\nReactDOM.render(\n\t<Provider store={store}>\n\t\t<App />\n\t</Provider>,\n\tdocument.getElementById('root')\n);";
    return (
        <Row style={{ height: '100vh' }}>
            <Col span={8} style={{ height: '100vh', overflowY: 'scroll' }}>
                <EditorCatalog />
            </Col>
            <Col span={16} style={{ height: '100vh' }}>
                <CodeMirror
                    value={code}
                    options={{
                        mode: 'javascript',
                        theme: 'material',
                        lineNumbers: true,
                        styleActiveLine: true,
                        lineWrapping: true,
                        foldGutter: true,
                        gutters: [
                            'CodeMirror-linenumbers',
                            'CodeMirror-foldgutter'
                        ]
                    }}
                    onChange={(editor, data, value) => {}}
                />
            </Col>
        </Row>
    );
};
