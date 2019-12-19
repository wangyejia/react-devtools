import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tree } from 'antd';
import { setEditorCatalog } from 'Actions';
const { ipcRenderer } = window.require('electron');

const { TreeNode } = Tree;
export const EditorCatalog = () => {
    const dispatch = useDispatch();
    const catalog = useSelector(state => state.editor.catalog);
    useEffect(() => {
        ipcRenderer.send('get-catalog');
    }, []);
    ipcRenderer.once('get-catalog-reply', (event, data) => {
        dispatch(setEditorCatalog(data));
    });
    const onLoadData = treeNode => {
        new Promise(resolve => {
            console.log(treeNode.props);
            resolve();
        });
    };
    return (
        <Tree
            loadData={treeNode => {
                onLoadData(treeNode);
            }}
            treeData={catalog}
        ></Tree>
    );
};

// class EditorCatalog extends React.Component {
//     state = {
//         treeData: [
//             { title: 'Expand to load', key: '0' },
//             { title: 'Expand to load', key: '1' },
//             { title: 'Tree Node', key: '2', isLeaf: true }
//         ]
//     };

//     onLoadData = treeNode =>
//         new Promise(resolve => {
//             if (treeNode.props.children) {
//                 resolve();
//                 return;
//             }
//             setTimeout(() => {
//                 treeNode.props.dataRef.children = [
//                     {
//                         title: 'Child Node',
//                         key: `${treeNode.props.eventKey}-0`
//                     },
//                     { title: 'Child Node', key: `${treeNode.props.eventKey}-1` }
//                 ];
//                 this.setState({
//                     treeData: [...this.state.treeData]
//                 });
//                 resolve();
//             }, 1000);
//         });

//     renderTreeNodes = data =>
//         data.map(item => {
//             if (item.children) {
//                 return (
//                     <TreeNode title={item.title} key={item.key} dataRef={item}>
//                         {this.renderTreeNodes(item.children)}
//                     </TreeNode>
//                 );
//             }
//             return <TreeNode key={item.key} {...item} dataRef={item} />;
//         });

//     render() {
//         return (
//             <Tree loadData={this.onLoadData}>
//                 {this.renderTreeNodes(this.state.treeData)}
//             </Tree>
//         );
//     }
// }
