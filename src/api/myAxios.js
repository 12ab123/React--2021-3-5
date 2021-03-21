import axios from 'axios'
import qs from 'querystring'        //将对象格式转换为urlencoded
import {message} from 'antd'
import NProgress from 'nprogress'           //该库用来设置进度条
import 'nprogress/nprogress.css'
import store from '../redux/store'
import {createDeleteUserInfoAction} from '../redux/action_creators/login_action'


//配置一个axios(在原本的axios上添加一些自定义方法)
const instance = axios.create({
    timeout:4000,           //配置超过时间,如果4秒后依然没有得到响应,就请求失败
})


//设置请求拦截器
//使用请求拦截器统一配置将请求参数转换为urlencoded格式
instance.interceptors.request.use((config)=>{

    //进度条开始
    NProgress.start()
    //从redux中获取之前保存的token
    const {token}=store.getState().userInfo
    // axios的post请求默认将参数转换为json发送给服务器
    // qs.stringify(values)    将对象转换为urlencoded格式的参数
    const {method,data}=config
    //向请求头中添加token,用于校验身份
    if(token){
        config.headers.Authorization='atguigu_'+token
    }
    //若是post请求
    if(method.toLowerCase()==='post'){
        //若传递过来的参数是对象
        if(data instanceof Object){
            //将对象转化为urlencoded格式的参数
            config.data=qs.stringify(data)
        }
    }
    return config
})

//响应拦截器
instance.interceptors.response.use(
response=>{
    //进度条停止
    NProgress.done()
    //请求成功
    return response.data
},
error=>{
    //进度条停止
    NProgress.done()
    if(error.response.status===401){
        message.error(error.response.data.message,1)
        //分发一个删除用户信息的action
        store.dispatch(createDeleteUserInfoAction())
    }else{
        //请求失败
        message.error(error.message,1)
    }
    
    //当发送请求失败时,会返回一个promise对象状态为pending,
    //然后使用await接住,如果响应,如果响应的promise状态为成功,会接住,如果状态为失败,会报错,但是,如果状态为pending,会中断promise链
    return new Promise(()=>{})
})



export default instance

