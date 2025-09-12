import axios from 'axios'
import cookieManager from './cookieManager'

// Cookie管理配置
const COOKIE_CONFIG = {
  // 是否通过URL参数传递Cookie（用于特殊需求）
  passCookieViaUrl: false,
  // 是否启用withCredentials
  withCredentials: true,
  // Cookie参数名
  cookieParamName: '_cookie',
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
const AxiosRequest = createRequestInstance()

// 请求拦截器
AxiosRequest.interceptors.request.use(
  (config) => {
    // 注意：浏览器不允许JavaScript直接设置Cookie请求头
    // 使用withCredentials: true让浏览器自动处理Cookie
    // 如果需要手动传递Cookie，可以通过URL参数或其他方式

    // 如果需要传递Cookie信息，可以通过URL参数（可选）
    if (COOKIE_CONFIG.passCookieViaUrl) {
      const cookieString = cookieManager.getCookieString()
      if (cookieString && config.url) {
        // 将Cookie信息作为URL参数传递（仅用于特殊需求）
        const separator = config.url.includes('?') ? '&' : '?'
        config.url += `${separator}${COOKIE_CONFIG.cookieParamName}=${encodeURIComponent(cookieString)}`
        console.log('通过URL参数传递Cookie信息')
      }
    }

    console.log('使用withCredentials自动处理Cookie')

    // 可以在这里添加token等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
AxiosRequest.interceptors.response.use(
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

  // 注意：浏览器不允许JavaScript直接设置Cookie请求头
  // 使用withCredentials: true让浏览器自动处理Cookie

  if (config.headers['Content-Type']?.indexOf('x-www-form-urlencoded') !== -1) {
    params = serializeParams(params)
  } else {
    params = typeof params === 'string' ? params : JSON.stringify(params)
  }
  return new Promise((resolve, reject) => {
    AxiosRequest.post(url, params, config).then(
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

  // 注意：浏览器不允许JavaScript直接设置Cookie请求头
  // 使用withCredentials: true让浏览器自动处理Cookie

  // 对于GET请求，参数应该作为params配置项传递
  if (params) {
    if (
      config.headers['Content-Type']?.indexOf('x-www-form-urlencoded') !== -1
    ) {
      // 对于form-urlencoded格式，将参数序列化后添加到URL
      const serializedParams = serializeParams(params)
      url += (url.includes('?') ? '&' : '?') + serializedParams
    } else {
      // 对于JSON格式，将参数作为params配置项
      config.params = params
    }
  }

  return new Promise((resolve, reject) => {
    AxiosRequest.get(url, config).then(
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

export const fullPost = (url, params, others) =>
  post(url, params, null, {
    contentType: 'application/json;charset=utf-8',
    withCredentials: true,
    ...(others || {}),
  })

export const fullGet = (url, params, others) =>
  get(url, params, null, {
    ...(others || {}),
  })

export const localPost = (url, params, others) =>
  fullPost(url, params, others).then((response) => response.data)

export const localGet = (url, params, others) =>
  fullGet(url, params, others).then((response) => response.data)

/**
 * 配置Cookie管理策略
 * @param {Object} options - 配置选项
 */
export const configureCookieStrategy = (options = {}) => {
  Object.assign(COOKIE_CONFIG, options)
  console.log('Cookie配置已更新:', COOKIE_CONFIG)
}

/**
 * 获取当前Cookie配置
 * @returns {Object} 当前Cookie配置
 */
export const getCookieConfig = () => {
  return { ...COOKIE_CONFIG }
}

// 导出axios实例
export { AxiosRequest }
export default AxiosRequest
