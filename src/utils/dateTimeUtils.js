import dayjs from '@/utils/dayjsConfig'

/**
 * 日期时间工具类
 * 基于dayjs实现，统一格式为 YYYY-MM-DD HH:mm:ss
 */
class DateTimeUtils {
  // 默认格式
  static DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss'

  // 日期格式
  static DATE_FORMAT = 'YYYY-MM-DD'

  // 时间格式
  static TIME_FORMAT = 'HH:mm:ss'

  /**
   * 时间戳转字符串
   * @param {number|string} timestamp - 时间戳（毫秒或秒）
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 格式化后的日期时间字符串
   */
  static timestampToString(timestamp, format = this.DEFAULT_FORMAT) {
    if (!timestamp) {
      return ''
    }

    // 处理秒级时间戳（10位）
    let ts = timestamp
    if (typeof timestamp === 'string') {
      ts = parseInt(timestamp, 10)
    }

    // 如果是秒级时间戳，转换为毫秒
    if (ts.toString().length === 10) {
      ts = ts * 1000
    }

    return dayjs(ts).format(format)
  }

  /**
   * 字符串转时间戳
   * @param {string} dateString - 日期时间字符串
   * @param {string} format - 输入格式，默认为 YYYY-MM-dd HH:mm:ss
   * @returns {number} 时间戳（毫秒）
   */
  static stringToTimestamp(dateString, format = this.DEFAULT_FORMAT) {
    if (!dateString) {
      return 0
    }

    // 如果是ISO 8601格式，直接解析
    if (this.isISO8601Format(dateString)) {
      return dayjs(dateString).valueOf()
    }

    return dayjs(dateString, format).valueOf()
  }

  /**
   * 获取当前时间戳
   * @returns {number} 当前时间戳（毫秒）
   */
  static getCurrentTimestamp() {
    return dayjs().valueOf()
  }

  /**
   * 获取当前时间字符串
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 当前时间字符串
   */
  static getCurrentString(format = this.DEFAULT_FORMAT) {
    return dayjs().format(format)
  }

  /**
   * 格式化日期时间
   * @param {string|number|Date} date - 日期时间
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 格式化后的字符串
   */
  static format(date, format = this.DEFAULT_FORMAT) {
    if (!date) {
      return ''
    }

    // 如果是ISO 8601格式，直接解析
    if (typeof date === 'string' && this.isISO8601Format(date)) {
      return dayjs(date).format(format)
    }

    return dayjs(date).format(format)
  }

  /**
   * 解析日期时间字符串
   * @param {string} dateString - 日期时间字符串
   * @param {string} format - 输入格式，默认为 YYYY-MM-dd HH:mm:ss
   * @returns {dayjs.Dayjs} dayjs对象
   */
  static parse(dateString, format = this.DEFAULT_FORMAT) {
    if (!dateString) {
      return null
    }

    return dayjs(dateString, format)
  }

  /**
   * 判断是否为有效日期
   * @param {string|number|Date} date - 日期时间
   * @returns {boolean} 是否为有效日期
   */
  static isValid(date) {
    if (!date) {
      return false
    }

    return dayjs(date).isValid()
  }

  /**
   * 计算两个日期之间的差值
   * @param {string|number|Date} startDate - 开始日期
   * @param {string|number|Date} endDate - 结束日期
   * @param {string} unit - 单位 ('year', 'month', 'day', 'hour', 'minute', 'second')
   * @returns {number} 差值
   */
  static diff(startDate, endDate, unit = 'day') {
    if (!startDate || !endDate) {
      return 0
    }

    return dayjs(endDate).diff(dayjs(startDate), unit)
  }

  /**
   * 添加时间
   * @param {string|number|Date} date - 基准日期
   * @param {number} value - 数值
   * @param {string} unit - 单位 ('year', 'month', 'day', 'hour', 'minute', 'second')
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 计算后的日期字符串
   */
  static add(date, value, unit = 'day', format = this.DEFAULT_FORMAT) {
    if (!date) {
      return ''
    }

    return dayjs(date).add(value, unit).format(format)
  }

  /**
   * 减去时间
   * @param {string|number|Date} date - 基准日期
   * @param {number} value - 数值
   * @param {string} unit - 单位 ('year', 'month', 'day', 'hour', 'minute', 'second')
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 计算后的日期字符串
   */
  static subtract(date, value, unit = 'day', format = this.DEFAULT_FORMAT) {
    if (!date) {
      return ''
    }

    return dayjs(date).subtract(value, unit).format(format)
  }

