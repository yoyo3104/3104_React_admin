import React from 'react'
import './index.less'
import {formatData} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtil  from '../../utils/storageUtils'
import {reqWeather} from '../../api/index'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils';
import LinkButton from '../link-button';

class Header extends React.Component{
    state={
        currentTime:formatData(Date.now()),//当前时间的字符串
        dayPictureUrl:'',
        weather:'',
    }
    getTime =() =>{
        //每隔一秒获取当前时间并更新
        // console.log(this)
        //this 即为整个header组件 
        this.intervalId=setInterval(()=>{
            const currentTime =formatData(Date.now())
            this.setState({currentTime:currentTime})

        },1000)
    }
    getWeather= async () =>{
        //调用接口请求函数
        const {dayPictureUrl,weather} =await reqWeather('上海')
        this.setState({
            dayPictureUrl:dayPictureUrl,
            weather:weather
        })
    }
    getTitle =() =>{
        const path =this.props.location.pathname;
       
        let title;
        menuList.forEach(item =>{
            if(item.key ===path) {
                title =item.title
            }else if(item.children) {
                const cItem= item.children.find(cItem =>path.indexOf(cItem.key)===0)//返回符合测试条件的第一个数组元素值cItem =>cItem.key ===path
                if(cItem) {
                    title =cItem.title
                }
            }
        })
        return title
    }
    /**
     * 退出登录
     */
    logOut =() =>{
       Modal.confirm(
        {
            title: '确定退出吗?',
            icon: <ExclamationCircleOutlined />,
            onOk:()=> {
          //删除保存的user数据
          storageUtils.removeUser()
          memoryUtils.user={}

          //跳转到login
            this.props.history.replace('/login');
            },
           
          }
       )
    }
     
     
        // this.setState({
        //     dayPictureUrl:dayPictureUrl,
        //     weather:weather,
        // })

   
    //在第一次render之后执行 一般在此执行异步操作 发ajax 还有定时器
    componentDidMount(){
        this.getTime();
        this.getWeather();
        
    }
    /**
     * 当前组件卸载之前调用
     */
    componentWillUnmount(){
        console.log(this)
        clearInterval(this.intervalId);

    }
    render(){
        const {currentTime,dayPictureUrl,weather} =this.state;
        const username =memoryUtils.user.username;
        const title =this.getTitle();
        // console.log(title)
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                    {title}
                    </div>
                    <div className="header-bottom-right">
                    <span>{currentTime}</span>
                    <img src={dayPictureUrl} alt="weather"/>
                    <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)
