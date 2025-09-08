import React from 'react'
import { Button, Form, Input } from 'antd'

const LoginForm = (props) => {
  const { onFinish, initialValues } = props
  const [form] = Form.useForm()

  /* 手动登录表单 */
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout='vertical'
      initialValues={initialValues}
    >
      <Form.Item
        label='企业ID'
        name='tid'
        rules={[{ required: true, message: '请输入企业ID' }]}
      >
        <Input placeholder='请输入企业ID' />
      </Form.Item>

      <Form.Item
        label='用户名'
        name='uid'
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder='请输入用户名' />
      </Form.Item>

      <Form.Item
        label='密码'
        name='pwd'
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder='请输入密码' />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' block>
          手动登录
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
