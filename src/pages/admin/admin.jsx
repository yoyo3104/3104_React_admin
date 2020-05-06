import React from 'react'
import memoryUtils  from '../../utils/memoryUtils'
import { Layout } from 'antd';
import LeftNav from '../../compoenents/left-nav'
import Header from '../../compoenents/header'
import Home from "../home/home"
import Category from "../category/category"
import Product from "../product/product"
import Role from "../role/role"
import User from "../user/user"
import Line from "../charts/line"
import Bar from "../charts/bar"
import Pie from "../charts/pie"
import {Route,Switch,Redirect} from "react-router-dom"

const { Footer, Sider, Content } = Layout;


export default class Admin extends React.Component{

    render(){
        const user =memoryUtils.user;
        if(!user || !user._id){
            return <Redirect to='/login'/>

        }
        // return(
            
        //         <Layout style={{height:'100%'}}>
        //             <Sider>
        //                 <LeftNav/>
        //             </Sider>
        //             <Layout>
        //                 <Header>Header</Header>
        //                 <Content style={{margin:'20px',backgroundColor:'#fff'}}>
        //                     <Switch>
        //                         <Route path="/home" component={Home}/>
        //                         <Route path="/category" component={Category}/>
        //                         <Route path="/product" component={Product}/>
        //                         <Route path="/role" component={Role}/>
        //                         <Route path="/user" component={User}/>
        //                         <Route path="/charts/bar" component={Bar}/>
        //                         <Route path="/charts/line" component={Line}/>
        //                         <Route path="/charts/pie" component={Pie}/>
        //                         <Redirect to="/home"/>
        //                     </Switch>
                        
        //                 </Content>
        //                 <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器</Footer>
        //             </Layout>
        //         </Layout> 
            
            



        // )
        return (
            <Layout style={{minHeight: '100%'}}>
              <Sider>
                <LeftNav/>
              </Sider>
              <Layout>
                <Header>Header</Header>
                <Content style={{margin: 20, backgroundColor: '#fff',height:'100%'}}>
                  <Switch>
                    <Redirect from='/' exact to='/home'/>
                    <Route path='/home' component={Home}/>
                    <Route path='/category' component={Category}/>
                    <Route path='/product' component={Product}/>
                    <Route path='/user' component={User}/>
                    <Route path='/role' component={Role}/>
                    <Route path="/charts/bar" component={Bar}/>
                    <Route path="/charts/pie" component={Pie}/>
                    <Route path="/charts/line" component={Line}/>
                    
                  </Switch>
                </Content>
                <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
              </Layout>
            </Layout>
          )
    }
}
// const Admin =()=>{
//     const handler=()=>{
//         this.props.history.push("/login")
//     }

//     return(
//             <div>
//                      <button onClick={handler}>click</button>
                    
//              </div>
//     )
// }
// export default Admin