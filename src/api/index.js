/**
 * 包含接口中所有接口请求函数的模块
 */
import ajax from "./ajax"
import jsonp from 'jsonp'
import { message } from 'antd'
const BASE = ''
    //登陆
    // export function reqLogin(username,password){
    //     return ajax('/login',{username,password},'POST')
    // }
    //添加用户
    // export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')
    //删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')
    //请求用户
export const reqUsers = () => ajax(BASE + '/manage/user/list')
    //更新角色

export const reqUpdateRoles = (role) => ajax(BASE + '/manage/role/update', role, 'POST')
export const reqAddRoles = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')
    //获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
    //添加商品
export const reqAddProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
    //更新商品
    // export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')
    //searchType有两个值 一个是desc 一个是name
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', { pageNum, pageSize, [searchType]: searchName })
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
    // 获取商品分类页表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })
    //添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//获得一级二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
    //添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')
    //更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')
    //jsonp请求的接口请求
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) => {
            console.log('ooo', err, data)
            if (!err && data.status === 'success') {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                console.log(dayPictureUrl, weather)
                resolve({ weather, dayPictureUrl })
            } else {
                message.error('获取天气信息失败')
            }
        })

    })

}