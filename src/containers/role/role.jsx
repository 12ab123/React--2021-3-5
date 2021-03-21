import React,{Component, useState} from 'react'
import { Modal, Button, Card, Table, message, Input, Form, Tree } from 'antd';
import dayjs from 'dayjs'
import {connect} from 'react-redux'

import { reqRoleList, reqAddRole, reqUpdateRole } from '../../api/index'
import  menuConfig from '../../config/menu_config.js'
const {Item} = Form


@connect(
    state => ({userName: state.userInfo.user.username}),
    {}
)
class Role extends Component{
    state ={
        visible: false,
        authVisible: false,
        roleList: [],
        menuList: [],
        //setExpandedKeys: ['0-0-0', '0-0-1'],        //配置默认打开那些节点(子节点)
        //setAutoExpandParent:true,                   //配置默认是否打开父节点(最大节点)
        setCheckedKeys: [],                   //配置默认选择那些节点

        _id: '',                                //当前操作权限的角色id
    }

    componentDidMount(){
        this.getRoleList()

        //获取树形菜单的数据
        let menuList = [{
            title: '平台功能',
            key: 'top',
            children: menuConfig
        }]

        this.setState({menuList})
    }

    formRef=React.createRef()

    //获取角色列表
    getRoleList=async()=>{
        let result = await reqRoleList()
        const {data,status,msg} = result
        if(status === 0){
            // data.map(item=>item.key=item._id)
            this.setState({roleList:data})
        }else{
            message.error(msg,1)
        }

    }


    
    //新增角色 ----- 点击对话框确定事件
    handleOk = async() => {
        try {
            //判断数据是否校验成功,失败抛出错误
            const values = await this.formRef.current.validateFields();
            let result = await reqAddRole(values.authName)
            const {status,data,msg} = result
            if(status === 0){
                message.success('角色添加成功',1)
                let roleList=[...this.state.roleList]
                // data.key = data._id
                roleList.unshift(data)
                this.setState({roleList})
                this.setState({visible:false})
                this.formRef.current.resetFields()

            }else{
                message.error(msg,1)
            }

        } catch (errorInfo) {
            message.warn('提交校验失败')
        }
      };
    
    //新增角色 ----- 点击对话框取消事件
    handleCancel = () => {
        this.setState({visible:false})
        this.formRef.current.resetFields()
      };


    //用于展示新增弹窗
    showAdd = ()=>{
        this.setState({visible:true})
    }
    

    //授权弹窗 ------ 确定
    handAuthOk = async () => {
        const {_id,setCheckedKeys} = this.state
        const {userName} = this.props
        let result = await reqUpdateRole({_id,menus:setCheckedKeys,auth_name:userName})
        const {status,data,msg} = result
        if(status === 0){
            message.success('授权成功',1)
            this.setState({authVisible:false})
            this.getRoleList()
        }else{
            message.error(msg,1)
        }

    }

    //授权弹窗 ------ 取消
    handAuthCancel = () => {
        this.setState({authVisible:false})

    }


    //用于展示授权弹窗
    showAuth=(_id)=>{
        const {roleList} = this.state
        let result = roleList.find((item)=>{
            return item._id === _id
        })

        if(result){
            this.setState({setCheckedKeys:result.menus})
        }
        this.setState({authVisible:true,_id:_id})
    }


    /* ---------------- tree ----------------- */


        //收缩或展开菜单的回调
    onExpand = (expandedKeysValue) => {
        this.setState({setExpandedKeys:expandedKeysValue})
        this.setState({setAutoExpandParent:false})
      };
    
      //选择
    onCheck = (checkedKeysValue) => {
        this.setState({setCheckedKeys:checkedKeysValue})
      };
    

    


    render(){
        const dataSource = this.state.roleList
          
        const columns = [
            {
              title: '角色名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              key: 'create_time',
            //   time是dateIndex所给的
              render:time=> dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
            },
            {
              title: '授权时间',
              dataIndex: 'auth_time',
              key: 'auth_time',
              render:time=> time? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : ''

            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name',

            },
            {
                title: '权限',
                key: 'menus',
                render: (item)=>{return <Button type="link" onClick={()=>{this.showAuth(item._id)}}>设置权限</Button>}
            },
          ];


          
        return (
            <div>
                <Card title={<Button type="primary" onClick={this.showAdd}>新增角色</Button>}>
                    <Table bordered rowKey="_id"  dataSource={dataSource} columns={columns} />;
                </Card>
                
                {/* 新增角色弹窗 */}
                <Modal 
                    title="新增角色" 
                    visible={this.state.visible} 
                    onOk={this.handleOk} 
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form
                        initialValues={{
                        remember: true,
                        }}
                        ref = {this.formRef}

                    >
                        <Item
                        name="authName"
                        rules={[
                            {required: true, message: '角色名必须输入！'},                            
                        ]}
                        >
                            <Input placeholder="请输入角色名" />
                        </Item>        
                    </Form>
                </Modal>
            
                {/* 设置权限弹窗 */}
                <Modal 
                    title="设置权限" 
                    visible={this.state.authVisible} 
                    onOk={this.handAuthOk} 
                    onCancel={this.handAuthCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    
                       {/* tree */}
                        <Tree
                        checkable       //允许选择
                        onExpand={this.onExpand}
                        //expandedKeys={this.state.setExpandedKeys}     //一上来就展开谁
                        //autoExpandParent={this.state.setAutoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.setCheckedKeys}
                        defaultExpandAll        //展开所有节点

                        treeData={this.state.menuList}
                        />
                    
                </Modal>
            
                
            </div>
        )
    }
}

export default  Role