import DateTimeUtils from '@/utils/dateTimeUtils'

// 使用示例
console.log('=== DateTimeUtils 使用示例 ===')

// 1. 时间戳转字符串
console.log('\n1. 时间戳转字符串:')
const timestamp1 = 1726123453000 // 毫秒时间戳
const timestamp2 = 1726123453 // 秒时间戳
console.log('毫秒时间戳转字符串:', DateTimeUtils.timestampToString(timestamp1))
console.log('秒时间戳转字符串:', DateTimeUtils.timestampToString(timestamp2))
console.log(
  '自定义格式:',
  DateTimeUtils.timestampToString(timestamp1, 'YYYY年MM月dd日 HH:mm:ss')
)

// 2. 字符串转时间戳
console.log('\n2. 字符串转时间戳:')
const dateString = '2025-09-12 09:24:13'
const timestamp = DateTimeUtils.stringToTimestamp(dateString)
console.log('字符串转时间戳:', timestamp)
console.log('时间戳转回字符串:', DateTimeUtils.timestampToString(timestamp))

// 3. 获取当前时间
console.log('\n3. 获取当前时间:')
console.log('当前时间戳:', DateTimeUtils.getCurrentTimestamp())
console.log('当前时间字符串:', DateTimeUtils.getCurrentString())

// 4. 格式化日期
console.log('\n4. 格式化日期:')
const now = new Date()
console.log('格式化当前时间:', DateTimeUtils.format(now))
console.log('只显示日期:', DateTimeUtils.format(now, DateTimeUtils.DATE_FORMAT))
console.log('只显示时间:', DateTimeUtils.format(now, DateTimeUtils.TIME_FORMAT))

// 5. 日期计算
console.log('\n5. 日期计算:')
const today = DateTimeUtils.getCurrentString()
console.log('今天:', today)
console.log('明天:', DateTimeUtils.add(today, 1, 'day'))
console.log('昨天:', DateTimeUtils.subtract(today, 1, 'day'))
console.log('一周后:', DateTimeUtils.add(today, 7, 'day'))

// 6. 相对时间
console.log('\n6. 相对时间:')
const pastTime = DateTimeUtils.subtract(today, 2, 'hour')
console.log('2小时前的时间:', pastTime)
console.log('相对时间描述:', DateTimeUtils.fromNowZh(pastTime))

// 7. 日期比较
console.log('\n7. 日期比较:')
const date1 = '2025-09-12 09:00:00'
const date2 = '2025-09-12 10:00:00'
console.log('比较结果:', DateTimeUtils.compare(date1, date2))

// 8. 一天开始和结束
console.log('\n8. 一天开始和结束:')
const someDate = '2025-09-12 15:30:45'
console.log('开始时间:', DateTimeUtils.startOfDay(someDate))
console.log('结束时间:', DateTimeUtils.endOfDay(someDate))

// 9. 验证日期
console.log('\n9. 验证日期:')
console.log('有效日期:', DateTimeUtils.isValid('2025-09-12 09:24:13'))
console.log('无效日期:', DateTimeUtils.isValid('invalid-date'))

// 10. 时间差计算
console.log('\n10. 时间差计算:')
const start = '2025-09-12 09:00:00'
const end = '2025-09-12 15:30:00'
console.log('相差小时数:', DateTimeUtils.diff(start, end, 'hour'))
console.log('相差分钟数:', DateTimeUtils.diff(start, end, 'minute'))

export default DateTimeUtils
