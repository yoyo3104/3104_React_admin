import React from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option

export default class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,

    }
    //initialValues={{ categoryName: categoryName }}
    componentDidMount() {
        this.props.setForm(this.myRef.current)
        console.log(this.myRef.current)

    }
    render() {


        const { roles, user } = this.props;
        const layout = {
            labelCol: {
                span: 6,//指定左侧的包裹
            },
            wrapperCol: {
                span: 16,//指定右侧包裹的宽度
            },
        };


        return (
            <Form {...layout} ref={this.myRef}
                initialValues={{
                    username: user.username,
                    password: user.password,
                    phone: user.phone,
                    email: user.email,
                    role_id: user.role_id
                }}

            >
                <Form.Item name="username" label="用户名">
                    <Input placeholder='请输入用户名'></Input>
                </Form.Item>
                {
                    user._id?null:
                    <Form.Item name="password" label="密码">
                    <Input type="password" placeholder='请输入密码'></Input>
                </Form.Item>

                }
               

                <Form.Item name="phone" label="手机号" rules={[
                    { required: true, message: '手机号必须输入' }

                ]}>
                    <Input placeholder='请输入手机号'></Input>
                </Form.Item>

                <Form.Item name="email" label="邮箱" rules={[
                    { required: true, message: '邮箱必须输入' }

                ]}>
                    <Input placeholder='请输入邮箱'></Input>
                </Form.Item>

                <Form.Item name="role_id" label="角色" >
                    <Select placeholder='请选择角色'>
                        {
                            roles.map(item =>
                                <Option key={item._id} value={item._id}>{item.name}</Option>
                            )
                        }
                    </Select>
                </Form.Item>




            </Form>
        )
    }
}