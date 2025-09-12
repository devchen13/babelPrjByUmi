import qs from 'qs'
import crypto from 'crypto'
import globalConfig from '@GlobalConfig'
import AxiosRequest, { fullGet, fullPost } from '@/utils/request'
import cookieManager from '@/utils/cookieManager'

/**
 * 登录工具类
 * 提供自动登录、明文登录、密文登录等功能
 */
class LoginUtils {
  constructor() {
    this.defaultConfig = {
      target: '',
      timeout: 30000,
      retryCount: 3,
      retryDelay: 1000,
    }
  }

  /**
   * 格式化RSA公钥
   * @param {string} key - 公钥字符串
   * @param {string} type - 密钥类型 'public' | 'private'
   * @returns {string} 格式化后的密钥
   */
  formatKey(key, type) {
    if (type === 'public') {
      return `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`
    } else if (type === 'private') {
      return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`
    }
    throw new Error('Invalid key type')
  }

  /**
   * 密码加密处理
   * @param {string} password - 原始密码
   * @param {string} publicKey - RSA公钥
   * @returns {object} 加密结果 {rsaType, password}
   */
  rsaEncode(password, publicKey) {
    if (publicKey) {
      try {
        const encryptedData = crypto.publicEncrypt(
          {
            key: this.formatKey(publicKey, 'public'),
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(password)
        )
        return {
          rsaType: 1,
          password: encryptedData.toString('base64'),
        }
      } catch (error) {
        console.warn('RSA加密失败，使用Base64编码:', error.message)
      }
    }

    // 降级到Base64编码
    return {
      rsaType: 0,
      password: Buffer.from(password).toString('base64'),
    }
  }

  /**
   * 获取RSA公钥
   * @param {string} target - 目标服务器地址
   * @returns {Promise<string>} 公钥字符串
   */
  async getAsrPublicKey() {
    try {
      console.log(`正在获取RSA公钥...`)
      const response = await fullGet(
        `/api/platform/encrypt/getPublicKey.do`,
        {},
        {
          contentType: 'application/json;charset=utf-8',
          timeout: this.defaultConfig.timeout,
        }
      )

      const result = response.data || response
      console.log(`获取RSA公钥结果:`, result)

      if (result?.code === '1') {
        return result?.data?.publicKey || result?.data || ''
      } else if (typeof result === 'string') {
        return result
      }
      return ''
    } catch (error) {
      console.warn(`获取RSA公钥失败:`, error.message)
      return ''
    }
  }

  /**
   * 明文登录
   * @param {object} params - 登录参数
   * @param {string} params.type - 登录类型 '1'=账号登录 '2'=手机登录
   * @param {string} params.tid - 企业ID
   * @param {string} params.uid - 用户名或手机号
   * @param {string} params.pwd - 密码
   * @returns {Promise<object>} 登录结果
   */
  async revealLogin(params) {
    const { type, tid, uid, pwd } = params

    const loginData = {
      'identifiers.src': 'waiqin365',
      'identifiers.password': pwd,
      refer: 'https%3A%2F%2Fcloud.waiqin365.com',
      'identifiers.type': type,
      'identifiers.tenantname': type === '1' ? tid : '',
      'identifiers.code': uid,
    }

    try {
      console.log('执行明文登录...')
      const response = await fullPost(
        `/api/portal/logon.action`,
        qs.stringify(loginData),
        {
          timeout: this.defaultConfig.timeout,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return {
        success: true,
        data: response.data,
        headers: response.headers,
      }
    } catch (error) {
      console.error('明文登录失败:', error)
      return {
        success: false,
        error: error.message,
        data: error.response?.data,
      }
    }
  }

  /**
   * 密文登录（推荐使用）
   * @param {object} params - 登录参数
   * @param {string} params.target - 目标服务器
   * @param {string} params.type - 登录类型 '1'=账号登录 '2'=手机登录
   * @param {string} params.tid - 企业ID
   * @param {string} params.uid - 用户名或手机号
   * @param {string} params.pwd - 密码
   * @returns {Promise<object>} 登录结果
   */
  async encryptLogin(params) {
    const { type, tid, uid, pwd } = params

    try {
      // 获取RSA公钥
      const publicKey = await this.getAsrPublicKey()
      console.log(`已获取RSA公钥: ${publicKey || '(空)'}`)

      // 加密密码
      const { rsaType, password } = this.rsaEncode(pwd, publicKey)
      console.log(
        `密码加密: ${pwd} -> ${rsaType === '0' ? 'Base64编码' : 'RSA编码'}: ${password}`
      )

      // 构建登录数据
      const loginData = {
        'identifiers.src': 'waiqin365',
        'identifiers.password': password,
        'identifiers.rsaType': rsaType,
        // 'identifiers.verifyCode': '',// 导致登录被验证码拦截住
        'identifiers.type': type,
        'identifiers.tenantname': tid,
        'identifiers.code': uid,
      }

      console.log('提交登录参数:', loginData)

      const response = await fullPost(`/api/portal/logon.action`, loginData, {
        contentType: 'application/x-www-form-urlencoded',
      })

      // 处理登录成功后的Cookie
      if (response && response.data && response.data.status === '1') {
        console.log('登录成功，保存认证Cookie')

        // 调试：打印完整的响应对象
        console.log('完整响应对象:', response)
        console.log('响应头信息:', response.headers)
        console.log('响应头键名:', Object.keys(response.headers || {}))

        // 从响应头获取Cookie（如果有的话）
        const setCookieHeaders =
          response.headers && response.headers['set-cookie']
        console.log('获取到的 set-cookie 头:', setCookieHeaders)

        if (setCookieHeaders) {
          console.log('处理服务器返回的 set-cookie 头:', setCookieHeaders)
          cookieManager.setCookiesFromHeaders(setCookieHeaders)
        }

        // 处理登录响应中的 token
        if (response.data && response.data.token) {
          console.log('保存登录 token 到 Cookie:', response.data.token)

          // 解析 JWT token 获取用户信息
          let tokenPayload = null
          try {
            const tokenParts = response.data.token.split('.')
            if (tokenParts.length === 3) {
              const payload = tokenParts[1]
              // 添加 padding 如果必要
              const paddedPayload =
                payload + '='.repeat((4 - (payload.length % 4)) % 4)
              tokenPayload = JSON.parse(atob(paddedPayload))
              console.log('解析的 token 载荷:', tokenPayload)
            }
          } catch (error) {
            console.warn('解析 JWT token 失败:', error.message)
          }

          // 将 token 保存为 x-token Cookie
          cookieManager.setCookie('x-token', response.data.token, {
            maxage: 7 * 24 * 3600, // 7天过期
            path: '/',
            secure: false, // 根据实际情况调整
            httpOnly: false, // 允许 JavaScript 访问
          })
          console.log('x-token Cookie 已保存')

          // 从 token 中提取并保存其他信息
          if (tokenPayload) {
            if (tokenPayload.tenantId) {
              cookieManager.setCookie(
                'tenantId',
                tokenPayload.tenantId.toString(),
                {
                  maxage: 7 * 24 * 3600,
                  path: '/',
                }
              )
              console.log('tenantId 已保存:', tokenPayload.tenantId)
            }

            if (tokenPayload.userId) {
              cookieManager.setCookie(
                'userId',
                tokenPayload.userId.toString(),
                {
                  maxage: 7 * 24 * 3600,
                  path: '/',
                }
              )
              console.log('userId 已保存:', tokenPayload.userId)
            }
          }
        }

        // 手动设置一些认证相关的Cookie（根据实际需要调整）
        cookieManager.setCookie('loginStatus', 'success', { maxage: 3600 })

        console.log('当前认证状态:', cookieManager.getAuthStatus())
      }

      return {
        success: response.data?.status === '1',
        data: response.data,
        headers: response.headers,
      }
    } catch (error) {
      console.error('密文登录失败:', error)
      return {
        success: false,
        error: error.message,
        data: error.response?.data,
      }
    }
  }

  /**
   * 自动登录（基于配置文件）
   * @param {object} config - 登录配置
   * @param {object} config.params - 登录参数
   * @param {string} config.params.target - 目标服务器
   * @param {string} config.params.type - 登录类型
   * @param {string} config.params.tid - 企业ID
   * @param {string} config.params.uid - 用户名
   * @param {string} config.params.pwd - 密码
   * @param {string} config.redirectUrl - 重定向URL
   * @returns {Promise<object>} 登录结果
   */
  async autoLogin(config) {
    try {
      console.log('开始自动登录...')
      console.log('登录配置:', JSON.stringify(config, null, 2))

      const { params, redirectUrl } = config
      if (!params || !params.uid || !params.pwd) {
        throw new Error('登录参数不完整')
      }

      // 使用密文登录
      const result = await this.encryptLogin(params)

      if (result.success) {
        console.log('自动登录成功')

        // 处理Cookie
        const cookies = result.headers['set-cookie']
        if (cookies) {
          console.log('设置登录Cookie:', cookies)
        }

        return {
          success: true,
          data: result.data,
          cookies: cookies,
          redirectUrl: redirectUrl,
        }
      } else {
        console.error('自动登录失败:', result.error)
        return {
          success: false,
          error: result.error,
          data: result.data,
        }
      }
    } catch (error) {
      console.error('自动登录异常:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * 带重试机制的登录
   * @param {object} params - 登录参数
   * @param {boolean} useEncrypt - 是否使用密文登录
   * @param {number} retryCount - 重试次数
   * @returns {Promise<object>} 登录结果
   */
  async loginWithRetry(params, useEncrypt = true, retryCount = null) {
    const maxRetries = retryCount || this.defaultConfig.retryCount

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`登录尝试 ${i + 1}/${maxRetries}`)

        const result = useEncrypt
          ? await this.encryptLogin(params)
          : await this.revealLogin(params)

        if (result.success) {
          return result
        }

        // 如果不是最后一次尝试，等待后重试
        if (i < maxRetries - 1) {
          console.log(`登录失败，${this.defaultConfig.retryDelay}ms后重试...`)
          await new Promise((resolve) =>
            setTimeout(resolve, this.defaultConfig.retryDelay)
          )
        }
      } catch (error) {
        console.error(`登录尝试 ${i + 1} 失败:`, error.message)

        if (i === maxRetries - 1) {
          return {
            success: false,
            error: error.message,
          }
        }

        // 等待后重试
        await new Promise((resolve) =>
          setTimeout(resolve, this.defaultConfig.retryDelay)
        )
      }
    }

    return {
      success: false,
      error: '登录重试次数已达上限',
    }
  }

  /**
   * 验证登录状态
   * @param {string} target - 目标服务器
   * @returns {Promise<boolean>} 是否已登录
   */
  async checkLoginStatus(target) {
    try {
      const response = await fullGet(
        `/api/platform/param/v1/getLoginUser.do`,
        {},
        {
          contentType: 'application/json;charset=utf-8',
          timeout: this.defaultConfig.timeout,
          withCredentials: true,
        }
      )

      return response.data?.code === '1'
    } catch (error) {
      console.warn('检查登录状态失败:', error.message)
      return false
    }
  }

  /**
   * 登出
   * @param {string} target - 目标服务器
   * @returns {Promise<boolean>} 是否登出成功
   */
  async logout(target) {
    try {
      await fullGet(
        `/api/portal/logout.action`,
        {},
        {
          contentType: 'application/json;charset=utf-8',
          timeout: this.defaultConfig.timeout,
          withCredentials: true,
        }
      )

      // 清理所有认证Cookie
      cookieManager.clearAllCookies()
      console.log('登出成功，已清理所有Cookie')
      return true
    } catch (error) {
      console.error('登出失败:', error.message)
      // 即使登出请求失败，也清理本地Cookie
      cookieManager.clearAllCookies()
      return false
    }
  }
}

// 创建单例实例
const loginUtils = new LoginUtils()

// 导出便捷方法
export const revealLogin = loginUtils.revealLogin.bind(loginUtils)
export const encryptLogin = loginUtils.encryptLogin.bind(loginUtils)
export const autoLogin = loginUtils.autoLogin.bind(loginUtils)
export const loginWithRetry = loginUtils.loginWithRetry.bind(loginUtils)
export const checkLoginStatus = loginUtils.checkLoginStatus.bind(loginUtils)
export const logout = loginUtils.logout.bind(loginUtils)
export const getAsrPublicKey = loginUtils.getAsrPublicKey.bind(loginUtils)
export const rsaEncode = loginUtils.rsaEncode.bind(loginUtils)

// 导出默认实例
export default loginUtils

// 兼容CommonJS导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = loginUtils
  module.exports.default = loginUtils
}