  /**
   * 获取相对时间描述
   * @param {string|number|Date} date - 日期时间
   * @returns {string} 相对时间描述
   */
  static fromNow(date) {
    if (!date) {
      return ''
    }

    return dayjs(date).fromNow()
  }

  /**
   * 获取相对时间描述（中文）
   * @param {string|number|Date} date - 日期时间
   * @returns {string} 相对时间描述（中文）
   */
  static fromNowZh(date) {
    if (!date) {
      return ''
    }

    // 使用dayjs内置的中文相对时间
    return dayjs(date).fromNow()
  }

  /**
   * 获取一天的开始时间
   * @param {string|number|Date} date - 日期
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 一天的开始时间
   */
  static startOfDay(date, format = this.DEFAULT_FORMAT) {
    if (!date) {
      return ''
    }

    return dayjs(date).startOf('day').format(format)
  }

  /**
   * 获取一天的结束时间
   * @param {string|number|Date} date - 日期
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 一天的结束时间
   */
  static endOfDay(date, format = this.DEFAULT_FORMAT) {
    if (!date) {
      return ''
    }

    return dayjs(date).endOf('day').format(format)
  }

  /**
   * 比较两个日期
   * @param {string|number|Date} date1 - 第一个日期
   * @param {string|number|Date} date2 - 第二个日期
   * @returns {number} 比较结果 (-1: date1 < date2, 0: date1 = date2, 1: date1 > date2)
   */
  static compare(date1, date2) {
    if (!date1 || !date2) {
      return 0
    }

    const d1 = dayjs(date1)
    const d2 = dayjs(date2)

    if (d1.isBefore(d2)) return -1
    if (d1.isAfter(d2)) return 1
    return 0
  }

  /**
   * 检测是否为ISO 8601格式
   * @param {string} dateString - 日期字符串
   * @returns {boolean} 是否为ISO 8601格式
   */
  static isISO8601Format(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      return false
    }

    // ISO 8601格式正则表达式
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
    return iso8601Regex.test(dateString)
  }

  /**
   * 转换ISO 8601格式到统一格式
   * @param {string} isoString - ISO 8601格式字符串
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 格式化后的字符串
   */
  static fromISO8601(isoString, format = this.DEFAULT_FORMAT) {
    if (!isoString) {
      return ''
    }

    return dayjs(isoString).format(format)
  }

  /**
   * 转换为ISO 8601格式
   * @param {string|number|Date} date - 日期时间
   * @returns {string} ISO 8601格式字符串
   */
  static toISO8601(date) {
    if (!date) {
      return ''
    }

    return dayjs(date).toISOString()
  }

  /**
   * 获取中文格式的日期时间
   * @param {string|number|Date} date - 日期时间
   * @returns {string} 中文格式的日期时间
   */
  static toChineseFormat(date) {
    if (!date) {
      return ''
    }

    return dayjs(date).format('YYYY年MM月DD日 HH:mm:ss')
  }

  /**
   * 获取中文格式的日期
   * @param {string|number|Date} date - 日期时间
   * @returns {string} 中文格式的日期
   */
  static toChineseDate(date) {
    if (!date) {
      return ''
    }

    return dayjs(date).format('YYYY年MM月DD日')
  }

  /**
   * 获取中文格式的时间
   * @param {string|number|Date} date - 日期时间
   * @returns {string} 中文格式的时间
   */
  static toChineseTime(date) {
    if (!date) {
      return ''
    }

    return dayjs(date).format('HH:mm:ss')
  }

  /**
   * 获取星期几（中文）
   * @param {string|number|Date} date - 日期时间
   * @returns {string} 星期几
   */
  static getChineseWeekday(date) {
    if (!date) {
      return ''
    }

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

  /**
   * 获取月份（中文）
   * @param {string|number|Date} date - 日期时间
   * @returns {string} 月份
   */
  static getChineseMonth(date) {
    if (!date) {
      return ''
    }

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

  /**
   * 获取中国时区时间
   * @param {string|number|Date} date - 日期时间
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 中国时区时间
   */
  static toChinaTime(date, format = this.DEFAULT_FORMAT) {
    if (!date) {
      return ''
    }

    return dayjs(date).tz('Asia/Shanghai').format(format)
  }

  /**
   * 获取当前中国时区时间
   * @param {string} format - 输出格式，默认为 YYYY-MM-DD HH:mm:ss
   * @returns {string} 当前中国时区时间
   */
  static getCurrentChinaTime(format = this.DEFAULT_FORMAT) {
    return dayjs().tz('Asia/Shanghai').format(format)
  }
}

export default DateTimeUtils
