import { TODO_STATUS, getNextStatus, getStatusConfig } from './statusEnum'

// 演示状态循环切换
const StatusCycleDemo = () => {
  console.log('=== Todo状态循环切换演示 ===')

  // 模拟状态切换过程
  let currentStatus = TODO_STATUS.PENDING // 从未处理开始

  console.log('\n状态循环切换过程:')

  for (let i = 0; i < 6; i++) {
    const statusConfig = getStatusConfig(currentStatus)
    const nextStatus = getNextStatus(currentStatus)
    const nextConfig = getStatusConfig(nextStatus)

    console.log(`第${i + 1}次点击:`)
    console.log(`  当前状态: ${statusConfig.text} (${currentStatus})`)
    console.log(`  下一个状态: ${nextConfig.text} (${nextStatus})`)
    console.log(`  颜色: ${statusConfig.color}`)
    console.log(`  图标: ${statusConfig.icon}`)
    console.log('')

    // 切换到下一个状态
    currentStatus = nextStatus
  }

  // 验证循环完整性
  console.log('循环验证:')
  const allStatuses = [
    TODO_STATUS.PENDING,
    TODO_STATUS.PROCESSING,
    TODO_STATUS.COMPLETED,
  ]

  allStatuses.forEach((status) => {
    const config = getStatusConfig(status)
    const next = getNextStatus(status)
    const nextConfig = getStatusConfig(next)

    console.log(`${config.text} → ${nextConfig.text}`)
  })

  return {
    cycle: [
      { from: TODO_STATUS.PENDING, to: TODO_STATUS.PROCESSING },
      { from: TODO_STATUS.PROCESSING, to: TODO_STATUS.COMPLETED },
      { from: TODO_STATUS.COMPLETED, to: TODO_STATUS.PENDING },
    ],
  }
}

// 模拟API调用
const ApiStatusUpdate = {
  // 模拟更新状态API
  updateStatus: async (id, newStatus) => {
    console.log(`API调用: 更新任务 ${id} 状态为 ${newStatus}`)

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟成功响应
    return {
      success: true,
      data: {
        id,
        status: newStatus,
        updateTime: new Date().toISOString(),
      },
    }
  },

  // 模拟状态切换API
  toggleStatus: async (id, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    const currentConfig = getStatusConfig(currentStatus)
    const nextConfig = getStatusConfig(nextStatus)

    console.log(`切换状态: ${currentConfig.text} → ${nextConfig.text}`)

    return await ApiStatusUpdate.updateStatus(id, nextStatus)
  },
}

// 实际使用示例
const RealWorldExample = async () => {
  console.log('\n=== 实际使用示例 ===')

  const todo = {
    id: 1,
    title: '完成项目文档',
    status: TODO_STATUS.PENDING,
  }

  console.log('初始任务:', todo)

  // 模拟用户点击状态切换
  let currentStatus = todo.status

  for (let i = 0; i < 3; i++) {
    const result = await ApiStatusUpdate.toggleStatus(todo.id, currentStatus)

    if (result.success) {
      console.log(`第${i + 1}次切换成功:`, result.data)
      currentStatus = result.data.status
    }
  }

  console.log('最终状态:', currentStatus)
}

export { StatusCycleDemo, ApiStatusUpdate, RealWorldExample }
