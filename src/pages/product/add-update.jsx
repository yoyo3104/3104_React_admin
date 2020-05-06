/**商品 */
import React from 'react'
import {Card,Form,Input,Button,Cascader,Upload,message} from 'antd'
import LinkButton from "../../compoenents/link-button"
import {ArrowLeftOutlined} from '@ant-design/icons';
import {reqCategorys,reqAddProduct} from '../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const Item =Form.Item
const {TextArea}=Input
// const options = [
//     {
//       value: 'zhejiang',
//       label: 'Zhejiang',
//       isLeaf: false,
//     },
//     {
//       value: 'jiangsu',
//       label: 'Jiangsu',
//       isLeaf: false,
//     },
//   ];
/**
 * product添加和更新的子路由组件
 */
export default class ProductAddUpdate extends React.Component{
    state = {
        options:[],
      };
      constructor (props){
          super(props)
          this.pw=React.createRef();
          this.editor=React.createRef();
      }
    formRef = React.createRef();
    
    initOptions =async (categorys)=>{
       const options= categorys.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        
        const {isUpdate,product}=this
        const {pCategoryId}=product
        if(isUpdate && pCategoryId!=='0') {
            //获得对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            console.log(subCategorys)
            //生成二级下拉列表的options
            const childOptions =subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            //关联到对应的option上面
            const targetOption =options.find(option=> option.value ===pCategoryId)
            console.log(targetOption)
            targetOption.children=childOptions;
        }
        this.setState({
            options
        })

    }
    getCategorys = async (parentId) =>{
        
        const result =await reqCategorys(parentId);

        if(result.status ===0){
            const categorys =result.data;
            console.log(categorys)
            //如果一级分类列表
            if(parentId === '0'){
                this.initOptions(categorys);
            }else {
                return categorys;//返回二级列表
            }
           
        }
    }

    componentDidMount() {
        this.getCategorys('0')
    }
    componentWillMount() {
        //取出携带的state
        const product =this.props.location.state;
        console.log(product)
        //保存者是否是更新的标识
        this.isUpdate =!!product
        this.product = product ||{}
    }
    
 
    //再写一个验证价格的函数
    submit= async ()=>{
    //    console.log(this.formRef)
        try {
           
            const values = await this.formRef.current.validateFields();
            console.log('Success:', values);
            //1.收集数据
           

            const {name,desc,price,categoryIds}=values;
            let categoryId,pCategoryId;
            
            if(categoryIds.length===1) {
                pCategoryId='0'
                categoryId=categoryIds[0]
            }else {
                pCategoryId=categoryIds[0]
                categoryId=categoryIds[1]
            }
             
            const imgs=this.pw.current.getImgs()
            const detail=this.editor.current.getDetail()
            const product ={name,desc,price,imgs,detail, pCategoryId, categoryId}
            if(this.isUpdate){
                product._id=this.product._id
            }
            console.log(product)
            // console.log(imgs,detail)
            //2.调用接口请求函数
            const result= await reqAddProduct(product)
            console.log(result)
            if(result.status===0){
                message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
                this.props.history.goBack()
            }
           
          } catch (errorInfo) {
            message.error(`${this.isUpdate?'更新':'添加'}商品失败！`)
          }
        };
    loadData =async selectedOptions => {
            //选中的那一项
            const targetOption = selectedOptions[selectedOptions.length - 1];
            //显示loading
            targetOption.loading = true;
            const subCategorys = await this.getCategorys(targetOption.value);
            targetOption.loading = false;
            if(subCategorys && subCategorys.length>0){
                const childOptions= subCategorys.map(c=>({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                //将二级分类列表关联到当前options
                targetOption.children =childOptions;

            }else {
                targetOption.isLeaf=true//注意大小写
            }
           
           
              this.setState({
                options: [...this.state.options],
              });
            }
        
    
    render(){
        const {isUpdate, product}=this
        const {pCategoryId,categoryId,imgs,detail}=product
        const categoryIds=[]
        if(isUpdate){
            //商品是一个一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
            

            //商品是一个二级分类的商品
        }
        const layout = {
            labelCol: {
              span: 2,//指定左侧的包裹
            },
            wrapperCol: {
              span: 8,//指定右侧包裹的宽度
            },
          };
        const title =(
            <span>
                <LinkButton >
                <ArrowLeftOutlined style={{fontSize:20,marginRight:16}} onClick={()=>{this.props.history.goBack()}}/>
                </LinkButton>
                <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )
        return(
           <Card title={title}>
            <Form ref={this.formRef} {...layout} 
            initialValues={{
                name:product.name,desc:product.desc,price:product.price,categoryIds:categoryIds}}>
                <Item 
                label="商品名称"
                name="name"
                
                rules={[
                    {
                                required: true,
                                message: '请输入商品名称',
                    },
                ]}>
                    <Input placeholder="商品名称"/>
                </Item>
                <Item label="商品描述" 
                name="desc"
                rules={[
                    {
                                required: true,
                                message: '请输入商品描述',
                    },
                ]}>
                        <TextArea
                            placeholder="商品描述"
                            autoSize={{ minRows: 2, maxRows: 5 }}
                        />                 
                </Item>
                <Item label="商品价格"
                 name="price"
                 rules={[
                     {
                                 required: true,
                                 message: '请输入商品描述',
                     },
                     {
                        validator: (_, value) =>
                            
                       value>0 ? Promise.resolve() : Promise.reject('价格必须大于0')
                        
                        
                     }
                 ]}
                
                >
                    <Input type="number" placeholder="商品价格" addonAfter="元"/>
                </Item>
                <Item label="商品分类" name="categoryIds">
                      
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}//加载下一级数据
                            
                            
                        />
                </Item>
                <Item label="商品图片">
                <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                </Item>
                <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
                <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                </Item>
                <Item>
                    <Button type="primary" onClick={this.submit}>提交</Button>
                </Item>
            </Form>

           </Card>
        )
    }
}