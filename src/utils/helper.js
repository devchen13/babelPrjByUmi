import dayjs from 'dayjs'

/**
 * 十进制数值转为指定长度的二进制字符串，不足位数前面补0
 * @param {number} num 十进制数值
 * @param {number} length 二进制字符串长度（可选，默认6位）
 * @returns {string} 补零后的二进制字符串
 */
export const decimalToBinaryString = (num, length = 6) => {
  let bin = num.toString(2)
  return bin.padStart(length, '0')
}

export const sumOvertimeTool = (list) => {
  const currentDay = dayjs().format('YYYY-MM-DD')
  let overtimeHours = 0
  list?.forEach((item) => {
    let offTime = item?.firstOffRgTime || ''
    if (offTime && item.isWorkingDays === '1') {
      const start = dayjs(`${currentDay} 18:30`)
      const end = dayjs(`${currentDay} ${offTime}`)
      if (end - start <= 0) return
      let overtimeHour = end.diff(start, 'minute')
      // 一小时内  加班时长不统计
      if (overtimeHour < 60) {
        overtimeHour = 0
      }
      overtimeHours += overtimeHour / 60
    }
    if (offTime && item.isWorkingDays === '0') {
      // 初始时间   在8.30之后取实际时间   在8.30前  取8.30
      const start =
        dayjs(`${currentDay} ${item.firstOnRgTime}`) >
        dayjs(`${currentDay} 08:30`)
          ? dayjs(`${currentDay} ${item.firstOnRgTime}`)
          : dayjs(`${currentDay} 08:30`)

      const end = dayjs(`${currentDay} ${offTime}`)

      if (end - start <= 0) return
      // 剥离中午一个半小时时间点
      if (start < dayjs(`${currentDay} 11:30`)) {
        const overtimeHour = dayjs(`${currentDay} 11:30`).diff(start, 'minute')
        overtimeHours += overtimeHour / 60
      }
      if (end > dayjs(`${currentDay} 13:00`)) {
        const overtimeHour = end.diff(dayjs(`${currentDay} 13:00`), 'minute')
        overtimeHours += overtimeHour / 60
      }
    }
  })
  return overtimeHours
}
