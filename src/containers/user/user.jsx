import React,{Component} from 'react'
import { Card, Button, Table, Modal,Form, Input, Select, message  } from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'

import {PAGE_SIZE} from '../../config/index'
import {reqUserList, reqAddUser, reqUpdateUser, reqDeleteUser} from '../../api/index'

const {Item} = Form
const {Option} = Select

export default class User extends Component{
    state={
        visible:false,                  //是否展示新增弹窗
        userList: [],                   //用户列表
        roleList: [],                   //角色列表
        id: '',                         //当前操作删除或修改的用户id
        updateVisible:false,            //是否展示修改提示框
        updateUser:{},                  //用于将修改用户的信息回显
        deleteVisible:false,            //是否展示删除提示框
        deleteText:''                   //删除的用户名
    }

    formRef = React.createRef()
    // updateFormRef = React.createRef()


    componentDidMount(){
        this.getUserList()
    }

    getUserList=async()=>{
       let result = await reqUserList()
       const {data,status,msg} = result
        if(status === 0){
            this.setState({
                userList:data.users,
                roleList:data.roles
            })
        }

    }


//  ---------- 新增用户 ----------
    showModal = () => {
        this.setState({visible:true})
      };
    
    handleOk = async() => {
        try{
            const values = await this.formRef.current.validateFields();
            let result = await reqAddUser(values)
            const {status,data,msg} = result
            if(status === 0){
                let userList = [...this.state.userList]
                userList.unshift(data)
                this.setState({userList})
                this.setState({visible:false})
                message.success('添加用户成功',1)
                this.formRef.current.resetFields()
            }else{
                message.error(msg,1)
            }
        }catch(error){
            message.warn('提交校验失败',1)
        }

      };
    
    handleCancel = () => {
        this.setState({visible:false})

      };
    


    //  ---------- 修改用户 ----------

    updateUser=(id)=>{
        this.setState({id,updateVisible:true})
        let {userList} = this.state
        let result = userList.find((item)=>{
            return item._id === id
        })
        this.setState({updateUser:result})

        
    }


    updateHandleOk= async() => {
        try{
            const values = await this.updateFormRef.validateFields();
            const {id} = this.state
            values._id = id
            let result = await reqUpdateUser({...values})
            const {status,data,msg} = result
            if(status === 0){
                let  userList = [...this.state.userList]
                userList.map((item)=>{
                    if(item._id === data._id){
                        item = Object.assign(item , data)
                    }
                })
                this.setState({userList})
                this.setState({updateVisible:false})
            }else{
                message.error(msg,1)
            }
        }catch(error){
            message.error('校验失败' ,1)
        }


      };

    
    updateHandleCancel = () => {
        this.setState({updateVisible:false})

      };




    // ---------- 删除用户 -----------
    deleteUser=(id)=>{
        const {userList} = this.state
        userList.find((item)=>{
            if(item._id===id){
                this.setState({deleteText:item.username,})
            }
        })
        this.setState({deleteVisible:true,id})

    }

    deleteHandleOk = async()=>{
        let result = await reqDeleteUser({userId:this.state.id})
        const {data,status,msg} = result
        if(status === 0){
            message.success('删除用户成功',1)
            let userList = [...this.state.userList]
            userList = userList.filter((item)=>{
                return item._id !== this.state.id
            })
            this.setState({userList})
        }else{
            message.error('删除用户失败',1)
        }
        this.setState({deleteVisible:false})

    }

    deleteHandleCancel = ()=>{
        this.setState({deleteVisible:false})

    }


