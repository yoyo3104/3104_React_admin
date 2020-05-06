import React from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item =Form.Item

export default class AddForm extends React.Component {
    constructor(props){
        super(props);
        this.myRef=React.createRef();
    }
    static propTypes ={
        setForm:PropTypes.func.isRequired,
    
    }
    //initialValues={{ categoryName: categoryName }}
    componentDidMount(){
         this.props.setForm(this.myRef.current)
         console.log(this.myRef.current)
        
    }
    render() {
      

        const {categorys,parentId} =this.props;
        
        
        return (
           <Form  ref={this.myRef} initialValues={{roleName :''}}
         
           >
           <Form.Item name="roleName" label="角色名称"   rules={[
               {required: true,message:'角色名称必须输入'}
            
          ]}>
                    <Input placeholder='请输入角色名称'></Input>
                </Form.Item>
          
               
                   
            
             
           </Form>
        )
    }
}