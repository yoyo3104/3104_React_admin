/**Category */
import React from 'react'
import './category.less'
import {reqCategorys,reqUpdateCategory,reqAddCategory} from '../../api/index'
import {message} from 'antd'
import {Button,Card,Table,Modal} from 'antd'
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';
import LinkButton from '../../compoenents/link-button'
import AddForm from '../../compoenents/add-form'
import UpdateForm from '../../compoenents/update-form'

export default class Category extends React.Component{
    state={
        categorys:[],
        loading:false,
        subCategorys:[],
        parentId:'0',//当前需要现实的分类列表的parentId
        parentName:'',
        showStatus:0,//标识更新的确认框是否显示 0：不显示 1：显示添加 2.显示更新
        fields: {
            name: ['username'],
            value: 'Ant Design',
          },


    }
    /**
     * 初始化列的数组
     *
     */
    initialColumns =() =>{
        this.columns = [
            {
              title: '姓名',
              dataIndex: 'name',
              
            },
            {
              title: '操作',
              width:300,
              render: (category) =>(
               <span> 
                  <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                  {
                      this.state.parentId==='0' ?
                      <LinkButton onClick={this.showSubCategorys.bind(this,category)}>查看子分类</LinkButton>:
                      null

                  }
                  
              </span>)
            },
         
          ];

    }
    //获取一级或者二级分类列表
    /**
     * parentId:如果没有指定根据状态中的发请求 指定了根据指定的
     */
    getCategorys = async(parentId) =>{
        //发异步ajax请求
        this.setState({loading:true})
        parentId= parentId || this.state.parentId;
        //取出分类数组
        const result = await reqCategorys(parentId)
        this.setState({loading:false})
        if(result.status ===0){
          
            const categorys= result.data
            console.log(categorys)
            if(parentId ==='0'){
            
                this.setState({
                    categorys:categorys
                })

            }else {
                this.setState({
                    subCategorys:categorys
                })
            }
           

        }else {
            message.error('获取列表失败')
        }
    }
    showSubCategorys =(category) =>{
        //先更新状态 setState是异步的
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            this.getCategorys()//在状态更新并且重新渲染后执行
        })
        
    }
    showFirstCategorys =() =>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }
    /**
     * 相应点击取消
     */
    handleCancel =() =>{
        this.form.resetFields();
        this.setState({
            showStatus:0
        })
    }
    showUpdate =(category) =>{
        //保存分类对象
        this.category=category
        this.setState({
            showStatus:2
        })

    }
  
    //显示添加的对话框
    showAdd =() =>{
        this.setState({
            showStatus:1
        })
    }
    /**
     * 添加分类
     */
    addCategory=async () =>{
        console.log('add')
        this.setState({
            showStatus:0
        })
        const categoryName =this.form.getFieldValue('categoryName');
        const parentId =this.form.getFieldValue('parentId');
       
        this.form.resetFields();
        const result =await reqAddCategory(categoryName,parentId);
        if(result.status ==0){
            if(parentId ===this.state.parentId){
                this.getCategorys();
            } else if (parentId ==='0') {
                this.getCategorys('0');
            }
            
        }

    }
    upDateCategory=  ()=>{
       //进行表单验证
       this.form.validateFields()
       .then(async (values)=>{
        this.setState({
            showStatus:0
        })
       
        const categoryId =this.category._id;
        const {categoryName} =values;
        // const categoryName =this.form.getFieldValue('categoryName');
        this.form.resetFields();
       
        const result= await reqUpdateCategory(categoryId,categoryName)
        console.log(result)
        if(result.status===0){

            this.getCategorys()
        }
       }).catch(error=>{
           console.log(error)
       })
          
           
            

       
     


    }

    //为第一次render准备数据
    componentWillMount() {
      this.initialColumns();

    }
    //发异步请求
    componentDidMount() {
        this.getCategorys()

    }
    render(){
        const {categorys,loading,parentId,parentName,subCategorys,showStatus,fields} =this.state;
        const category = this.category || {} // 如果还没有指定一个空对象
     
       
    
        const title= parentId ==='0'?'一级分类列表':(
            <span>
                <LinkButton onClick={this.showFirstCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight:'6px'}}/>
                <span>{parentName}</span>
            </span>
        );
        const extra =(
            <Button type='primary' onClick={this.showAdd}><PlusOutlined />添加</Button>
        );
      
      
        const dataSource = [
            {
                "parentId": "0",
                "_id": "5c2ed631f352726338607046",
                "name": "分类001",
                "__v": 0
              },
              {
                "parentId": "0",
                "_id": "5c2ed647f352726338607047",
                "name": "分类2",
                "__v": 0
              },
              {
                "parentId": "0",
                "_id": "5c2ed64cf352726338607048",
                "name": "1分类3",
                "__v": 0
              }
          ];
          
          
        return(
            
         
            <div className="category">
               
                <Card title={title} extra={extra} >
                <Table 
                        bordered={true}
                        rowKey='_id'
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        loading={loading}
                        pagination={{ defaultPageSize: 5, showQuickJumper: true }} />
                    <Modal
                        title="添加分类"
                        visible={showStatus===1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}
                    >
                        <AddForm categorys={categorys} parentId={parentId} setForm={(form)=>{this.form=form}}/>
              
                    </Modal>
                    <Modal
                        title="更新分类"
                        visible={showStatus===2}
                        onOk={this.upDateCategory}
                        onCancel={this.handleCancel}
                    >
                        <UpdateForm categoryName={category.name}
                           setForm={(form)=>{this.form=form}}/>
            
          
                      
                    </Modal>
                </Card>

            </div>
        )
    }
}