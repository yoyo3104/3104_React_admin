/**角色 */
import React from 'react'
import {Card,Button,Table,Modal,message} from 'antd'
import {reqRoles,reqAddRoles,reqUpdateRoles} from "../../api/index"
import AddForm from "./add-form"
import AuthForm from "./auth-form"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from '../../utils/storageUtils'
import {formatData} from "../../utils/dataUtils"
export default class Role extends React.Component{
    state={
        roles:[],
        role:[],
        isShowAdd:false,
        isShowAuth:false,
    }
    constructor(props) {
        super(props);
        this.auth=React.createRef();

    }
    initColumn=()=>{
        this.columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time)=>formatData(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formatData
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            }
        ]
    }
    onRow=(role) =>{
        return {
            onClick:event=>{
                
                console.log(role)
                this.setState({role})
            }
        }
    }
    getRoles= async ()=>{
        const result =await reqRoles()
        if(result.status ===0){
            const roles=result.data
            this.setState({roles})
        }
    }
    addRole=  ()=>{
        this.setState({
            isShowAdd:false
        })
        //先进行表单验证
        this.form.validateFields().then( async value=>{
            const {roleName}=value
            console.log(roleName)
            this.form.resetFields()
            const result =await reqAddRoles(roleName)
            console.log(result)
            if(result.status===0){
                message.success('添加角色成功')
                this.getRoles()
            }else {
                message.error('添加角色失败')
            }
        }).catch(error=>{

        })
         

    }
    updateRole= async () =>{
        this.setState({
            isShowAuth:false
        })

        const role =this.state.role
        const menus = this.auth.current.getMenus();
        role.menus=menus;
        role.auth_name=memoryUtils.user.username;
        role.auth_time=Date.now()
        const result =await reqUpdateRoles(role)
        if(result.status===0){
           
            //自己不能修改自己的角色
            if(role._id ===memoryUtils.user.role_id){
                memoryUtils.user={}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('修改权限成功 请重新登录')
            }else{
                this.getRoles()
                message.success('设置权限成功')
            }
            
        }


    }
    handleCancel=()=>{

        this.form.resetFields()
        this.setState({
            isShowAdd:false,
            
        })
    }
    componentWillMount(){
        this.initColumn()
    }
  

    
    componentDidMount(){
        this.getRoles()
    }
    render(){
        const {roles,role,isShowAdd,isShowAuth}=this.state;
        const title =(
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
            </span>
        )
        return(
            <Card title={title}>
                <Table
                    bordered={true}
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role) =>{
                            this.setState({
                                role
                            })
                        }
                        
                      }}
                    onRow={this.onRow}
                    // loading={loading}
                    pagination={{ defaultPageSize: 2, showQuickJumper: true }} 
                
                />


                
                <Modal
                        title="添加角色"
                        visible={isShowAdd}
                        onOk={this.addRole}
                        onCancel={this.handleCancel}
                    >
                        <AddForm setForm={(form)=>{this.form=form}}/>
              
                    </Modal>
                    <Modal
                        title="设置角色权限"
                        visible={isShowAuth}
                        onOk={this.updateRole}
                        onCancel={()=>{this.setState({isShowAuth:false})}}
                    >
                        <AuthForm ref={this.auth} role={role}/>
              
                    </Modal>

            </Card>
        )
    }
}