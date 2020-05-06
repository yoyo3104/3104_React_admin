import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from '../../api/index'
import { BASE_IMG_URL } from '../../utils/constant';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
    static propTypes ={
        imgs:PropTypes.array
    }

  constructor(props){
      super(props)
      let fileList= []
      //如果传入了imgs
      const {imgs} =this.props
      if(imgs&& imgs.length >0){
          fileList=imgs.map((img,index)=>({
              uid:-index,
              name:img,
              status:'done',
              url:BASE_IMG_URL+img

          }))

      }
      this.state={
        previewVisible: false,//编辑是否预览大图
        previewImage: '',
        previewTitle: '',
        fileList
      }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
      //指定file对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
//1.上传的文件 2.所有的文件
  handleChange = async ({file, fileList }) => 
  {
      console.log(file,file.status)
      if(file.status ==='done'){
         const result= file.response
         if(result.status ===0){
             message.success('上传成功')
            
             const{name,url} =result.data
             file=fileList[fileList.length-1];
             file.name=name;
             file.url=url;


         }else {
             message.error('上传失败')
         }
      }else if (file.status ==='removed') {
          const result =await reqDeleteImg(file.name);
          if(result.status === 0) {
              message.success('删除图片成功')
          }else {
              message.error('删除图片失败')
          }

      }
      this.setState({ fileList });

}
getImgs =() =>{
    return this.state.fileList.map(file => file.name)
}

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div >Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept='image/*'
          name='image' //请求参数名
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}