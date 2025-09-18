// 在浏览器控制台中运行此代码来测试ISO 8601格式转换
// 复制以下代码到浏览器控制台运行

console.log('=== 在浏览器控制台中测试ISO 8601格式 ===')

// 1. 直接使用dayjs测试
const dayjs = require('dayjs') // 如果使用import，改为: import dayjs from 'dayjs'

const isoString = '2025-09-12T09:24:13.000Z'
console.log('原始ISO字符串:', isoString)

// 解析ISO格式
const parsed = dayjs(isoString)
console.log('dayjs解析结果:', parsed.format())
console.log('是否有效:', parsed.isValid())

// 转换为统一格式
const formatted = parsed.format('YYYY-MM-DD HH:mm:ss')
console.log('转换为统一格式:', formatted)

// 转换为时间戳
const timestamp = parsed.valueOf()
console.log('转换为时间戳:', timestamp)

// 时间戳转回字符串
const backToString = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
console.log('时间戳转回字符串:', backToString)

// 2. 测试多种ISO格式
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

// 3. 时区转换示例
console.log('\n=== 时区转换示例 ===')
const utcTime = '2025-09-12T09:24:13.000Z'
console.log('UTC时间:', utcTime)

// 转换为中国时间 (UTC+8)
const chinaTime = dayjs(utcTime).add(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
console.log('中国时间 (UTC+8):', chinaTime)

// 转换为美国东部时间 (UTC-5)
const eastTime = dayjs(utcTime)
  .subtract(5, 'hour')
  .format('YYYY-MM-DD HH:mm:ss')
console.log('美国东部时间 (UTC-5):', eastTime)

console.log('\n=== 测试完成 ===')
