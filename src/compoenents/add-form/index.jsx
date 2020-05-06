import React from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item =Form.Item
const Option =Select.Option
export default class AddForm extends React.Component {
    constructor(props){
        super(props);
        this.myRef=React.createRef();
    }
    static propTypes ={
        setForm:PropTypes.func.isRequired,
        categorys:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
    }
    //initialValues={{ categoryName: categoryName }}
    componentDidMount(){
         this.props.setForm(this.myRef.current)
         console.log(this.myRef.current)
        
    }
    render() {
      

        const {categorys,parentId} =this.props;
        console.log(this.props)
        
        return (
           <Form  ref={this.myRef} initialValues={{parentId :parentId}}
           rules={[
               {required: true,message:'分类名称必须输入'}
            
          ]}
           >
          
                <Form.Item name="parentId">
                <Select  >
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map((c,index)=><Option key={c._id} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Form.Item>
          
               
                <Form.Item name="categoryName">
                    <Input placeholder='请输入分类名称'></Input>
                </Form.Item>
                   
            
             
           </Form>
        )
    }
}