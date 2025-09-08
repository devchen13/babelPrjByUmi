import axios from 'axios'
import cookieManager from './cookieManager'
import { getHashParamWithQs } from './helper'

// 获取当前代理服务器地址
const getCurrentProxyServer = () => {
  // 从URL参数获取target作为服务器地址
  const urlTarget = getHashParamWithQs('target')
  return urlTarget || '' // 默认服务器
}

// 根据target自动决定协议
const getProtocolFromTarget = (target) => {
  if (!target) return 'http'

  // 如果target已经包含协议，直接使用
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return target
  }

  // 根据端口号或其他规则决定协议
  // 这里可以根据实际需求调整规则
  if (target.includes(':443') || target.includes(':8443')) {
    return `https://${target}`
  }

  // 默认使用http
  return `http://${target}`
}

// 动态创建axios实例
const createRequestInstance = (baseURL) => {
  return axios.create({
    baseURL: baseURL ? `${baseURL}` : undefined,
    timeout: 10000,
    withCredentials: true, // 允许跨域请求携带Cookie
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// 创建默认axios实例
const request = createRequestInstance()

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 动态设置代理服务器
    const currentServer = getCurrentProxyServer()
    if (currentServer) {
      // 根据target自动决定协议
      const baseURL = getProtocolFromTarget(currentServer)
      config.baseURL = baseURL

      // 如果有target参数，需要去掉/api前缀
      if (config.url?.startsWith('/api/')) {
        config.url = config.url.replace('/api', '')
        console.log('去掉/api前缀后的URL:', config.url)
      }

      console.log('使用代理服务器:', baseURL)
      console.log('请求URL:', config.url)
    }

    // 自动添加Cookie到请求头
    const cookieString = cookieManager.getCookieString()
    if (cookieString) {
      config.headers['Cookie'] = cookieString
      console.log('自动添加Cookie到请求:', cookieString)
    }

    // 可以在这里添加token等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 自动保存响应中的Cookie
    const setCookieHeaders = response.headers['set-cookie']
    if (setCookieHeaders) {
      cookieManager.setCookiesFromHeaders(setCookieHeaders)
      console.log('自动保存响应Cookie:', setCookieHeaders)
    }

    // 返回完整的响应对象，包含headers信息
    return response
  },
  (error) => {
    // 详细的错误处理
    console.error('请求错误详情:', {
      code: error.code,
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
    })

    if (error.code === 'ERR_NETWORK') {
      console.error('网络错误，可能的原因:')
      console.error('1. 目标服务器不可达')
      console.error('2. 跨域问题 (CORS)')
      console.error('3. 代理配置错误')
      console.error('4. 网络连接问题')
    } else if (error.code === 'ERR_CANCELED') {
      console.error('请求被取消')
    } else if (error.response) {
      console.error(
        '服务器响应错误:',
        error.response.status,
        error.response.statusText
      )
    }

    return Promise.reject(error)
  }
)

function post(url, params, callback, others = {}) {
  const { contentType, headers = {}, ...externals } = others
  const config = {
    headers: {
      'Content-Type': contentType || 'application/x-www-form-urlencoded',
      ...headers,
    },
    ...(callback && typeof callback === 'object' ? callback : {}),
    ...externals,
  }

  // 自动添加Cookie
  const cookieString = cookieManager.getCookieString()
  if (cookieString) {
    config.headers['Cookie'] = cookieString
  }

  if (config.headers['Content-Type']?.indexOf('x-www-form-urlencoded') !== -1) {
    params = serializeParams(params)
  } else {
    params = typeof params === 'string' ? params : JSON.stringify(params)
  }
  return new Promise((resolve, reject) => {
    request.post(url, params, config).then(
      (response) => {
        typeof callback === 'function' && callback(response?.data)
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

function get(url, params, callback, others = {}) {
  const { contentType, headers = {}, ...externals } = others
  const config = {
    headers: {
      'Content-Type': contentType || 'application/x-www-form-urlencoded',
      ...headers,
    },
    ...(callback && typeof callback === 'object' ? callback : {}),
    ...externals,
  }

  // 自动添加Cookie
  const cookieString = cookieManager.getCookieString()
  if (cookieString) {
    config.headers['Cookie'] = cookieString
  }

  if (config.headers['Content-Type']?.indexOf('x-www-form-urlencoded') !== -1) {
    params = serializeParams(params)
  } else {
    params = typeof params === 'string' ? params : JSON.stringify(params)
  }
  return new Promise((resolve, reject) => {
    request.get(url, params, config).then(
      (response) => {
        typeof callback === 'function' && callback(response?.data)
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

function serializeParams(obj) {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

export const localPost = (url, params, others) =>
  post(url, params, null, {
    contentType: 'application/json;charset=utf-8',
    withCredentials: true,
    ...(others || {}),
  })

export const localGet = (url, params, others) =>
  get(url, params, null, {
    contentType: 'application/json;charset=utf-8',
    ...(others || {}),
  })

/**
 * 获取当前代理服务器地址
 * @returns {string} 当前代理服务器地址
 */
export const getCurrentProxyServerAddress = () => {
  return getCurrentProxyServer()
}

/**
 * 测试代理服务器连接
 * @returns {Promise<boolean>} 连接是否成功
 */
export const testProxyConnection = async () => {
  const currentServer = getCurrentProxyServer()
  if (!currentServer) {
    console.log('没有配置代理服务器')
    return false
  }

  try {
    const baseURL = getProtocolFromTarget(currentServer)
    console.log('测试连接:', baseURL)

    // 发送一个简单的测试请求
    const response = await request.get('/api/', {
      timeout: 5000,
      baseURL: baseURL,
    })

    console.log('连接测试成功:', response.status)
    return true
  } catch (error) {
    console.error('连接测试失败:', error.message)
    return false
  }
}

const AxiosRequest = request
// 导出axios实例
export { AxiosRequest }
export default AxiosRequest
