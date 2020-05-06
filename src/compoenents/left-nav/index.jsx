import React from 'react'
import './index.less'
import Logo from "../../assets/images/logo.png"
import {Link,withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import memoryUtils from  '../../utils/memoryUtils'
import { Menu,Icon } from 'antd';

const { SubMenu } = Menu;

 class LeftNav extends React.Component{
    hasAuth=(item)=>{
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username =memoryUtils.user.username
        //判断当前的key有没有在menu里面
         if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
             return true

         }else if(item.children){//如果用户有item的子类
             return !!item.children.find(child=>menus.indexOf(child.key)!== -1)
           
        }
         return false



    }
    // hasAuth = (item) => {
    //     const {key, isPublic} = item
    
    //     const menus = memoryUtils.user.role.menus
    //     const username = memoryUtils.user.username
    //     /*
    //     1. 如果当前用户是admin
    //     2. 如果当前item是公开的
    //     3. 当前用户有此item的权限: key有没有menus中
    //      */
    //     if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
    //       return true
    //     } else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
    //       return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
    //     }
    
    //     return false
    //   }
    getmenuNodes_map=(menuList)=>{
        return menuList.map(item=>{
            if(!item.children){
                return(
                    <Menu.Item key={item.key}>
                    <Link to={item.key}>
                      <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </Link>
                        
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu
                    key={item.key}
                    title={
                        <span>
                            <Icon type={item.key} />
                            <span>{item.title}</span>
                        </span>
                    }
                >
                   {this.getmenuNodes(item.children)}
                 
                </SubMenu>
                )
            }
        })
    }
    getmenuNodes=(menuList)=>{
        const path =this.props.location.pathname;
        return menuList.reduce((pre,item)=>{
            if(this.hasAuth(item)){
                if(!item.children){
                    pre.push((
                        <Menu.Item key={item.key}>
                        <Link to={item.key}>
                          <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                            
                        </Menu.Item>
                    ))
                } else {
                    //有没有子元素匹配的
                    const cItem =item.children.find(cItem =>path.indexOf(cItem.key)===0)
                    if(cItem){
                        console.log(this)
                        this.openKey =item.key
                    }
                 
                    pre.push((
                        <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.key} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                       {this.getmenuNodes(item.children)}
                     
                    </SubMenu>
                    ))
                }
                
               
            }
           
            return pre; 
      

    },[])
}
//第一次render之前执行一次
componentWillMount () {
    this.menuNodes =this.getmenuNodes(menuList)
}
    render(){
        // debugger
        //得到当前请求的路由路径
        const menuNodes =this.getmenuNodes(menuList)

        let path =this.props.location.pathname;
        if(path.indexOf('/product')===0){//是当前商品路由或者子路由
            path= "/product"

        }
        console.log(path);
        const openKey =this.openKey;

        return(
            <div>
                <div className="left-nav">
                    <Link to="/" className="left-nav-header">
                        <img src={Logo} alt="" />
                        <h1>基金管理后台</h1>
                    </Link>
                </div>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
     

                  
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
          
        )
    }
}
export default withRouter(LeftNav)