/**商品 */
import React from 'react'
import {Card,List} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons';
import LinkButton from '../../compoenents/link-button'
import {BASE_IMG_URL} from '../../utils/constant'
import {reqCategory} from '../../api/index'
const Item =List.Item
/**
 * product详情页的子路由组件
 */
export default class ProductDetail extends React.Component{
    state={
        cname1:'',//一级分类名称
        cname2:'',//二级分类名称

    }
    async componentDidMount() {
        const {categoryId,pCategoryId} =this.props.location.state.product;
        if(pCategoryId==='0'){
           const result= await reqCategory(categoryId)
           const cname1= result.data.name;
           this.setState({
               cname1
           })

        }else {
            // const result1= await reqCategory(pCategoryId)
            // const result2= await reqCategory(categoryId)
            // const cname1= result1.data.name;
            // const cname2= result2.data.name;
            const results =await Promise.all([reqCategory(pCategoryId),await reqCategory(categoryId)])
            const cname1= results[0].data.name;
            const cname2= results[1].data.name;
            this.setState({

                cname1,
                cname2
            })

        }

    }
    render(){
        const {name,desc,price,detail,imgs} =this.props.location.state.product;
        const {cname1,cname2}=this.state
        const title=(
            <span>
            <LinkButton style={{fontSize:16}}>
            
                <ArrowLeftOutlined 
                style={{marginRight:16}}
                onClick={()=>{console.log(this.props);this.props.history.goBack()}}/>
                
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return(
            <div>
                <Card title={title} className="product-detail">
                    <List  itemLayout="vertical">
                   
                        <Item>
                            <span className="left">商品名称：</span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className="left">商品描述：</span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className="left">商品价格：</span>
                            <span>{price}</span>
                        </Item>
                        <Item>
                            <span className="left">所属分类：</span>
                            <span>{cname1}{cname2? '-->'+cname2 :''}</span>
                        </Item>
                        <Item>
                            <span className="left">商品图片：</span>
                           
                           
                            <span>
                                {
                                    imgs.map(img=>(
                                        <img 
                                        key={+img}
                                        className="product-img"
                                        src={BASE_IMG_URL+img}
                                        alt="img"
                                        />
                                    ))
                                }
                            </span>
                        </Item>
                        <Item>
                            <span className="left">商品详情：</span>
                            <span dangerouslySetInnerHTML={{__html:detail}}></span>
                        </Item>
                    </List>

                </Card>
            </div>
        )
    }
}