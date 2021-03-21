import React,{Component} from 'react'
import { Card,Button,message,Form, Input,Select } from 'antd';
import {connect} from 'react-redux'
import {ArrowLeftOutlined} from '@ant-design/icons'

import {reqCategoryList} from '../../api/index'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'
import {reqAddProduct,reqProductById,reqUpdateProduct} from '../../api/index'
const {Item} = Form
const {Option} = Select

@connect(
    state=>({
        categoryList:state.categoryList,
        productList:state.productList
    }),
    {

    }
)
 class AddUpdate extends Component{

    state={
        categoryList:[],            //商品分类的列表
        operType:'add',             //操作类型(添加类型和修改类型)
        categoryId:'',
        name:'',
        desc:'',
        price:'',
        detail:'',
        imgs:[],
    }



    componentDidMount(){
        const {id} = this.props.match.params
        const {productList,categoryList} = this.props
        if(categoryList.length){
            this.setState({categoryList})
        }else{
            this.getCategoryList()
        }

        //判断是否由参数id传入
        if(id){
            this.setState({operType:'update'})
            if(productList.length){
                let result = productList.find((item)=>{
                    return item._id === id
                })
                if(result){
                    this.setState({...result})
                    this.refs.formList.setFieldsValue({...result})
                    //如果是修改商品回显图片
                    this.pictureswall.setFileList(result.imgs)
                    //如果是修改商品回显富文本
                    this.richtexteditor.setRichText(result.detail)
                }else{
                    message.error('没有该商品',1)
                }
            }else{
                this.getProductList(id)
            }
        }

    }

    getProductList=async(id)=>{
        let result = await reqProductById(id)
        const {status,data,msg} = result
        if(status === 0){
            this.setState({...data})
            this.refs.formList.setFieldsValue({...data})
            //如果是修改商品回显图片
            this.pictureswall.setFileList(data.imgs)
            //如果是修改商品回显富文本
            this.richtexteditor.setRichText(data.detail)
        }
    }

    //如果redux中没有商品列表就向服务器发请求获取商品列表
    getCategoryList=async()=>{
        let result = await reqCategoryList()
        const {status,data,msg}=result
        if(status===0){
            this.setState({categoryList:data})
        }else{
            message.error(msg,1)
        }
    }

    onFinish = async(values)=>{
        //从上传组件中获取已经上传的图片数组
        let imgs = this.pictureswall.getImgArr()
        //从富文本组件中获取用户输入的文字转换为富文本的字符串
        let detail = this.richtexteditor.getRichText()
        let result
        let {operType,_id} = this.state
        if(operType === 'update'){
            console.log({...values,imgs,detail,_id});
            result = await reqUpdateProduct({...values,imgs,detail,_id})
        }else{
            result = await reqAddProduct({...values,imgs,detail})
        }
        const {data,status,msg} = result
        if(status===0){
            message.success('操作商品成功',1)
            this.props.history.replace('/admin/prod_about/product')
        }else{
            message.error('商品添加失败',1)
        }
    }

    onFinishFailed=()=>{
        message.error('表单验证失败')

    }





    render(){
        return(
          <Card title={
              <div>
                  <Button type="link" onClick={this.props.history.goBack}>
                  <ArrowLeftOutlined />
                  <span>返回</span>
                  </Button>
                  <span>{this.state.operType === 'update'? '商品修改' : '商品添加'}</span>
              </div>
          }

          >
            <Form
                labelCol={{md:2}}
                wrapperCol={{md:7}}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                ref = "formList"
            >
                <Form.Item initialValue={this.state.name || ''} name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
                    <Input placeholder="商品名称"/>
                </Form.Item>

                <Form.Item initialValue={this.state.desc || ''} name="desc" label="商品描述"  rules={[{ required: true, message: '请输入商品描述' }]}>
                    <Input placeholder="商品描述"/>
                </Form.Item>

                <Form.Item initialValue={this.state.price || ''} name="price" label="商品价格" rules={[{ required: true, message: '请输入商品价格' }]}>
                    <Input type="number" addonAfter="元" addonBefore="￥" placeholder="商品价格"/>
                </Form.Item>

                <Form.Item initialValue={this.state.categoryId || ''} name="categoryId" label="商品分类" rules={[{ required: true, message: '请输入商品分类' }]}>
                    
            
                    <Select>
                        <Option value="">请选择分类</Option>
                        {
                                this.state.categoryList.map((item)=>{
                                    return (
                                        <Option value={item._id} key={item._id}>{item.name}</Option>
                                    )
                                })
                        }
                    </Select>
                    
                </Form.Item>

                <Form.Item  name="imgs" wrapperCol={{md:12}} label="商品图片" >
                    
                    <PicturesWall onRef={ node => this.pictureswall = node }/>
                </Form.Item>

                <Form.Item initialValue={this.state.detail || ''} name="detail" wrapperCol={{md:16}} label="商品详情" >
                    <RichTextEditor onRef={ node => this.richtexteditor = node }/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                    提交
                    </Button>
                </Form.Item>
            </Form>
          </Card>
        )
    }
}

export default AddUpdate