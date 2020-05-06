import React from 'react'
import "./login.less"
import logo from "../../assets/images/logo.png"
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {Redirect} from 'react-router-dom'
import {reqLogin} from "../../api"
import {message} from 'antd'



class Login extends React.Component {
 
    //   onFinish= async (values)=>{
    //   console.log('Received values of form: ', values);
    //   const {username,password} =values;
    
    //     const response =await reqLogin(username,password)
    //     console.log('请求成功hhh',response)
    //     const result =response
    //     if(result.status === 0){
    //         message.success('登陆成功了！')
    //         //跳转到管理界面
    //         console.log(onFinish)
    //         // this.props.history.replace('/');

    //     }else{
    //         message.error(result.msg)
    //     }
     
    //    if(values){
    //     reqLogin(username,password)
    //     .then(res=>{
    //         console.log('success',res.data)
    //     })
    //     .catch(error=>{
    //         console.log('失败了')
    //     })
    //    }
        
        //  axios.post('/login', {
          
        //       username:username,
        //       password:password
        //  }
        //   )
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   })
    // }
      onFinish= async (values)=>{
           console.log(values);
           const {username,password} =values;
    
           const response =await reqLogin(username,password)
           console.log('请求成功hhh',response)
           const result =response
           if(result.status === 0){
               message.success('登陆成功了！')
               //跳转到管理界面
           const user = result.data; 
           console.log(user)
            memoryUtils.user =user;//保存到内存中
            storageUtils.saveUser(user)//保存到local中
        
           this.props.history.replace('/');
   
           }else{
               message.error(result.msg)
           }

       }
    
    render(){
     const user= memoryUtils.user
     if(user._id){
         return <Redirect to='/'/>
     }
   

      
return(
        <div className="login">
               <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>基金后台管理项目</h1>
               </header> 
               <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish ={this.onFinish}
                        
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, whitespace:true,message: '用户名必须输入' },
                            { required: true, message: '用户名必须输入' },
                            { min: 4, message: '用户名至少4位' },
                            { max: 12, message: '用户名最多12位' },
                            { pattern:/^[a-zA-Z0-9_]+$/, message: '用户名必须是数字英文下划线' },
                            

                        ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject('Should accept agreement'),},
                               ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                       

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
        </Button>
                         
                        </Form.Item>
                    </Form>
               
               </section>
         
            
            </div>



        )
    }
    }
    
export default Login