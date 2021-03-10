import {SAVE_USER_INFO,DELETE_USER_INFO} from '../action_types'

export const createSaveUserInfoAction=(value)=>{
    //在将数据从到store的过程中可以将数据保存到localStorage中
    localStorage.setItem('user',JSON.stringify(value.data))
    localStorage.setItem('token',JSON.stringify(value.token))

    return {type:SAVE_USER_INFO,data:value}
}


export const createDeleteUserInfoAction=()=>{
    
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    return {type:DELETE_USER_INFO}
}


