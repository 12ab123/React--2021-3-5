import React,{Component} from 'react'
import { Card,Button,Table, message,Modal,Form,Input } from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'
import {reqCategoryList,reqAddCategory,reqUpdateCategory} from '../../api/index'
import {PAGE_SIZE } from '../../config/index'

const {Item}=Form


@connect(
    state=>({}),
    {
        saveCategory:createSaveCategoryAction
    }
)
 class Category extends Component{

    state={
        categoryList:[],        //页面加载时的到的分类列表
        visible:false,          //控制展示弹窗的显示或隐藏
        operType:'',             //操作类型
        isLoading:true,         //是否处于加载中
        modalCurrentValue:'',    //弹窗显示得值---用于数据回显
        modalCurrentId:''       //弹窗的id
    }


    componentDidMount(){
        //一上来,就请求商品分类列表
        this.getCategoryList()
    }

    //获取form
    formRef=React.createRef()



    //获取商品分类列表
    getCategoryList=async()=>{
        let result =await reqCategoryList()
        this.setState({isLoading:false})

        const {status,data,msg}=result
        
        if(status===0){
            this.setState({categoryList:data.reverse()})
            //把商品分类放入redux中
            this.props.saveCategory(data)
        }else{
            message.error(msg,1)
        }
    }


      //新增分类按钮
    showAdd = () => {
        this.setState({operType:'add',visible:true,modalCurrentValue:'',modalCurrentId:''})
    }

      //修改分类按钮
    showUpdate = (item) => {
        const {_id,name} = item
        //设置弹窗标题内容和是否显示弹窗
        this.setState({operType:'update',visible:true,modalCurrentValue:name,modalCurrentId:_id})
    }
      


    

      //发送添加分类请求获取响应刷新状态
    ToAdd=async(values)=>{
        let result=await reqAddCategory(values)
        let {data,status,msg}=result
        if(status===0){
            message.success('新增商品分类成功')
            let categoryList=[...this.state.categoryList]
            categoryList.unshift(data)
            this.setState({categoryList})
            //隐藏弹窗
            this.setState({visible:false})   
            //清空输入框
            this.formRef.current.resetFields()

        }
        if(status===1)message.error(msg,1)
    }

    //发送修改分类请求刷新状态
    toUpdate=async(categoryObj)=>{
        let result = await reqUpdateCategory(categoryObj)
        const {status,msg}=result
        if(status===0){
            message.success('更新商品分类名称成功',1)
            this.getCategoryList()
            //隐藏弹窗
            this.setState({visible:false})   
            //清空输入框
            this.formRef.current.resetFields()
        }else{
            message.error(msg,1)
        }
    }


      //点击弹窗ok按钮的回调
    handleOk = async() => {  
        try {
            //判断数据是否校验成功,失败抛出错误
            const values = await this.formRef.current.validateFields();

            //判断执行类型
            if(this.state.operType==='add'){
                this.ToAdd(values)
            }
            if(this.state.operType==='update'){
                const categoryId=this.state.modalCurrentId
                const categoryName=values.categoryName
                const categoryObj={categoryId,categoryName}
                this.toUpdate(categoryObj)
            }


        } catch (errorInfo) {
            message.warn('提交校验失败')
        }
        
    }
    
      //点击弹窗取消按钮的回调
    handleCancel = () => {
        this.setState({visible:false})
        this.formRef.current.resetFields()

    }

    render(){
        const dataSource = this.state.categoryList;
          
        const columns = [
            {
              title: '姓名',
              dataIndex: 'name',
            },
            {
              title: '操作',
              //dataIndex写的是谁,render中的a就是key中的属性
              render:(item)=>{return <Button type="link" onClick={()=>{this.showUpdate(item)}}>修改分类</Button>},
              width:'25%',
              align:"center"
            },
          ];

        const {visible,operType} = this.state
        return (
            <div>
                <Card extra={<Button type="primary" onClick={this.showAdd}><PlusOutlined />添加</Button>}>
                    <Table bordered={true}
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="_id"
                    pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}
                    isLoading={this.state.isLoading}
                    />;
                </Card>

                <Modal 
                title={operType==='add'?'新增分类':'修改分类'}
                visible={visible} 
                onOk={this.handleOk} 
                onCancel={this.handleCancel}
                destroyOnClose  //此处必须要写它,它会在状态改变时重新渲染页面时渲染子组件,否则子组件不会渲染,得到的值会不准确
                okText='确定'
                cancelText="取消"
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        ref={this.formRef}
                        initialValues={{
                        remember: true,
                        }}
                    >
                        <Item
                        name="categoryName"
                        initialValue={this.state.modalCurrentValue}
                        rules={[
                            {required: true, message: '分类名必须输入！'},                            
                        ]}
                        >
                            <Input placeholder="请输入分类名" />
                        </Item>        
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Category