    render(){
        const dataSource = this.state.userList;
          
          const columns = [
            {
              title: '用户名',
              dataIndex: 'username',
              key: 'username',
            },
            {
              title: '邮箱',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: '电话',
              dataIndex: 'phone',
              key: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(time)=>dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                key: 'role_id',
                render:(id)=>{
                    let result = this.state.roleList.find((item)=>{
                        return item._id === id
                    })
                    if(result){
                        return result.name
                    }
                }
            },
            {
                title: '操作',
                key: 'option',
                render:(item)=>{
                    return (
                        <div>
                            <Button type="link" onClick={()=>{this.updateUser(item._id)}}>修改</Button>
                            <Button type="link" onClick={()=>{this.deleteUser(item._id)}}>删除</Button>
                        </div>
                    )
                }
            },

          ];
          
        return (
            <div>
                <Card title={<Button type="primary" onClick={this.showModal}><PlusOutlined />创建用户</Button>}>
                    <Table 
                    dataSource={dataSource} 
                    columns={columns}
                    bordered
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowKey = "_id"      //以数据中的_id为唯一标识符
                     />;
                </Card>


                {/* ------ 新增角色提示框 -------  */}
                <Modal 
                title="创建用户" 
                visible={this.state.visible} 
                onOk={this.handleOk} 
                onCancel={this.handleCancel}
                >
                    <Form
                        name="userAdd"
                        ref = {this.formRef}
                        initialValues={{ remember: true }}
                        layout = "horizontal"
                        labelAlign = "left"
                        labelCol = {{span:4}}
                        wrapperCol = {{span:16}}
                        >
                        <Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '用户名必须输入' }]}
                        >
                            <Input  placeholder="请输入用户名"/>
                        </Item>

                        <Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '密码必须输入' }]}
                        >
                            <Input.Password  placeholder="请输入密码"/>
                        </Item>

                        <Item
                            label="手机号"
                            name="phone"
                            rules={[{ required: true, message: '手机号必须输入' }]}
                        >
                            <Input  placeholder="请输入手机号"/>
                        </Item>

                        <Item
                            label="邮箱"
                            name="email"
                            rules={[{ required: true, message: '邮箱必须输入' }]}
                        >
                            <Input  placeholder="请输入邮箱"/>
                        </Item>

                        <Item
                            label="角色"
                            name="role_id"
                            rules={[{ required: true, message: '角色必须选择' }]}
                        >
                            <Select defaultValue=''>
                                <Option value=''>请选择一个角色</Option>
                                {
                                    this.state.roleList.map((item)=>{
                                        return <Option value={item._id} key={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </Item>

                    </Form>
                </Modal>
            
                {/* ------ 修改用户提示框 -------  */}
                <Modal 
                title="修改用户" 
                visible={this.state.updateVisible} 
                onOk={this.updateHandleOk} 
                onCancel={this.updateHandleCancel}
                destroyOnClose
                >
                    <Form
                        name="userUpdate"
                        ref = {(input)=>{this.updateFormRef=input}}
                        layout = "horizontal"
                        labelAlign = "left"
                        labelCol = {{span:4}}
                        wrapperCol = {{span:16}}
                        initialValues = {this.state.updateUser}
                        >
                        <Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '用户名必须输入' }]}
                        >
                            <Input  placeholder="请输入用户名"/>
                        </Item>


                        <Item
                            label="手机号"
                            name="phone"
                            rules={[{ required: true, message: '手机号必须输入' }]}
                        >
                            <Input  placeholder="请输入手机号"/>
                        </Item>

                        <Item
                            label="邮箱"
                            name="email"
                            rules={[{ required: true, message: '邮箱必须输入' }]}
                        >
                            <Input  placeholder="请输入邮箱"/>
                        </Item>

                        <Item
                            label="角色"
                            name="role_id"
                            rules={[{ required: true, message: '角色必须选择' }]}
                        >
                            <Select defaultValue=''>
                                <Option value=''>请选择一个角色</Option>
                                {
                                    this.state.roleList.map((item)=>{
                                        return <Option value={item._id} key={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </Item>

                    </Form>
                </Modal>

                <Modal
                title = '删除用户'
                visible={this.state.deleteVisible} 
                onOk={this.deleteHandleOk} 
                onCancel={this.deleteHandleCancel}
                >
                    <h1 style={{fontSize:"20px"}}>是否要删除用户<span style={{fontSize:"30px",color:"red"}}>{this.state.deleteText}</span></h1>
                </Modal>
            </div>
        )
    }
}