import React,{Component} from 'react'
import {Form,Input,Button, message} from 'antd';
import {UserOutlined,LockOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'


import {createSaveUserInfoAction} from '../../redux/action_creators/login_action'
//但文件夹中有index.js文件时,不需要写index.js文件,只需要写文件夹即可
import {reqLogin} from '../../api/index'      //引入请求文件
import './css/login.less'
import logo from './imgs/logo.png'
const {Item} = Form



 class Login extends Component{

  //当提交表单判断校验数据
  formRef=React.createRef()
  onCheck = async () => {
	  try {
      //判断数据是否校验成功,失败抛出错误
	    const values = await this.formRef.current.validateFields();

      let result = await reqLogin(values)
      const {status,data,token} =result
      if(status===0){
        console.log(result);
        //先将从服务器得到的数据放入到store中保存,再跳转
        this.props.saveUserInfo({data,token})
        //如果状态为0,那么就可以登录,跳转到admin
        this.props.history.replace('/admin')
      }else{
        message.error('用户或密码错误',1)
      }
  
	  } catch (errorInfo) {
	    console.log('Failed:', errorInfo);
	    message.warn('提交校验失败')
	  }
    // console.log(this.formRef);
	}

  //点击表单按钮,发送请求

  // onFinish = async (values) => {
  //   /*
  //       由于我们使用的是配置代理解决跨域
  //       也就是在本地弄了一个中转人,我们将ajax请求发给中转人,中转人将请求发给服务器
  //       服务器再将响应发给中转人,最后中转人将响应发给我们
  //       所以在此处,post请求地址该写中转人,由于中转人在本地,所以将请求发给本地即可
  //   */  
    
  //   // reqLogin(values)
  //   // .then((value)=>{
  //   //   console.log(value);
  //   // })
  //   // .catch((error)=>{
  //   //   console.log(error);
  //   // })
  //   let result = await reqLogin(values)
  //   const {status} =result
  //   if(status===0){
  //     //如果状态为0,那么就可以登录,跳转到admin
  //   }else{
  //     message.error('用户或密码错误',1)
  //   }

    
    
  // };

  //密码的验证器---每当在密码输入框输入东西后，都会调用此函数去验证输入是否合法。自定义校验，即：自己写判断
 
  pwdValidator = (rule,value)=>{
    if(!value){
      return Promise.reject('密码必须输入')
    }else if(value.length>12){
      return Promise.reject('密码必须小于等于12位')
    }else if(value.length<4){
      return Promise.reject('密码必须大于等于4位')
    }else if(!(/^\w+$/).test(value)){
      return Promise.reject('密码必须是字母、数字、下划线组成')
    }else{
      return Promise.resolve()
    }
  }

  componentDidMount(){
    // console.log(this.props);
  }

  
  render(){
    const {isLogin}=this.props
    console.log(this.props);
    //如果已经登录了,跳转到admin页面
    if(isLogin){
      return <Redirect to="/admin"/>
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form
            name="normal_login"
            className="login-form"
            ref={this.formRef}
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Item
              name="username"
              rules={[
                {required: true, message: '用户名必须输入！'},
                {max: 12, message: '用户名必须小于等于12位'},
                {min: 4, message: '用户名必须大于等于4位'},
                {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'},
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Item>

            <Item
              name="password"
              rules={[
                {validator:this.pwdValidator}
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Item>
           
            <Item>
              <Button onClick={this.onCheck} type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Item>
          </Form>
         </section>
      </div>
    )
  }
}


export default connect(
  state=>({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:createSaveUserInfoAction,
  }
)(Login)
