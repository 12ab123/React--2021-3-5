import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react'
import {withRouter} from 'react-router-dom'
import {BASE_URL} from '../../config'
import { connect } from 'react-redux';
import {reqDeletePicture} from '../../api/index'

//将图片加工成base64的编码形式
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(
  state=>({userToken:state.userInfo})
)
@withRouter
class PicturesWall extends React.Component {

  state = {
    previewVisible: false,      //是否展示预览框
    previewImage: '',           //展示的图片
    previewTitle: '',           
    fileList: [],               //收集好的所有上传完毕的图片
  };

  componentDidMount(){
		this.props.onRef && this.props.onRef(this);
	}


  //从状态中的fileList提取出所有该商品对应的图片,名字,构建一个数组,供新增商品使用
  getImgArr=()=>{

    let result=[]
    this.state.fileList.forEach((item)=>{
       result.push(item.name)
    })
    return result
  }


  //将图片回显
  setFileList=(imgArr)=>{
    let result = []
    imgArr.forEach((item,index)=>{
       result.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
    })
    //将指定id的商品的图片放在此组件的状态上,回显图片
    this.setState({fileList:result})
  } 




  //关闭预览窗
  handleCancel = () => this.setState({ previewVisible: false });

  //展示预览窗
  handlePreview = async file => {
      //如果图片没有url也没有转换base64,调用如下方法将图片转换为base64
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //当图片状态发生改变的回调
  //图片中的所有属性都在file中
  handleChange = async({ file,fileList }) => {

    //文件上传成功
    if(file.status==='done'){
      //如果上传图片成功,服务器返回的响应为file.response
      /*
          当我们上传图片时,状态中的fileList中的该图片对象没有url属性,当我们点击预览时,预览的是图片的base64
          如果图片过大,会造成卡顿效果,所以要往图片对象中添加url属性

          当我们点击删除图片时,如果图片对象中的name不是服务器中的图片名字,会无法删除
          当我们向服务器上传图片时,服务器会将图片按照自己的方式命名,防止图片名重叠
      */
      fileList[fileList.length-1].url=file.response.data.url
      fileList[fileList.length-1].name=file.response.data.name
    }

    //点击删除文件
    if(file.status==='removed'){
      /*
          点击删除图片时,页面中的图片会被删除,但是服务器中的图片没有被删除(假删除)
          所以我们需要做真删除
      */
      let result = await reqDeletePicture({name:file.name})
      const {status,data,msg} = result
      if(status===0){
        message.success('删除图片成功',1)
      }else{
        message.error(msg,1)
      }

        
    }
    this.setState({ fileList })
  }


  render() {
    const userToken='atguigu_'+this.props.userToken.token
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/manage/img/upload`}                          //接收图片服务器的地址
          headers={{Authorization:userToken}}
          method="post"
          name="image"                                                      //发送给服务器的参数名
          listType="picture-card"                                           //图片显示的样式
          fileList={fileList}                                               //从状态中拿出所有的图片进行展示
          onPreview={this.handlePreview}                                    //点击按钮执行的回调
          onChange={this.handleChange}                                      //图片状态改变的回调(图片上传中,图片被删除,图片上传成功等)
        >
          {fileList.length >= 4 ? null : uploadButton}                     
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PicturesWall