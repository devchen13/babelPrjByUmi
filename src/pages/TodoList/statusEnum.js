/**
 * Todo状态枚举
 * 使用字符串表示状态，便于API传输和存储
 */
export const TODO_STATUS = {
  // 未处理
  PENDING: '0',
  // 处理中
  PROCESSING: '1',
  // 已完成
  COMPLETED: '2',
}

/**
 * 状态显示配置
 */
export const STATUS_CONFIG = {
  [TODO_STATUS.PENDING]: {
    text: '未处理',
    color: '#ff4d4f', // 红色
    icon: 'ExclamationCircleOutlined',
    nextStatus: '处理中',
  },
  [TODO_STATUS.PROCESSING]: {
    text: '处理中',
    color: '#faad14', // 黄色
    icon: 'ClockCircleOutlined',
    nextStatus: '已完成',
  },
  [TODO_STATUS.COMPLETED]: {
    text: '已完成',
    color: '#52c41a', // 绿色
    icon: 'CheckCircleOutlined',
    nextStatus: '未处理',
  },
}

/**
 * 获取状态配置
 * @param {string} status - 状态值
 * @returns {object} 状态配置对象
 */
export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[TODO_STATUS.PENDING]
}

/**
 * 获取下一个状态
 * @param {string} currentStatus - 当前状态
 * @returns {string} 下一个状态
 */
export const getNextStatus = (currentStatus) => {
  switch (currentStatus) {
    case TODO_STATUS.PENDING:
      return TODO_STATUS.PROCESSING
    case TODO_STATUS.PROCESSING:
      return TODO_STATUS.COMPLETED
    case TODO_STATUS.COMPLETED:
      return TODO_STATUS.PENDING
    default:
      return TODO_STATUS.PROCESSING
  }
}

/**
 * 验证状态是否有效
 * @param {string} status - 状态值
 * @returns {boolean} 是否有效
 */
export const isValidStatus = (status) => {
  return Object.values(TODO_STATUS).includes(status)
}

/**
 * 状态转换映射（兼容旧的boolean值）
 * @param {boolean|string} value - 旧的状态值
 * @returns {string} 新的状态值
 */
export const convertToNewStatus = (value) => {
  if (typeof value === 'boolean') {
    return value ? TODO_STATUS.COMPLETED : TODO_STATUS.PENDING
  }
  if (typeof value === 'string') {
    return isValidStatus(value) ? value : TODO_STATUS.PENDING
  }
  return TODO_STATUS.PENDING
}

/**
 * 状态转换映射（转换为旧的boolean值，用于兼容）
 * @param {string} status - 新的状态值
 * @returns {boolean} 旧的boolean值
 */
export const convertToOldStatus = (status) => {
  return status === TODO_STATUS.COMPLETED
}
