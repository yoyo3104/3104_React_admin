/**商品 */
import React from 'react'
import { Card, Button, Table, Modal,message } from 'antd'
import { formatData } from '../../utils/dataUtils'
import LinkButton from '../../compoenents/link-button'
import { PAGE_SIZE } from '../../utils/constant'
import {reqUsers,reqDeleteUser,reqAddUser } from '../../api/index'
import {ExclamationCircleOutlined} from '@ant-design/icons';
import UserForm from './user_form'



export default class User extends React.Component {
    state = {
        users: [],
        roles:[],
        isShow: false,//是否显示确认框
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formatData
            },
         
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render:(role_id)=>this.state.roles.find(role=>role._id===role_id).name
                render:(role_id)=>this.RoleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={this.showUpdate.bind(this,user)}>修改</LinkButton>
                        <LinkButton onClick={this.deleteUser.bind(this,user)}>删除</LinkButton>
                    </span>
                )
            },

        ]
    }
    initRoleNames=(roles)=>{
        const RoleNames =roles.reduce((pre,role)=>{
            pre[role._id]=role.name;
            return pre
            
        },{})
        this.RoleNames=RoleNames;

    }
    getUsers= async ()=>{
       
        const result =await reqUsers();
        console.log(result)
        if(result.status===0){
            const {users,roles}=result.data
           this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }
    showAdd=()=>{
        this.user={}
        this.setState({
            isShow:true
        })
    }
    showUpdate=(user)=>{
        this.user=user
        this.setState({
            isShow:true
        })

    }
    addOrUpdateUser =async () => {
        this.setState({
            isShow: false
        })
        const user=this.form.getFieldsValue();
       
        this.form.resetFields();
        //如果是更新 需要指定_id
        if(this.user ){
            user._id=this.user._id
        }
        
        const result =await reqAddUser(user)
      
        // 
        if(result.status===0){

            message.success(`${this.user?'修改':'添加'}用户成功！`)
            this.getUsers()
        }


    }
    deleteUser=(user)=>{
        Modal.confirm({
            title:`确认删除${user.username}用户吗?`,
            icon: <ExclamationCircleOutlined />,
          
             onOk: async ()=> {
              console.log('OK');
              const result =await reqDeleteUser(user._id)
              if(result.status ===0) {
                  message.success('删除用户成功！')
                  this.getUsers();
              }
            }
            // onCancel() {
            //   console.log('Cancel');
            // },
          })

    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }

    render() {
        const title = <Button type='primary'onClick={this.showAdd}>创建用户</Button>
        const { users, isShow,roles } = this.state
        const user = this.user ||{}
        return (

            <Card title={title}>
                <Table
                    bordered={true}
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}

                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }} />
                <Modal
                    title={user._id?"修改用户":"添加用户"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({ isShow: false })}
                    }
                >

                    <UserForm setForm={form=>this.form=form} roles={roles} user={user}/>
                </Modal>
            </Card>
        )
    }
}