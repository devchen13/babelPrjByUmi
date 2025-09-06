/**
 * Cookie管理工具
 * 用于存储、获取和管理登录认证Cookie
 */
class CookieManager {
  constructor() {
    this.cookies = new Map()
    this.storageKey = 'auth_cookies'
    this.loadFromStorage()
  }

  /**
   * 从本地存储加载Cookie
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const cookies = JSON.parse(stored)
        this.cookies = new Map(Object.entries(cookies))
        console.log('已加载存储的Cookie:', this.cookies.size, '个')
      }
    } catch (error) {
      console.warn('加载Cookie失败:', error.message)
    }
  }

  /**
   * 保存Cookie到本地存储
   */
  saveToStorage() {
    try {
      const cookiesObj = Object.fromEntries(this.cookies)
      localStorage.setItem(this.storageKey, JSON.stringify(cookiesObj))
      console.log('Cookie已保存到本地存储')
    } catch (error) {
      console.warn('保存Cookie失败:', error.message)
    }
  }

  /**
   * 设置Cookie
   * @param {string} name - Cookie名称
   * @param {string} value - Cookie值
   * @param {Object} options - Cookie选项
   */
  setCookie(name, value, options = {}) {
    this.cookies.set(name, {
      value,
      ...options,
      timestamp: Date.now(),
    })
    this.saveToStorage()
    console.log(`设置Cookie: ${name} = ${value}`)
  }

  /**
   * 批量设置Cookie（从响应头）
   * @param {Array|string} setCookieHeaders - set-cookie响应头
   */
  setCookiesFromHeaders(setCookieHeaders) {
    if (!setCookieHeaders) return

    const cookies = Array.isArray(setCookieHeaders)
      ? setCookieHeaders
      : [setCookieHeaders]

    cookies.forEach(cookieString => {
      try {
        const [nameValue, ...options] = cookieString.split(';')
        const [name, value] = nameValue.trim().split('=')

        if (name && value) {
          const cookieOptions = {}

          // 解析Cookie选项
          options.forEach(option => {
            const [key, val] = option.trim().split('=')
            if (key) {
              cookieOptions[key.toLowerCase()] = val || true
            }
          })

          this.setCookie(name, value, cookieOptions)
        }
      } catch (error) {
        console.warn('解析Cookie失败:', cookieString, error.message)
      }
    })
  }

  /**
   * 获取Cookie值
   * @param {string} name - Cookie名称
   * @returns {string|null} Cookie值
   */
  getCookie(name) {
    const cookie = this.cookies.get(name)
    return cookie ? cookie.value : null
  }

  /**
   * 获取所有Cookie
   * @returns {Object} 所有Cookie对象
   */
  getAllCookies() {
    return Object.fromEntries(
      Array.from(this.cookies.entries()).map(([name, cookie]) => [
        name,
        cookie.value,
      ])
    )
  }

  /**
   * 获取Cookie字符串（用于请求头）
   * @returns {string} Cookie字符串
   */
  getCookieString() {
    return Array.from(this.cookies.entries())
      .map(([name, cookie]) => `${name}=${cookie.value}`)
      .join('; ')
  }

  /**
   * 删除Cookie
   * @param {string} name - Cookie名称
   */
  removeCookie(name) {
    this.cookies.delete(name)
    this.saveToStorage()
    console.log(`删除Cookie: ${name}`)
  }

  /**
   * 清空所有Cookie
   */
  clearAllCookies() {
    this.cookies.clear()
    this.saveToStorage()
    console.log('已清空所有Cookie')
  }

  /**
   * 检查是否有认证Cookie
   * @returns {boolean} 是否有认证Cookie
   */
  hasAuthCookies() {
    // 检查常见的认证Cookie名称
    const authCookieNames = [
      'JSESSIONID',
      'sessionid',
      'token',
      'auth',
      'login',
    ]
    return authCookieNames.some(name => this.cookies.has(name))
  }

  /**
   * 获取认证状态
   * @returns {Object} 认证状态信息
   */
  getAuthStatus() {
    return {
      isAuthenticated: this.hasAuthCookies(),
      cookieCount: this.cookies.size,
      cookies: this.getAllCookies(),
      cookieString: this.getCookieString(),
    }
  }

  /**
   * 更新Cookie（如果存在则更新，不存在则添加）
   * @param {string} name - Cookie名称
   * @param {string} value - Cookie值
   * @param {Object} options - Cookie选项
   */
  updateCookie(name, value, options = {}) {
    const existing = this.cookies.get(name)
    this.setCookie(name, value, {
      ...existing,
      ...options,
      timestamp: Date.now(),
    })
  }

  /**
   * 检查Cookie是否过期
   * @param {string} name - Cookie名称
   * @returns {boolean} 是否过期
   */
  isCookieExpired(name) {
    const cookie = this.cookies.get(name)
    if (!cookie) return true

    // 检查max-age
    if (cookie.maxage) {
      const age = Date.now() - cookie.timestamp
      return age > cookie.maxage * 1000
    }

    // 检查expires
    if (cookie.expires) {
      return new Date() > new Date(cookie.expires)
    }

    return false
  }

  /**
   * 清理过期Cookie
   */
  cleanExpiredCookies() {
    const expiredNames = []
    this.cookies.forEach((cookie, name) => {
      if (this.isCookieExpired(name)) {
        expiredNames.push(name)
      }
    })

    expiredNames.forEach(name => {
      this.removeCookie(name)
    })

    if (expiredNames.length > 0) {
      console.log(`清理过期Cookie: ${expiredNames.join(', ')}`)
    }
  }
}

// 创建单例实例
const cookieManager = new CookieManager()

// 导出便捷方法
export const setCookie = cookieManager.setCookie.bind(cookieManager)
export const getCookie = cookieManager.getCookie.bind(cookieManager)
export const getAllCookies = cookieManager.getAllCookies.bind(cookieManager)
export const getCookieString = cookieManager.getCookieString.bind(cookieManager)
export const removeCookie = cookieManager.removeCookie.bind(cookieManager)
export const clearAllCookies = cookieManager.clearAllCookies.bind(cookieManager)
export const setCookiesFromHeaders =
  cookieManager.setCookiesFromHeaders.bind(cookieManager)
export const hasAuthCookies = cookieManager.hasAuthCookies.bind(cookieManager)
export const getAuthStatus = cookieManager.getAuthStatus.bind(cookieManager)

// 导出默认实例
export default cookieManager
