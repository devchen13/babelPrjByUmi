import dayjs from 'dayjs'
import qs from 'qs'

/**
 * 使用qs库获取Hash路由中的查询参数
 * @param {string} paramName - 参数名称
 * @returns {string|null} 参数值
 */
export const getHashParamWithQs = (paramName) => {
  try {
    const hash = window.location.hash
    const queryString = hash.split('?')[1]
    if (!queryString) return null

    const params = qs.parse(queryString)
    return params[paramName] || null
  } catch (error) {
    console.warn('使用qs解析Hash参数失败:', error.message)
    return null
  }
}

/**
 * 使用qs库获取所有Hash路由中的查询参数
 * @returns {Object} 参数对象
 */
export const getAllHashParamsWithQs = () => {
  try {
    const hash = window.location.hash
    const queryString = hash.split('?')[1]
    if (!queryString) return {}

    return qs.parse(queryString)
  } catch (error) {
    console.warn('使用qs解析Hash参数失败:', error.message)
    return {}
  }
}

/**
 * 使用qs库获取URL中的查询参数
 * @param {string} paramName - 参数名称
 * @param {string} url - 可选的URL，默认使用当前页面URL
 * @returns {string|null} 参数值
 */
export const getUrlParamWithQs = (paramName, url = window.location.href) => {
  try {
    const urlObj = new URL(url)
    const queryString = urlObj.search.substring(1) // 去掉开头的?
    if (!queryString) return null

    const params = qs.parse(queryString)
    return params[paramName] || null
  } catch (error) {
    console.warn('使用qs解析URL参数失败:', error.message)
    return null
  }
}

/**
 * 使用qs库获取所有URL查询参数
 * @param {string} url - 可选的URL，默认使用当前页面URL
 * @returns {Object} 参数对象
 */
export const getAllUrlParamsWithQs = (url = window.location.href) => {
  try {
    const urlObj = new URL(url)
    const queryString = urlObj.search.substring(1) // 去掉开头的?
    if (!queryString) return {}

    return qs.parse(queryString)
  } catch (error) {
    console.warn('使用qs解析URL参数失败:', error.message)
    return {}
  }
}

/**
 * 十进制数值转为指定长度的二进制字符串，不足位数前面补0
 * @param {number} num 十进制数值
 * @param {number} length 二进制字符串长度（可选，默认6位）
 * @returns {string} 补零后的二进制字符串
 */
export const decimalToBinaryString = (num, length = 6) => {
  let bin = num.toString(2)
  return bin.padStart(length, '0')
}

export const sumOvertimeTool = (list) => {
  const currentDay = dayjs().format('YYYY-MM-DD')
  let overtimeHours = 0
  list?.forEach((item) => {
    let offTime = item?.firstOffRgTime || ''
    if (offTime && item.isWorkingDays === '1') {
      const start = dayjs(`${currentDay} 18:30`)
      const end = dayjs(`${currentDay} ${offTime}`)
      if (end - start <= 0) return
      let overtimeHour = end.diff(start, 'minute')
      // 一小时内  加班时长不统计
      if (overtimeHour < 60) {
        overtimeHour = 0
      }
      overtimeHours += overtimeHour / 60
    }
    if (offTime && item.isWorkingDays === '0') {
      // 初始时间   在8.30之后取实际时间   在8.30前  取8.30
      const start =
        dayjs(`${currentDay} ${item.firstOnRgTime}`) >
        dayjs(`${currentDay} 08:30`)
          ? dayjs(`${currentDay} ${item.firstOnRgTime}`)
          : dayjs(`${currentDay} 08:30`)

      const end = dayjs(`${currentDay} ${offTime}`)

      if (end - start <= 0) return
      // 剥离中午一个半小时时间点
      if (start < dayjs(`${currentDay} 11:30`)) {
        const overtimeHour = dayjs(`${currentDay} 11:30`).diff(start, 'minute')
        overtimeHours += overtimeHour / 60
      }
      if (end > dayjs(`${currentDay} 13:00`)) {
        const overtimeHour = end.diff(dayjs(`${currentDay} 13:00`), 'minute')
        overtimeHours += overtimeHour / 60
      }
    }
  })
  return overtimeHours
}
