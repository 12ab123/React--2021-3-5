import React,{Component} from 'react'
import { Card,Button,Select,Input,Table, message   } from 'antd';
import {connect} from 'react-redux'
import {PlusOutlined,SearchOutlined} from '@ant-design/icons'
import {reqProductList,reqUpdateProductState,reqSearchProduct} from '../../api/index'
import {PAGE_SIZE} from '../../config/index'
import {createSaveProductAction} from '../../redux/action_creators/product_action'
const { Option } = Select;

@connect(
    state=>({}),
    {
        saveProduct:createSaveProductAction
    }
)

 class Product extends Component{

    state={
        productList:[],         //商品列表数据(进行过分页)
        current:1,              //当前在那一页
        total:'',                //一个多少数据,antd中的分页器会自动按照每页显示的条数和一共多少条数显示多少页
        keyWord:'',              //搜索关键词
        searchType:'name',              //搜索的类型
    }

    componentDidMount(){
        this.getProductList()
    }

    getProductList=async(pageNum=1)=>{
        let result
        if(this.isSearch){
            const {searchType,keyWord}=this.state
            result=await reqSearchProduct(pageNum,PAGE_SIZE,searchType,keyWord)
        }else{
            result =await reqProductList(pageNum,PAGE_SIZE)
        }
        const {data,msg,status}=result
        if(status===0){
            this.setState({
                productList:data.list,
                total:data.total,
                current:data.pageNum
            })
            //把获取到的商品列表存入redux中
            this.props.saveProduct(data.list)
        }else{
            message.error(msg,1)
        }
    }

    //更改商品是否上架
    updateRroductState= async({_id,status})=>{
        let productList=[...this.state.productList]
        if(status===1){
            status=2
        } 
        else {status=1}
        let result = await reqUpdateProductState(_id,status)
        if(result.status===0){
            message.success('更新商品状态成功')
            productList=productList.map((item)=>{
                if(item._id===_id){
                    item.status=status
                }
                return item
            })
            this.setState({productList})
        }else{
            message.error(result.msg)
        }
    }


    search=async()=>{
        this.isSearch=true
        this.getProductList()
    }
    




    render(){
        const dataSource =this.state.productList
          
          const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
              key: 'desc',
            },
            {
              title: '价格',
              width:'10%',
              dataIndex: 'price',
              align:'center',
              key: 'price',
              //dataIndex如何写,就将写的数据传入,不写,就将整个数据转你
              render:(price)=>'$'+price
            },
            {
              title: '状态',
              width:'10%',
            //   dataIndex: 'status',
              key: 'status',
              align:'center',
              render:(item)=>{
                return (
                    <div>
                        <Button 
                            type={item.status===1?'danger':'primary'}
                            onClick={()=>{this.updateRroductState(item)}}
                        >
                            {item.status===1?'下架':'上架'}
                        </Button><br/>
                        {item.status===1?'在售':'已停售'}
                    </div>
                )
              }
            },
            {
              title: '操作',
              width:'10%',
            //   dataIndex: 'opera',
              align:'center',
              key: 'opera',
              render:(item)=>{
                  return (
                      <div>
                          <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br/>
                          <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
                      </div>
                  )
              }
            },
          ];
          
        return (
            <Card 
            title={
            <div>
                {/*Select发生onchange时传入的参数是值,而input传入的是event  */}
                <Select defaultValue="name" onChange={(value)=>{this.setState({searchType:value})}}>
                    <Option value="name">按名称搜索</Option>
                    <Option value="desc">按描述搜索</Option>
                </Select>
                <Input 
                style={{margin:"0 20px",width:"200px"}} 
                placeholder="请输入搜索关键字" 
                allowClear
                onChange={(event)=>{this.setState({keyWord:event.target.value})}}
                />
                <Button type="primary" onClick={this.search}><SearchOutlined />搜索</Button>
            </div>
            }
            extra={<Button type="primary" onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}><PlusOutlined />添加</Button>}
            >
                <Table 
                dataSource={dataSource} 
                columns={columns} 
                bordered
                rowKey="_id"
                pagination={{
                    total:this.state.total,
                    pageSize:PAGE_SIZE,
                    current:this.state.current,
                    onChange:this.getProductList
                }}
                />
            </Card>
        )
    }
}

export default Product