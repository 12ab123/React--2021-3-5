import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Button, Layout } from 'antd'

import {createDeleteUserInfoAction} from '../../redux/action_creators/login_action'
import Leftnav from './left_nav/left_nva'
// import {reqCategoryList} from '../../api/index'
import './css/admin.less'
import Header from './header/header'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import AddUpdate from '../product/add_update'
import Detail from '../product/detail'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'

const {  Footer, Sider, Content } = Layout


//使用装饰器语法进行
@connect(
  state=>({userInfo:state.userInfo}),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
)

class Admin extends Component{

  logout=()=>{
    //deleteUserInfo修改了store中状态,而admin用到了store的状态,当状态改变,页面就会重新渲染,然后进入到render的判断
    this.props.deleteUserInfo()
  }


  // demo= async ()=>{
  //   let result=await reqCategoryList()
  //   console.log(result);
  // }
  
  //在render若想实现跳转,最好使用<Redirect>
  render(){
    const {user,token,isLogin} =this.props.userInfo
    if(!isLogin){
      return <Redirect to="/login" />
    }else{
      return(
        
          <Layout className="admin">
            <Sider className="sider">
              <Leftnav/>
            </Sider>
            <Layout>
              <Header className="header">Header</Header>
              <Content className="content">
                <Switch>
                  <Route path="/admin/home" component={Home}/>
                  <Route path="/admin/prod_about/category" component={Category}/>
                  <Route path="/admin/prod_about/product" component={Product} exact/>
                  <Route path="/admin/prod_about/product/detail/:id" component={Detail}/>
                  {/* 如果不传入id,走第一个,如果传入id,走第二个,如果第一个不加上严格匹配,第二个将会失效 */}
                  <Route path="/admin/prod_about/product/add_update" component={AddUpdate} exact/>
                  <Route path="/admin/prod_about/product/add_update/:id" component={AddUpdate}/>
                  <Route path="/admin/user" component={User}/>
                  <Route path="/admin/role" component={Role}/>
                  <Route path="/admin/charts/bar" component={Bar}/>
                  <Route path="/admin/charts/line" component={Line}/>
                  <Route path="/admin/charts/Pie" component={Pie}/>
                  <Redirect to="/admin/home"/>
                </Switch>
              </Content>
              <Footer className="footer">
                推荐使用谷歌浏览器,获取最佳用户体验
              </Footer>
            </Layout>
          </Layout>
        
      )
    }
  }
}

export default Admin


/*
@decorator
class A {}
                                装饰器原理
// 等同于
class A {}
A = decorator(A) || A;

*/

/*
  使用装饰器
    yarn add @babel/plugin-proposal-decorators
    然后配置config-overrides.js文件即可使用
*/

//connect函数: 往connect函数中传入参数会得到一个返回值,返回值为函数,然后再往函数内传入组件(组件是类,类是函数),得到一个新的组件
//也就是说往connect函数内传入参数,得到一个函数,往函数内传入一个函数作为参数,得到一个新的函数(高级函数,高阶组件)


