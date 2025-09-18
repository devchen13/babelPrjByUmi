import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入中文语言包
import relativeTime from 'dayjs/plugin/relativeTime' // 相对时间插件
import utc from 'dayjs/plugin/utc' // UTC插件
import timezone from 'dayjs/plugin/timezone' // 时区插件
import customParseFormat from 'dayjs/plugin/customParseFormat' // 自定义解析格式插件
import weekOfYear from 'dayjs/plugin/weekOfYear' // 周插件
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter' // 比较插件
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore' // 比较插件
import duration from 'dayjs/plugin/duration' // 持续时间插件

// 配置dayjs插件
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(duration)

// 设置全局本地化为中文
dayjs.locale('zh-cn')

// 设置默认时区为中国时区
dayjs.tz.setDefault('Asia/Shanghai')

// 导出配置好的dayjs实例
export default dayjs

// 导出常用的格式化函数
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format)
}

export const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const formatTime = (date) => {
  return dayjs(date).format('HH:mm:ss')
}

export const formatChineseDateTime = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm:ss')
}

export const formatChineseDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

export const getRelativeTime = (date) => {
  return dayjs(date).fromNow()
}

export const getCurrentTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

export const getCurrentChinaTime = () => {
  return dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
}

// 验证日期是否有效
export const isValidDate = (date) => {
  return dayjs(date).isValid()
}

// 获取时间戳
export const getTimestamp = (date) => {
  return dayjs(date).valueOf()
}

// 从时间戳创建日期
export const fromTimestamp = (timestamp) => {
  return dayjs(timestamp)
}

// 添加时间
export const addTime = (date, value, unit) => {
  return dayjs(date).add(value, unit)
}

// 减去时间
export const subtractTime = (date, value, unit) => {
  return dayjs(date).subtract(value, unit)
}

// 比较日期
export const compareDates = (date1, date2) => {
  const d1 = dayjs(date1)
  const d2 = dayjs(date2)

  if (d1.isBefore(d2)) return -1
  if (d1.isAfter(d2)) return 1
  return 0
}

// 获取星期几（中文）
export const getChineseWeekday = (date) => {
  const weekdays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ]
  return weekdays[dayjs(date).day()]
}

// 获取月份（中文）
export const getChineseMonth = (date) => {
  const months = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ]
  return months[dayjs(date).month()]
}

// 获取一天的开始和结束时间
export const getDayRange = (date) => {
  const d = dayjs(date)
  return {
    start: d.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end: d.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  }
}

// 获取一周的开始和结束时间
export const getWeekRange = (date) => {
  const d = dayjs(date)
  return {
    start: d.startOf('week').format('YYYY-MM-DD HH:mm:ss'),
    end: d.endOf('week').format('YYYY-MM-DD HH:mm:ss'),
  }
}

// 获取一个月的开始和结束时间
export const getMonthRange = (date) => {
  const d = dayjs(date)
  return {
    start: d.startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    end: d.endOf('month').format('YYYY-MM-DD HH:mm:ss'),
  }
}

// 获取一年的开始和结束时间
export const getYearRange = (date) => {
  const d = dayjs(date)
  return {
    start: d.startOf('year').format('YYYY-MM-DD HH:mm:ss'),
    end: d.endOf('year').format('YYYY-MM-DD HH:mm:ss'),
  }
}
