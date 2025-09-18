// dayjs 全局中文本地化使用示例
import dayjs from '@/utils/dayjsConfig'
import DateTimeUtils from '@/utils/dateTimeUtils'

// 示例1: 基本使用
console.log('=== dayjs 全局中文本地化使用示例 ===')

// 直接使用dayjs（已配置为中文）
const now = dayjs()
console.log('当前时间:', now.format('YYYY-MM-DD HH:mm:ss'))
console.log('中文格式:', now.format('YYYY年MM月DD日 HH:mm:ss'))
console.log('星期几:', now.format('dddd'))
console.log('相对时间:', now.subtract(2, 'hour').fromNow())

// 示例2: 使用DateTimeUtils工具
console.log('\n=== DateTimeUtils 工具使用示例 ===')
console.log('当前时间:', DateTimeUtils.getCurrentString())
console.log('中文格式:', DateTimeUtils.toChineseFormat(now))
console.log('星期几:', DateTimeUtils.getChineseWeekday(now))
console.log('月份:', DateTimeUtils.getChineseMonth(now))

// 示例3: ISO 8601格式处理
console.log('\n=== ISO 8601 格式处理示例 ===')
const isoString = '2025-09-12T09:24:13.000Z'
console.log('原始:', isoString)
console.log('转换:', DateTimeUtils.format(isoString))
console.log('中文:', DateTimeUtils.toChineseFormat(isoString))
console.log('相对:', DateTimeUtils.fromNowZh(isoString))

// 示例4: 在React组件中使用
const TodoItem = ({ todo }) => {
  return (
    <div>
      <h3>{todo.title}</h3>
      <p>创建时间: {DateTimeUtils.toChineseFormat(todo.createTime)}</p>
      <p>更新时间: {DateTimeUtils.fromNowZh(todo.updateTime)}</p>
      <p>星期: {DateTimeUtils.getChineseWeekday(todo.createTime)}</p>
    </div>
  )
}

// 示例5: 日期计算
console.log('\n=== 日期计算示例 ===')
const today = DateTimeUtils.getCurrentString()
const tomorrow = DateTimeUtils.add(today, 1, 'day')
const nextWeek = DateTimeUtils.add(today, 7, 'day')
const lastMonth = DateTimeUtils.subtract(today, 1, 'month')

console.log('今天:', today)
console.log('明天:', tomorrow)
console.log('下周:', nextWeek)
console.log('上月:', lastMonth)

// 示例6: 日期范围
console.log('\n=== 日期范围示例 ===')
const dayRange = DateTimeUtils.getDayRange(now)
const weekRange = DateTimeUtils.getWeekRange(now)
const monthRange = DateTimeUtils.getMonthRange(now)

console.log('今天范围:', dayRange)
console.log('本周范围:', weekRange)
console.log('本月范围:', monthRange)

export { TodoItem }
