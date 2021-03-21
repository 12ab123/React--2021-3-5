//配置项目中所有的请求
//项目中所有的请求从这里发出
import {BASE_URL,WEATHER_CITY} from '../config/index'
import jsonp from 'jsonp'
import {message} from 'antd'

import myAxios from './myAxios'


//发起登录请求
export const reqLogin=(values)=> myAxios.post(`${BASE_URL}/login`,values)


//获取商品列表
export const reqCategoryList=()=> myAxios.get(`${BASE_URL}/manage/category/list`)

//获取天气
export const reqWeather=()=>{
   
   return new Promise((resolve,reject)=>{
    jsonp(`http://wthrcdn.etouch.cn/weather_mini?city=${WEATHER_CITY}`,(err,data)=>{
        if(err){
            message.error('请求天气失败')
            return new Promise(()=>{})
        }else{
            resolve(data.data.forecast[0])
        }
    })
   })
   
}

//新增商品的分类
export const reqAddCategory=({categoryName})=>myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})

//更新一个商品分类
export const reqUpdateCategory=(categoryObj)=>myAxios.post(`${BASE_URL}/manage/category/update`,categoryObj)


//请求商品分页列表
export const reqProductList=(pageNum,pageSize)=>myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})

//请求更新商品状态
export const reqUpdateProductState=(productId,status)=>myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})

//请求搜索关键字后的商品
export const reqSearchProduct=(pageNum,pageSize,searchType,keyWord)=>{

    console.log(pageNum,pageSize,searchType,keyWord);
    if(searchType==='name'){
        return myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,productName:keyWord}})
    }else{
        return myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,productDesc:keyWord}})
    }
}



//根据商品id获取商品信息
export const reqProductById=(productId)=>myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})


//根据图片名删除图片
export const reqDeletePicture=({name})=>myAxios.post(`${BASE_URL}/manage/img/delete`,{name})


//请求添加商品
export const reqAddProduct=(productObj)=>myAxios.post(`${BASE_URL}/manage/product/add`,{...productObj})


//请求更改商品
export const reqUpdateProduct=(productObj)=>myAxios.post(`${BASE_URL}/manage/product/update`,{...productObj})


//获取角色权限
export const reqRoleList=()=>myAxios.get(`${BASE_URL}/manage/role/list`)


//请求添加角色
export const reqAddRole=(roleName)=>myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})


//请求给角色授权
export const reqUpdateRole=(roleObj)=>myAxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,auth_time:Date.now()})


//请求获取所有用户列表
export const reqUserList=()=>myAxios.get(`${BASE_URL}/manage/user/list`)


//请求添加用户
export const reqAddUser=(userObj)=>myAxios.post(`${BASE_URL}/manage/user/add`,{...userObj})


//请求修改用户
export const reqUpdateUser=(userObj)=>myAxios.post(`${BASE_URL}/manage/user/update`,{...userObj})

//请求删除用户
export const reqDeleteUser=(userId)=>myAxios.post(`${BASE_URL}/manage/user/delete`,{...userId})

