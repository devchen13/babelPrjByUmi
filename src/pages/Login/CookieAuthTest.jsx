import React, { useState, useEffect } from 'react'
import { Button, Card, message, Descriptions, Space, Divider } from 'antd'
import { encryptLogin, checkLoginStatus, logout } from './LoginUtils'
import { loginConfig } from './config'
import cookieManager from '@/utils/cookieManager'

const CookieAuthTest = () => {
  const [loading, setLoading] = useState(false)
  const [authStatus, setAuthStatus] = useState(null)
  const [loginResult, setLoginResult] = useState(null)

  // 更新认证状态
  const updateAuthStatus = () => {
    const status = cookieManager.getAuthStatus()
    setAuthStatus(status)
  }

  useEffect(() => {
    updateAuthStatus()
  }, [])

  // 测试登录
  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await encryptLogin({
        target: loginConfig.target,
        type: '1',
        tid: loginConfig.tid,
        uid: loginConfig.uid,
        pwd: loginConfig.pwd,
      })

      setLoginResult(result)

      if (result.success) {
        message.success('登录成功！')
        updateAuthStatus() // 更新认证状态
      } else {
        message.error(`登录失败: ${result.error}`)
      }
    } catch (error) {
      message.error(`登录异常: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // 测试认证请求
  const handleTestAuth = async () => {
    try {
      const isLoggedIn = await checkLoginStatus(loginConfig.target)
      message.info(isLoggedIn ? '认证成功：已登录' : '认证失败：未登录')
    } catch (error) {
      message.error(`认证测试失败: ${error.message}`)
    }
  }

  // 登出
  const handleLogout = async () => {
    try {
      const success = await logout(loginConfig.target)
      if (success) {
        message.success('登出成功！')
        updateAuthStatus() // 更新认证状态
        setLoginResult(null)
      } else {
        message.error('登出失败')
      }
    } catch (error) {
      message.error(`登出异常: ${error.message}`)
    }
  }

  // 清理Cookie
  const handleClearCookies = () => {
    cookieManager.clearAllCookies()
    message.success('已清理所有Cookie')
    updateAuthStatus()
    setLoginResult(null)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <Card title='Cookie认证测试' style={{ marginBottom: '20px' }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Button type='primary' onClick={handleLogin} loading={loading} block>
            测试登录
          </Button>

          <Button
            onClick={handleTestAuth}
            disabled={!authStatus?.isAuthenticated}
            block
          >
            测试认证请求
          </Button>

          <Button
            onClick={handleLogout}
            disabled={!authStatus?.isAuthenticated}
            block
          >
            登出
          </Button>

          <Button danger onClick={handleClearCookies} block>
            清理所有Cookie
          </Button>
        </Space>
      </Card>

      {/* 认证状态 */}
      {authStatus && (
        <Card title='认证状态' style={{ marginBottom: '20px' }}>
          <Descriptions column={1} size='small'>
            <Descriptions.Item label='是否已认证'>
              <span
                style={{ color: authStatus.isAuthenticated ? 'green' : 'red' }}
              >
                {authStatus.isAuthenticated ? '✅ 已认证' : '❌ 未认证'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label='Cookie数量'>
              {authStatus.cookieCount}
            </Descriptions.Item>
            <Descriptions.Item label='Cookie字符串'>
              <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                {authStatus.cookieString || '(无)'}
              </code>
            </Descriptions.Item>
          </Descriptions>

          {authStatus.cookies && Object.keys(authStatus.cookies).length > 0 && (
            <>
              <Divider />
              <h4>Cookie详情:</h4>
              <Descriptions column={1} size='small'>
                {Object.entries(authStatus.cookies).map(([name, value]) => (
                  <Descriptions.Item key={name} label={name}>
                    <code style={{ fontSize: '12px' }}>{value}</code>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </>
          )}
        </Card>
      )}

      {/* 登录结果 */}
      {loginResult && (
        <Card title='登录结果' style={{ marginBottom: '20px' }}>
          <Descriptions column={1} size='small'>
            <Descriptions.Item label='登录状态'>
              <span style={{ color: loginResult.success ? 'green' : 'red' }}>
                {loginResult.success ? '✅ 成功' : '❌ 失败'}
              </span>
            </Descriptions.Item>
            {loginResult.data && (
              <>
                <Descriptions.Item label='状态码'>
                  {loginResult.data.status}
                </Descriptions.Item>
                <Descriptions.Item label='企业ID'>
                  {loginResult.data.tenantId || '(空)'}
                </Descriptions.Item>
                <Descriptions.Item label='管理员'>
                  {loginResult.data.isAdmin || '(空)'}
                </Descriptions.Item>
                <Descriptions.Item label='消息'>
                  {loginResult.data.msg || '(空)'}
                </Descriptions.Item>
              </>
            )}
            {loginResult.error && (
              <Descriptions.Item label='错误信息'>
                <span style={{ color: 'red' }}>{loginResult.error}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      {/* 使用说明 */}
      <Card title='使用说明' size='small'>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>点击"测试登录"进行登录，成功后会自动保存Cookie</li>
          <li>点击"测试认证请求"验证Cookie是否有效</li>
          <li>所有后续请求都会自动携带保存的Cookie</li>
          <li>点击"登出"会清理所有Cookie</li>
          <li>Cookie会自动保存到localStorage中</li>
        </ul>
      </Card>
    </div>
  )
}

export default CookieAuthTest
