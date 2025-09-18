import DateTimeUtils from '@/utils/dateTimeUtils'

// 测试ISO 8601格式转换
const testISO8601Conversion = () => {
  console.log('=== ISO 8601 格式转换测试 ===')

  const isoString = '2025-09-12T09:24:13.000Z'
  console.log('\n原始ISO字符串:', isoString)

  // 1. 检测是否为ISO格式
  const isISO = DateTimeUtils.isISO8601Format(isoString)
  console.log('是否为ISO 8601格式:', isISO)

  // 2. 转换为统一格式
  const formatted = DateTimeUtils.format(isoString)
  console.log('转换为统一格式:', formatted)

  // 3. 使用专门的ISO转换方法
  const fromISO = DateTimeUtils.fromISO8601(isoString)
  console.log('使用fromISO8601方法:', fromISO)

  // 4. 转换为时间戳
  const timestamp = DateTimeUtils.stringToTimestamp(isoString)
  console.log('转换为时间戳:', timestamp)

  // 5. 时间戳转回字符串
  const backToString = DateTimeUtils.timestampToString(timestamp)
  console.log('时间戳转回字符串:', backToString)

  // 6. 转换为ISO格式
  const toISO = DateTimeUtils.toISO8601(timestamp)
  console.log('转换为ISO格式:', toISO)

  return {
    original: isoString,
    formatted,
    timestamp,
    backToString,
    toISO,
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
    console.log('是否为ISO格式:', DateTimeUtils.isISO8601Format(format))
    console.log('转换结果:', DateTimeUtils.format(format))
    console.log('时间戳:', DateTimeUtils.stringToTimestamp(format))
  })
}

// 测试在TodoList中的应用
const testInTodoList = () => {
  console.log('\n=== 在TodoList中的应用测试 ===')

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

  // 格式化显示时间
  const formattedData = {
    ...mockTodoData,
    createTimeFormatted: DateTimeUtils.format(mockTodoData.createTime),
    updateTimeFormatted: DateTimeUtils.format(mockTodoData.updateTime),
  }

  console.log('格式化后的数据:', formattedData)

  return formattedData
}

export { testISO8601Conversion, testMultipleISOFormats, testInTodoList }
