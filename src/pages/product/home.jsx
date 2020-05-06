/**商品 */
import React from 'react'
import {Card,Select,Input,Button,Table,message} from 'antd'
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';
import LinkButton from '../../compoenents/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constant'

const Option =Select.Option
/**
 * product默认的子路由组件
 */
export default class ProductHome extends React.Component{
    state ={
        total:0,
        products:[],
        loading:false,
        searchName:'',
        searchType:'productName',
    }
    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getProducts(1);
    }
    getProducts=async (pageNum) =>{
        this.pageNum=pageNum;
        this.setState({loading:true})
        const {searchName,searchType}=this.state;
        let result;
        if(searchName){
            //有值就是搜索分页
           
           result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})

        }else {
            result = await reqProducts(pageNum,PAGE_SIZE);
        }
        
        this.setState({loading:false})
        if(result.status === 0) {
            //取出分页 更新分页列表
            const {total,list}=result.data;
           
            this.setState({
                total,
                products:list
            })

        }
    }
    updateStatus =async (productId,status)=>{
        const result =await reqUpdateStatus(productId,status);
        if(result.status===0) {
            message.success('更新商品成功！');
            this.getProducts(this.pageNum);
        }
    }
    initColumns=() =>{
        this.columns=[
            {
              title: '商品名称',
              dataIndex: 'name',
           
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
             
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price)=>'￥'+price//当前指定了对应的属性
            },
            {   
                width:100,
                title: '状态',
                // dataIndex: 'status',
                render:(product)=>{
                    const {status,_id}=product;
                   
                    
                    return (
                        <span>
                        <Button type='primary' 
                        onClick={()=>this.updateStatus(_id,status===1?2:1)}
                        >{status===1 ?'下架':'上架'}
                        </Button>
                        <span>{status===1 ?'在售':'已下架'}</span>
                    </span>
                    )
                }
                    
                
              },
              {
                width:100,
                title: '操作',
               
                render:(product)=>{
                    return (
                        <span>
                       <LinkButton onClick={()=>this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                       <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                    </span>
                    )
                }
              }
          ];
    }
    render(){
        const {products,total,loading,searchName,searchType} =this.state;
        const dataSource = [
            {
              key: '1',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '2',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
          ];
          const columns = [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: '住址',
              dataIndex: 'address',
              key: 'address',
            },
          ];
          

        const title=(
            <span>
                <Select value={searchType} style={{width:150}} onChange={value=>this.setState({searchType:value})}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} 
                value={searchName} onChange={e=>this.setState({searchName:e.target.value})}/>
                <Button type='primary'onClick={this.getProducts.bind(this,1)}>搜索</Button>
            </span>
        )
        const extra =(
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}><PlusOutlined />添加商品</Button>
        )
        return(
            <Card title={title} extra={extra} >
                <Table rowKey='_id' dataSource={products}
                 columns={this.columns}
                  bordered={true}
                  loading={loading}
                  pagination={{
                      current:this.pageNum,
                      defaultPageSize:PAGE_SIZE,
                      showQuickJumper:true,
                      total:total,
                      onChange:this.getProducts
                  }}
                  />
               


                
            </Card>
        )
    }
}