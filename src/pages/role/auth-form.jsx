import React from 'react'
import {Form,Select,Input,Tree} from 'antd'
import PropTypes from 'prop-types'
import menuConfig from '../../config/menuConfig'


const { TreeNode } = Tree;

export default class AuthForm extends React.PureComponent {
    // constructor(props){
    //     super(props);
    //     this.myRef=React.createRef();
    // }
    static propTypes ={
        role:PropTypes.object
    
    }
  
    constructor(props) {
        super(props)
        const {menus} =this.props.role
        this.state={
            checkedKeys:menus
        }
    }
    // getTreeNodes=(menuConfig)=>{
    //     return menuConfig.reduce((pre,item)=>{
    //         pre.push(
    //             <TreeNode title={item.title} key={item.key}>
    //             {item.children?this.getTreeNodes(item.children):null}
    //             </TreeNode>
               
    //         )
    //         return pre;
    //     },[])
    // }
    getTreeNodes=(menuConfig)=>{
        return menuConfig.reduce((pre,item)=>{
            pre.push(
                
               {
                title:item.title,
                key:item.key,
                children:item.children?this.getTreeNodes(item.children):null
               }
               
            //    (item.children?this.getTreeNodes(item.children):null)
               
            )
            return pre;
           
        },[])
    }
    getMenus=()=> this.state.checkedKeys
    onCheck=checkedKeys=>{
        console.log(checkedKeys)
        this.setState({
            checkedKeys
        })
    }
    componentWillMount() {
        this.treeNodes=this.getTreeNodes(menuConfig)
    }
    //initialValues={{ categoryName: categoryName }}
    // componentDidMount(){
    //      this.props.setForm(this.myRef.current)
    //      console.log(this.myRef.current)
        
    // }
      //接收到新属性的时候自动调用
      componentWillReceiveProps(nextProps) {
        const menus =nextProps.role.menus
        this.setState({
           checkedKeys:menus
        })}
    render() {
    
        const treeData = [
            {
              title: '总权限',
              key: 'all',
              children:this.treeNodes
            }
            
          ];
          
          

        const {role} =this.props;
        const {checkedKeys} =this.state;
        console.log(role)
        
        
        return (
           <div
         
           >
           <Form.Item  label="角色名称"  >
                    <Input value={role.name} disabled></Input>
                </Form.Item>
             
          
            <Tree
            checkable
            defaultExpandAll={true}
            // defaultExpandedKeys={['0-0-0', '0-0-1']}
            // defaultSelectedKeys={['0-0-0', '0-0-1']}
            // defaultCheckedKeys={['0-0-0', '0-0-1']}
            // onSelect={onSelect}
            onCheck={this.onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
          >
             {/* <TreeNode title="平台权限" key="all">
             {this.treeNodes}
             </TreeNode> */}
          </Tree>
          </div>

        )
    }
}