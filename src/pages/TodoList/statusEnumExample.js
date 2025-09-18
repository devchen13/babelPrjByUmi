import {
  TODO_STATUS,
  getStatusConfig,
  getNextStatus,
  isValidStatus,
  convertToNewStatus,
  convertToOldStatus,
} from './statusEnum'

// 演示状态枚举的使用
const StatusEnumExample = () => {
  console.log('=== Todo状态枚举使用示例 ===')

  // 1. 状态常量
  console.log('\n1. 状态常量:')
  console.log('未处理:', TODO_STATUS.PENDING) // '0'
  console.log('处理中:', TODO_STATUS.PROCESSING) // '1'
  console.log('已完成:', TODO_STATUS.COMPLETED) // '2'

  // 2. 获取状态配置
  console.log('\n2. 状态配置:')
  const pendingConfig = getStatusConfig(TODO_STATUS.PENDING)
  console.log('未处理配置:', pendingConfig)

  const processingConfig = getStatusConfig(TODO_STATUS.PROCESSING)
  console.log('处理中配置:', processingConfig)

  const completedConfig = getStatusConfig(TODO_STATUS.COMPLETED)
  console.log('已完成配置:', completedConfig)

  // 3. 状态切换
  console.log('\n3. 状态切换:')
  console.log('未处理 →', getNextStatus(TODO_STATUS.PENDING)) // '1'
  console.log('处理中 →', getNextStatus(TODO_STATUS.PROCESSING)) // '2'
  console.log('已完成 →', getNextStatus(TODO_STATUS.COMPLETED)) // '0'

  // 4. 状态验证
  console.log('\n4. 状态验证:')
  console.log('"0" 是否有效:', isValidStatus('0')) // true
  console.log('"1" 是否有效:', isValidStatus('1')) // true
  console.log('"2" 是否有效:', isValidStatus('2')) // true
  console.log('"3" 是否有效:', isValidStatus('3')) // false

  // 5. 兼容性转换
  console.log('\n5. 兼容性转换:')
  console.log('boolean true →', convertToNewStatus(true)) // '2'
  console.log('boolean false →', convertToNewStatus(false)) // '0'
  console.log('string "1" →', convertToNewStatus('1')) // '1'
  console.log('string "2" →', convertToNewStatus('2')) // '2'

  console.log('\n6. 转换为旧状态:')
  console.log('"2" → boolean:', convertToOldStatus('2')) // true
  console.log('"1" → boolean:', convertToOldStatus('1')) // false
  console.log('"0" → boolean:', convertToOldStatus('0')) // false

  // 7. 实际使用示例
  console.log('\n7. 实际使用示例:')
  const mockTodos = [
    { id: 1, title: '任务1', status: TODO_STATUS.PENDING },
    { id: 2, title: '任务2', status: TODO_STATUS.PROCESSING },
    { id: 3, title: '任务3', status: TODO_STATUS.COMPLETED },
    { id: 4, title: '任务4', completed: true }, // 旧格式
    { id: 5, title: '任务5', completed: false }, // 旧格式
  ]

  mockTodos.forEach((todo) => {
    const currentStatus = todo.status || convertToNewStatus(todo.completed)
    const statusConfig = getStatusConfig(currentStatus)
    const nextStatus = getNextStatus(currentStatus)
    const nextStatusConfig = getStatusConfig(nextStatus)

    console.log(`任务${todo.id}: ${todo.title}`)
    console.log(`  当前状态: ${statusConfig.text} (${currentStatus})`)
    console.log(`  下一个状态: ${nextStatusConfig.text} (${nextStatus})`)
    console.log(`  颜色: ${statusConfig.color}`)
    console.log(`  图标: ${statusConfig.icon}`)
    console.log('')
  })

  return {
    statuses: TODO_STATUS,
    examples: mockTodos.map((todo) => ({
      ...todo,
      currentStatus: todo.status || convertToNewStatus(todo.completed),
      statusConfig: getStatusConfig(
        todo.status || convertToNewStatus(todo.completed)
      ),
    })),
  }
}

// API接口示例
const ApiExample = {
  // 获取任务列表
  getTodoList: async () => {
    // 模拟API返回数据
    return {
      data: [
        { id: 1, title: '任务1', status: '0' },
        { id: 2, title: '任务2', status: '1' },
        { id: 3, title: '任务3', status: '2' },
      ],
    }
  },

  // 更新任务状态
  updateTodoStatus: async (id, newStatus) => {
    console.log(`更新任务 ${id} 状态为: ${newStatus}`)
    // 实际API调用
    // return await fetch(`/api/todos/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ status: newStatus })
    // })
  },

  // 切换任务状态
  toggleTodoStatus: async (id, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    return await ApiExample.updateTodoStatus(id, nextStatus)
  },
}

export { StatusEnumExample, ApiExample }
