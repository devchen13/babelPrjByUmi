import DateTimeUtils from '@/utils/dateTimeUtils'

// 测试用例
const testDateTimeUtils = () => {
  console.log('=== DateTimeUtils 测试 ===')

  // 测试1: 时间戳转字符串
  console.log('\n测试1: 时间戳转字符串')
  const timestamp = 1726123453000
  const formatted = DateTimeUtils.timestampToString(timestamp)
  console.log(`时间戳 ${timestamp} -> ${formatted}`)

  // 测试2: 字符串转时间戳
  console.log('\n测试2: 字符串转时间戳')
  const dateStr = '2025-09-12 09:24:13'
  const timestamp2 = DateTimeUtils.stringToTimestamp(dateStr)
  console.log(`字符串 ${dateStr} -> 时间戳 ${timestamp2}`)

  // 测试3: 验证转换的准确性
  console.log('\n测试3: 验证转换的准确性')
  const backToString = DateTimeUtils.timestampToString(timestamp2)
  console.log(`时间戳 ${timestamp2} -> ${backToString}`)
  console.log(`转换是否准确: ${dateStr === backToString}`)

  // 测试4: 当前时间
  console.log('\n测试4: 当前时间')
  console.log(`当前时间戳: ${DateTimeUtils.getCurrentTimestamp()}`)
  console.log(`当前时间字符串: ${DateTimeUtils.getCurrentString()}`)

  // 测试5: 日期计算
  console.log('\n测试5: 日期计算')
  const today = DateTimeUtils.getCurrentString()
  const tomorrow = DateTimeUtils.add(today, 1, 'day')
  const yesterday = DateTimeUtils.subtract(today, 1, 'day')
  console.log(`今天: ${today}`)
  console.log(`明天: ${tomorrow}`)
  console.log(`昨天: ${yesterday}`)

  // 测试6: 相对时间
  console.log('\n测试6: 相对时间')
  const pastTime = DateTimeUtils.subtract(today, 2, 'hour')
  console.log(`2小时前: ${pastTime}`)
  console.log(`相对时间: ${DateTimeUtils.fromNowZh(pastTime)}`)

  // 测试7: 日期验证
  console.log('\n测试7: 日期验证')
  console.log(`有效日期: ${DateTimeUtils.isValid('2025-09-12 09:24:13')}`)
  console.log(`无效日期: ${DateTimeUtils.isValid('invalid')}`)

  return true
}

export default testDateTimeUtils
