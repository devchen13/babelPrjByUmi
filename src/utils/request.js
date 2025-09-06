import axios from 'axios'
import cookieManager from './cookieManager'

// 创建axios实例
const request = axios.create({
  timeout: 10000,
  withCredentials: true, // 允许跨域请求携带Cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 自动添加Cookie到请求头
    const cookieString = cookieManager.getCookieString()
    if (cookieString) {
      config.headers['Cookie'] = cookieString
      console.log('自动添加Cookie到请求:', cookieString)
    }

    // 可以在这里添加token等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 自动保存响应中的Cookie
    const setCookieHeaders = response.headers['set-cookie']
    if (setCookieHeaders) {
      cookieManager.setCookiesFromHeaders(setCookieHeaders)
      console.log('自动保存响应Cookie:', setCookieHeaders)
    }

    // 返回完整的响应对象，包含headers信息
    return response
  },
  error => {
    // 处理跨域错误
    if (error.code === 'ERR_NETWORK') {
      console.error('网络错误，请检查服务器连接')
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
      response => {
        typeof callback === 'function' && callback(response?.data)
        resolve(response)
      },
      err => {
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
      response => {
        typeof callback === 'function' && callback(response?.data)
        resolve(response)
      },
      err => {
        reject(err)
      }
    )
  })
}

function serializeParams(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
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

const AxiosRequest = request
// 导出axios实例
export { AxiosRequest }
export default AxiosRequest
