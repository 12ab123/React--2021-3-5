import React,{Component} from 'react'
import './css/header.less'
import {withRouter} from 'react-router-dom'         //解决在一个普通组件中使用路由组件的api(把一个非路由组件包装成一个路由组件,可以使用路由组件上的api)
import {FullscreenOutlined,FullscreenExitOutlined} from '@ant-design/icons'
import {Button,Modal} from 'antd'
import screenfull from 'screenfull'
import {connect} from 'react-redux'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined } from '@ant-design/icons';


import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import {reqWeather} from '../../../api/index'
import menuList from '../../../config/menu_config'


@connect(
    state=>({
        userInfo:state.userInfo,
        title:state.title
    }),
    {
        deleteUser:createDeleteUserInfoAction
    }
)
@withRouter
 class Header extends Component{

    state={
        isFull:false,
        data:dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
        weatherInfo:{},
        title:''
    }

    getWeather=async()=>{
        let result=await reqWeather()
        let weather={}
        weather.wendu=result.low.split(' ')[1]+'~'+result.high.split(' ')[1]
        weather.type=result.type
        weather.fengxiang=result.fengxiang
        this.setState({weatherInfo:weather})        
    }

  

    componentDidMount(){
        //当全屏切换时会触发
        screenfull.on('change',()=>{
            let isFull=!this.state.isFull
            this.setState({isFull})
        })
        //记住,当我们切换页面时,要停止
        this.timer=setInterval(()=>{
            this.setState({data:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
        },1000)
        this.getWeather()
        //展示当前菜单名称
        this.getTitle()
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }

    //切换全屏按钮回调
    fullScreen=()=>{
        screenfull.toggle();
    }

    //点击按钮退出登录
    logOut=()=>{
        let deleteUser=this.props.deleteUser
        const {confirm}=Modal
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <Button onClick={Modal.destroyAll()}>您确定需要退出登陆吗?</Button>,
            okText:'确定',
            cancelText:'取消',
            onOk() {
                deleteUser()
            },
            
          });
    }

    //获取标题
    getTitle=()=>{
        let pathKey=this.props.location.pathname.split('/').reverse()[0]
        let title
        //如果当前地址中含有product
        if(this.props.location.pathname.indexOf('product')!==-1){
            pathKey='product'
        }
        menuList.forEach((item)=>{
            if(item.children){
                let tmp=item.children.find((ctiem)=>{
                    return ctiem.key===pathKey
                })
                //如果item.children中的key与路由中的key一样
                if(tmp){
                    title=tmp.title
                }
            }else{
                if(item.key===pathKey){
                    title=item.title
                }
            }
        })
        this.setState({title})

    }
    render(){
        let {user}=this.props.userInfo
        let {wendu,type,fengxiang}=this.state.weatherInfo

        return (
            <header className="header">
                <div className="header-top">
                    <Button size="small" onClick={this.fullScreen}>
                        {
                             this.state.isFull?<FullscreenExitOutlined />:<FullscreenOutlined />
                        }
                    </Button>
                    <span className="username">欢迎你,{user.username}</span>
                    <Button type="link" onClick={this.logOut}>退出登录</Button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {/* 判断 */}
                        {this.props.title||this.state.title}
                    </div>
                    <div className="header-bottom-right">
                        {this.state.data}&nbsp;&nbsp;
                        {/* <img src="http://api.map.baidu.com/images/weather/day/qing.png"  alt='天气信息'/> */}
                        {type} &nbsp; {wendu}  &nbsp; {fengxiang}
                    </div>
                </div>

            </header>
        )
    }
    
}

export default Header