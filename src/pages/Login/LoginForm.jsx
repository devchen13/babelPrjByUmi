import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { autoLogin, encryptLogin, checkLoginStatus } from './LoginUtils'
import { loginConfig } from './config'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // 自动登录
  const handleAutoLogin = async () => {
    setLoading(true)
    try {
      const result = await autoLogin({
        params: loginConfig.body,
        redirectUrl: 'https://cloud.waiqin365.com',
      })

      if (result.success) {
        message.success('自动登录成功！')
        console.log('登录结果:', result)
      } else {
        message.error(`自动登录失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`登录异常: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 手动登录
  const handleManualLogin = async values => {
    setLoading(true)
    try {
      const result = await encryptLogin({
        target: loginConfig.body.target,
        type: '1', // 账号登录
        tid: values.tid,
        uid: values.uid,
        pwd: values.pwd,
      })

      if (result.success) {
        message.success('登录成功！')
        console.log('登录结果:', result)
      } else {
        message.error(`登录失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`登录异常: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 检查登录状态
  const handleCheckStatus = async () => {
    try {
      const isLoggedIn = await checkLoginStatus(loginConfig.body.target)
      message.info(isLoggedIn ? '已登录' : '未登录')
    } catch (error) {
      message.error(`检查状态失败: ${error.message}`)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>登录测试</h2>

      {/* 自动登录 */}
      <div style={{ marginBottom: '20px' }}>
        <Button
          type='primary'
          onClick={handleAutoLogin}
          loading={loading}
          block
        >
          自动登录（使用配置）
        </Button>
      </div>

      {/* 手动登录表单 */}
      <Form
        form={form}
        onFinish={handleManualLogin}
        layout='vertical'
        initialValues={{
          tid: 'jctx',
          uid: 'c13',
          pwd: 'a888888',
        }}
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
          <Button type='primary' htmlType='submit' loading={loading} block>
            手动登录
          </Button>
        </Form.Item>
      </Form>

      {/* 检查登录状态 */}
      <div style={{ marginTop: '20px' }}>
        <Button onClick={handleCheckStatus} block>
          检查登录状态
        </Button>
      </div>
    </div>
  )
}

export default LoginForm
