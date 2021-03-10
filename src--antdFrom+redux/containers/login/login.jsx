import React,{Component} from 'react'
import {Form,Input,Button} from 'antd';
import {UserOutlined,LockOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {createDemo1Action,createDemo2Action} from '../../redux/action_creators/test_action'
import './css/login.less'
import logo from './imgs/logo.png'
const {Item} = Form



 class Login extends Component{

  

  onFinish = (values) => {
    this.props.demo2('0719')
  };

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
    console.log(this.props);
  }

  render(){
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统{this.props.test}</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form
            name="normal_login"
            className="login-form"
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
              <Button type="primary" htmlType="submit" className="login-form-button">
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
  state=>({test:state.test}),
  {
    demo1:createDemo1Action,
    demo2:createDemo2Action
  }
)(Login)
