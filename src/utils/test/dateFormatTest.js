import dayjs from '@/utils/dayjsConfig'
import DateTimeUtils from '@/utils/dateTimeUtils'

// 测试日期格式是否正确
const testDateFormat = () => {
  console.log('=== 测试日期格式 YYYY-MM-DD ===')

  const now = dayjs()

  // 测试基本格式
  console.log('当前时间 (YYYY-MM-DD):', now.format('YYYY-MM-DD HH:mm:ss'))
  console.log('当前日期 (YYYY-MM-DD):', now.format('YYYY-MM-DD'))

  // 测试DateTimeUtils
  console.log('DateTimeUtils当前时间:', DateTimeUtils.getCurrentString())
  console.log(
    'DateTimeUtils当前日期:',
    DateTimeUtils.format(now, DateTimeUtils.DATE_FORMAT)
  )

  // 测试ISO 8601转换
  const isoString = '2025-09-12T09:24:13.000Z'
  console.log('ISO转换结果:', DateTimeUtils.format(isoString))

  // 验证格式
  const formatted = now.format('YYYY-MM-DD HH:mm:ss')
  const isCorrectFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(
    formatted
  )
  console.log('格式验证:', isCorrectFormat ? '✅ 正确' : '❌ 错误')

  return {
    formatted,
    isCorrectFormat,
    dateOnly: now.format('YYYY-MM-DD'),
    timeOnly: now.format('HH:mm:ss'),
  }
}

// 测试日期和星期几的区别
const testDateVsWeekday = () => {
  console.log('\n=== 测试日期 vs 星期几 ===')

  const testDate = dayjs('2025-09-12') // 2025年9月12日，星期五

  console.log('测试日期: 2025-09-12')
  console.log('日期 (DD):', testDate.format('YYYY-MM-DD')) // 2025-09-12
  console.log('星期几 (dd):', testDate.format('dddd')) // 星期五
  console.log('星期几 (ddd):', testDate.format('ddd')) // 周五
  console.log('星期几 (dd):', testDate.format('dd')) // 05 (星期五)

  console.log('\n格式说明:')
  console.log('DD = 日期 (01-31)')
  console.log('dd = 星期几 (00-06)')
  console.log('ddd = 星期几缩写 (周五)')
  console.log('dddd = 星期几全名 (星期五)')
}

export { testDateFormat, testDateVsWeekday }
