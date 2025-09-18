import dayjs from 'dayjs'

// 测试ISO 8601格式日期转换
const testISO8601Format = () => {
  console.log('=== dayjs ISO 8601 格式测试 ===')

  // 测试ISO 8601格式
  const isoString = '2025-09-12T09:24:13.000Z'
  console.log('\n原始ISO字符串:', isoString)

  // 1. 直接解析ISO格式
  const parsed = dayjs(isoString)
  console.log('解析后的dayjs对象:', parsed.format())
  console.log('是否有效:', parsed.isValid())

  // 2. 转换为统一格式
  const formatted = parsed.format('YYYY-MM-DD HH:mm:ss')
  console.log('转换为统一格式:', formatted)

  // 3. 转换为时间戳
  const timestamp = parsed.valueOf()
  console.log('转换为时间戳:', timestamp)

  // 4. 转换为本地时间
  const localTime = parsed.format('YYYY-MM-DD HH:mm:ss')
  console.log('本地时间格式:', localTime)

  // 5. 获取UTC时间
  const utcTime = parsed.utc().format('YYYY-MM-DD HH:mm:ss')
  console.log('UTC时间格式:', utcTime)

  // 6. 转换为中国时间 (UTC+8)
  const chinaTime = parsed.add(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
  console.log('中国时间 (UTC+8):', chinaTime)

  return {
    original: isoString,
    formatted,
    timestamp,
    localTime,
    utcTime,
    chinaTime,
  }
}

// 测试多种ISO格式
const testMultipleISOFormats = () => {
  console.log('\n=== 测试多种ISO格式 ===')

  const formats = [
    '2025-09-12T09:24:13.000Z', // 带毫秒的UTC时间
    '2025-09-12T09:24:13Z', // 不带毫秒的UTC时间
    '2025-09-12T09:24:13.000+08:00', // 带时区偏移
    '2025-09-12T09:24:13+08:00', // 不带毫秒的时区偏移
    '2025-09-12T09:24:13', // 不带时区信息
  ]

  formats.forEach((format, index) => {
    console.log(`\n格式 ${index + 1}: ${format}`)
    const parsed = dayjs(format)
    console.log('解析结果:', parsed.format('YYYY-MM-DD HH:mm:ss'))
    console.log('时间戳:', parsed.valueOf())
    console.log('是否有效:', parsed.isValid())
  })
}

// 更新DateTimeUtils工具，添加ISO格式支持
const updateDateTimeUtils = () => {
  console.log('\n=== 更新DateTimeUtils支持ISO格式 ===')

  // 测试现有的DateTimeUtils
  const DateTimeUtils = require('./dateTimeUtils').default

  const isoString = '2025-09-12T09:24:13.000Z'

  // 使用format方法处理ISO格式
  const formatted = DateTimeUtils.format(isoString)
  console.log('ISO格式转换结果:', formatted)

  // 转换为时间戳
  const timestamp = DateTimeUtils.stringToTimestamp(
    isoString,
    'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
  )
  console.log('ISO转时间戳:', timestamp)

  // 时间戳转回字符串
  const backToString = DateTimeUtils.timestampToString(timestamp)
  console.log('时间戳转回字符串:', backToString)
}

export { testISO8601Format, testMultipleISOFormats, updateDateTimeUtils }
