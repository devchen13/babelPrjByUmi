import dayjs from '@/utils/dayjsConfig'
import DateTimeUtils from '@/utils/dateTimeUtils'

// 测试dayjs全局中文本地化
const testGlobalChineseLocale = () => {
  console.log('=== dayjs 全局中文本地化测试 ===')

  const now = dayjs()
  console.log('\n1. 基本格式化测试:')
  console.log('当前时间:', now.format('YYYY-MM-DD HH:mm:ss'))
  console.log('中文格式:', now.format('YYYY年MM月DD日 HH:mm:ss'))
  console.log('星期几:', now.format('dddd'))
  console.log('月份:', now.format('MMMM'))

  console.log('\n2. 相对时间测试:')
  const pastTime = now.subtract(2, 'hour')
  console.log('2小时前:', pastTime.fromNow())

  const futureTime = now.add(1, 'day')
  console.log('1天后:', futureTime.fromNow())

  console.log('\n3. 时区测试:')
  console.log('本地时间:', now.format('YYYY-MM-DD HH:mm:ss'))
  console.log('UTC时间:', now.utc().format('YYYY-MM-DD HH:mm:ss'))
  console.log(
    '中国时区:',
    now.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
  )

  console.log('\n4. DateTimeUtils工具测试:')
  console.log('当前时间:', DateTimeUtils.getCurrentString())
  console.log('中文格式:', DateTimeUtils.toChineseFormat(now))
  console.log('相对时间:', DateTimeUtils.fromNowZh(pastTime))
  console.log('星期几:', DateTimeUtils.getChineseWeekday(now))
  console.log('月份:', DateTimeUtils.getChineseMonth(now))

  console.log('\n5. 日期计算测试:')
  const tomorrow = DateTimeUtils.add(now, 1, 'day')
  const yesterday = DateTimeUtils.subtract(now, 1, 'day')
  console.log('明天:', tomorrow)
  console.log('昨天:', yesterday)

  console.log('\n6. 日期范围测试:')
  const dayRange = DateTimeUtils.getDayRange(now)
  console.log('今天开始:', dayRange.start)
  console.log('今天结束:', dayRange.end)

  return {
    currentTime: now.format('YYYY-MM-DD HH:mm:ss'),
    chineseFormat: DateTimeUtils.toChineseFormat(now),
    relativeTime: DateTimeUtils.fromNowZh(pastTime),
    weekday: DateTimeUtils.getChineseWeekday(now),
    month: DateTimeUtils.getChineseMonth(now),
  }
}

// 测试ISO 8601格式的中文处理
const testISO8601Chinese = () => {
  console.log('\n=== ISO 8601 格式中文处理测试 ===')

  const isoString = '2025-09-12T09:24:13.000Z'
  console.log('原始ISO字符串:', isoString)

  // 使用全局配置的dayjs
  const parsed = dayjs(isoString)
  console.log('解析结果:', parsed.format('YYYY-MM-DD HH:mm:ss'))
  console.log('中文格式:', parsed.format('YYYY年MM月DD日 HH:mm:ss'))
  console.log('相对时间:', parsed.fromNow())

  // 使用DateTimeUtils
  console.log('DateTimeUtils转换:', DateTimeUtils.format(isoString))
  console.log(
    'DateTimeUtils中文格式:',
    DateTimeUtils.toChineseFormat(isoString)
  )
  console.log('DateTimeUtils相对时间:', DateTimeUtils.fromNowZh(isoString))

  return {
    original: isoString,
    formatted: DateTimeUtils.format(isoString),
    chineseFormat: DateTimeUtils.toChineseFormat(isoString),
    relativeTime: DateTimeUtils.fromNowZh(isoString),
  }
}

// 测试在TodoList中的应用
const testTodoListChinese = () => {
  console.log('\n=== TodoList 中文本地化应用测试 ===')

  // 模拟API返回的数据
  const mockTodoData = {
    id: 1,
    title: '测试待办事项',
    description: '这是一个测试',
    completed: false,
    createTime: '2025-09-12T09:24:13.000Z',
    updateTime: '2025-09-12T10:30:45.000Z',
  }

  console.log('原始数据:', mockTodoData)

  // 格式化显示时间（中文）
  const formattedData = {
    ...mockTodoData,
    createTimeFormatted: DateTimeUtils.format(mockTodoData.createTime),
    createTimeChinese: DateTimeUtils.toChineseFormat(mockTodoData.createTime),
    createTimeRelative: DateTimeUtils.fromNowZh(mockTodoData.createTime),
    updateTimeFormatted: DateTimeUtils.format(mockTodoData.updateTime),
    updateTimeChinese: DateTimeUtils.toChineseFormat(mockTodoData.updateTime),
    updateTimeRelative: DateTimeUtils.fromNowZh(mockTodoData.updateTime),
  }

  console.log('格式化后的数据:', formattedData)

  return formattedData
}

export { testGlobalChineseLocale, testISO8601Chinese, testTodoListChinese }
