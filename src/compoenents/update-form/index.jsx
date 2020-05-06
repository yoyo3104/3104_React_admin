import React from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'


export default class UpDateForm extends React.Component {
    constructor(props){
        super(props);
        this.myRef=React.createRef();
    }
   
    static propTypes ={
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired,
    }
    //同步做 第一次render前执行一次
    // componentWillMount(){
    //     //将form对象通过setform传递给父组件
        
    //     console.log(this.formRef.current)
      
    // }
   
    componentDidMount() {
    
        this.props.setForm(this.myRef.current)
       
      
    }
 
    render() {
    
        const {categoryName} =this.props;
       
       
       
        return (
            
           <Form ref={this.myRef} initialValues={{ categoryName: categoryName }}
          >
              
                <Form.Item name="categoryName"  
                rules={[
            {
              required: true,
              message: '请输入分类的名字啊',
            },
          ]}>
                 
                    <Input  placeholder='请输入分类名称'></Input>
                </Form.Item>
                   
            
             
           </Form>
        )
    }
}