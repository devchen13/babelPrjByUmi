import React, { useState } from 'react'
import { loginConfig } from './config'
import loginUtils from './LoginUtils'
import { getHashParamWithQs } from '@utils/helper'

import { Button, message, Spin } from 'antd'
import LoginForm from './LoginForm'

const Login = () => {
  // 使用qs获取URL中的参数
  const enableLogin = getHashParamWithQs('login')
  const urlTarget = getHashParamWithQs('target') ?? loginConfig.target
  const urlType = getHashParamWithQs('type') ?? loginConfig.type
  const urlTid = getHashParamWithQs('tid') ?? loginConfig.tid
  const urlUid = getHashParamWithQs('uid') ?? loginConfig.uid
  const urlPwd = getHashParamWithQs('pwd') ?? loginConfig.pwd

  const loginCfg = {
    type: urlType,
    target: urlTarget,
    tid: urlTid,
    uid: urlUid,
    pwd: urlPwd,
  }

  const [loading, setLoading] = useState(false)

  // 自动登录
  const handleAutoLogin = async () => {
    const isLoggedIn = await loginUtils.checkLoginStatus(loginCfg.target)

    message.info(isLoggedIn ? '已登录' : '未登录')
    if (isLoggedIn) {
      return
    }

    setLoading(true)
    try {
      const result = await loginUtils.autoLogin({ params: loginCfg })
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
  const handleManualLogin = async (values) => {
    setLoading(true)
    try {
      const result = await loginUtils.autoLogin({
        params: {
          target: loginCfg.target,
          type: loginCfg.type, // 账号登录
          tid: values.tid,
          uid: values.uid,
          pwd: values.pwd,
        },
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

  if (!enableLogin) {
    return null
  }
  return (
    <Spin spinning={loading}>
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <div>
          {/* 显示当前服务器信息 */}
          {urlTarget && (
            <div
              style={{
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <strong>代理服务器:</strong> {urlTarget}
            </div>
          )}

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

          <LoginForm
            {...{
              onFinish: handleManualLogin,
              initialValues: {
                tid: loginCfg.tid,
                uid: loginCfg.uid,
                pwd: loginCfg.pwd,
              },
            }}
          />
        </div>
      </div>
    </Spin>
  )
}

export default Login
