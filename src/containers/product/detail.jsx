import React,{Component} from 'react'
import { Card,Button,List, message } from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons'
import {connect} from 'react-redux'
import './detail.less'
import {reqProductById,reqCategoryList} from '../../api/index'
import {BASE_URL} from '../../config/index'
const {Item}=List

@connect(
    state=>({
        productList:state.productList,
        categoryList:state.categoryList
    }),

)
class Detail extends Component{

    state={
        categoryId:'',
        categoryName:'',
        detail:'',
        price:'',
        desc:'',
        name:'',
        imgs:'',
        isLoading:true
    }

    componentDidMount(){
        const reduxCategoryList=this.props.categoryList
        const reduxProdList=this.props.productList
        //当在此页面刷新时,redux为0,此时我们发送请求
        if(reduxProdList.length){
            //从redux中查询id相等的数据
            let result=reduxProdList.find((item)=>{
                return item._id===this.props.match.params.id
            })
            if(result){
                //由于this.setState是一个异步的操作,在下面使用商品所属的分类id获取分类时会拿不到,所以要先将商品所属的分类id放入this中
                this.categoryId=result.categoryId
                this.imgs=result.imgs
                const {categoryId,detail,price,desc,name,imgs}=result
                this.setState({categoryId,detail,price,desc,name,imgs,isLoading:false})
            }
        }else{
            this.getById(this.props.match.params.id)
        }

        if(reduxCategoryList.length){
            // console.log(reduxProdList);
            let result = reduxCategoryList.find((item)=>{
                return item._id===this.categoryId
            })
            if(result) this.setState({categoryName:result.name})
        }else{
            this.getCategoryList()
        }

    }
    getById=async(id)=>{
        let result=await reqProductById(id)
        const {status,data,msg}=result
        if(status===0){
            this.categoryId=data.categoryId
            this.imgs=data.imgs

            const {categoryId,detail,price,desc,name,imgs}=data
            this.setState({categoryId,detail,price,desc,name,imgs})
        }else{
            message.error(msg,1)
        }
    }

    getCategoryList=async()=>{
        let result = await reqCategoryList()

        const {status,data,msg} = result
        if(status===0){
            let result=data.find((item)=>{
                return item._id === this.categoryId
            })
            if(result){
                this.setState({categoryName:result.name,isLoading:false})
            
            }
        }else{
            message.error(msg,1)
        }
    }

    demo=()=>{
        if(this.imgs){
            console.log(this.imgs);
            return this.imgs.map((item,index)=>{
                return <img key ={index} src={`${BASE_URL}/upload/${item}`} alt="商品图片" style={{width:"200px"}}/>
            })
        }else{
            return 
        }
    }
    render(){
        const imgs = this.imgs
        return(
          <Card 
          title={<Button onClick={()=>{this.props.history.goBack()}} type="link"><ArrowLeftOutlined style={{color:"#1DA57A",fontSize:'12px'}} />商品详情</Button>}
          loading={this.state.isLoading}
         >

            <List>
                <Item className="item">
                   <span className="prod-name">商品名称： </span>
                   <span>{this.state.name}</span>
                </Item>
                <Item className="item">
                   <span className="prod-name">商品描述： </span>
                   <span>{this.state.desc}</span>
                </Item>
                <Item className="item">
                   <span className="prod-name">商品价格： </span>
                   <span>{this.state.price}</span>
                </Item>
                <Item className="item">
                   <span className="prod-name">商品分类：</span>
                   <span>{this.state.categoryName}</span>
                </Item>
                <Item className="item">
                   <span className="prod-name">商品图片：</span>
                   
                       {
                        this.demo()
                        }
                        {/* <span>{this.state.imgs}</span> */}
                   
                </Item>
                <Item className="item">
                   <span className="prod-name">商品详情：</span>
                   {/* 将标签转换 */}
                   <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
                </Item>
            </List>

          </Card>
        )
    }
}

export default Detail