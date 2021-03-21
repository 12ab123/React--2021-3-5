import React, { Component } from 'react'
import { Menu, Button } from 'antd';
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
// import {
//     AppstoreOutlined,
//     HomeOutlined,
//     UnorderedListOutlined,
//     ToolOutlined,
//     UserOutlined,
//     SafetyCertificateOutlined,
//     AreaChartOutlined,
//     BarChartOutlined,
//     LineChartOutlined,
//     PieChartOutlined
//   } from '@ant-design/icons';
  
import logo from '../../../static/img/logo.png'
import './css/left_nav.less'
import navMenu from '../../../config/menu_config'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'

const { SubMenu,Item } = Menu;
@connect(
    state=>({
        menus:state.userInfo.user.role.menus,
        username:state.userInfo.user.username
    }),
    {
        saveTitle:createSaveTitleAction
    }
)
@withRouter
 class leftNav extends Component {

    // state = {
    //     menus: this.
    // }


    //动态生成菜单
    createMeun=(target)=>{
       return  target.map((item)=>{
        if(this.hasAuth(item)){
            if(!item.children){
                return (
                    //                                              onClick不能传参
                    <Item key={item.key} icon={item.icon} onClick={()=>{this.props.saveTitle(item.title)}}>
                        <Link to={item.path}>
                            {item.title}
                        </Link>
                    </Item>
                )
            }else{
               return <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.createMeun(item.children)}
                      </SubMenu>
            }
            }     
        })
    }

    //校验菜单权限
    hasAuth=(item)=>{
        const {username,menus} =this.props
        if(username === 'admin') return true
        else if(!item.children){
            return menus.find((item2)=>{return item2 === item.key})
        }else if(item.children){
            return item.children.some((item3)=>{return menus.indexOf(item3.key) !== -1})
        }
    }
   
    render() {
        let {pathname}=this.props.location
        return (
        <div>
            <header className="nav-header">
                <img src={logo} alt=""/>
                <h1>商品管理系统</h1>
            </header>


            <Menu
            selectedKeys={pathname.indexOf('product')!==-1?'product':pathname.split('/').reverse()[0]}
            defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
            mode="inline"
            theme="dark"
            >

                {
                   this.createMeun(navMenu)
                }
                
            
           
                {/* <SubMenu key="prod_about" icon={<AppstoreOutlined />} title="商品">
                <Item key="category" icon={<UnorderedListOutlined />}>
                    <Link to="/admin/prod_about/category">
                        分类管理
                    </Link>
                </Item>
                <Item key="product" icon={<ToolOutlined />}>
                    <Link to="/admin/prod_about/product">
                        商品管理
                    </Link>
                </Item>
                </SubMenu> */}
        </Menu>
      </div>
        )
    }
}

export default leftNav