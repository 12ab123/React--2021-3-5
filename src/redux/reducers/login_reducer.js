import {SAVE_USER_INFO,DELETE_USER_INFO} from '../action_types'

/*
    首先,我们登录页面,然后会将从服务器上获取的用户的信息保存到store中,好让admin页面也可以获取到用户的信息,在这个过程中,
    我们要将数据保存到localStorage中,因为当我们刷新页面时,store的状态会刷新,变为初始状态,保存的用户的信息会消失,所以store
    的状态要先从localStorage获取,这样用户的信息就不会丢失
*/
let user=JSON.parse(localStorage.getItem('user'))
let token=JSON.parse(localStorage.getItem('token'))
let isLogin = user && token ? true : false

let initState={
    user:user?user:{},
    token:token || '',
    isLogin:isLogin
}
export default function test(preState=initState,action){
    const {type,data}=action
    let newState
    switch (type) {
        case SAVE_USER_INFO:
            newState={user:data.data,token:data.token,isLogin:true}
            return newState
        case DELETE_USER_INFO:
            newState={user:'',token:'',isLogin:false}
            return newState
        default:
            return preState
    }
}