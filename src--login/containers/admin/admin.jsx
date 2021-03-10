import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {createDeleteUserInfoAction} from '../../redux/action_creators/login_action'


class Admin extends Component{

  logout=()=>{
    //deleteUserInfo修改了store中状态,而admin用到了store的状态,当状态改变,页面就会重新渲染,然后进入到render的判断
    this.props.deleteUserInfo()
  }
  
  //在render若想实现跳转,最好使用<Redirect>
  render(){
    const {user,token,isLogin} =this.props.userInfo
    if(!isLogin){
      return <Redirect to="/login" />
    }else{
      return(
        <div>
          <div>我是Admin组件,你的名字是:{user.username}</div>
          <button onClick={this.logout}></button>
        </div>
      )
    }
  }
}

//connect函数: 往connect函数中传入参数会得到一个返回值,返回值为函数,然后再往函数内传入组件(组件是类,类是函数),得到一个新的组件
//也就是说往connect函数内传入参数,得到一个函数,往函数内传入一个函数作为参数,得到一个新的函数(高级函数,高阶组件)
export default connect(
  state=>({userInfo:state.userInfo}),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
)(Admin)
