import React from 'react'
import { Table, Button, Space, Tooltip } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {
  TODO_STATUS,
  getStatusConfig,
  getNextStatus,
  convertToNewStatus,
} from './statusEnum'

// 演示新的状态列功能
const StatusColumnDemo = () => {
  const mockData = [
    {
      id: 1,
      title: '完成项目文档',
      description: '编写项目需求文档',
      status: TODO_STATUS.COMPLETED, // 已完成
      createTime: '2025-01-27 09:00:00',
      updateTime: '2025-01-27 10:30:00',
    },
    {
      id: 2,
      title: '代码审查',
      description: '审查团队成员提交的代码',
      status: TODO_STATUS.PROCESSING, // 处理中
      createTime: '2025-01-27 09:30:00',
      updateTime: '2025-01-27 11:00:00',
    },
    {
      id: 3,
      title: '测试用例编写',
      description: '为新增功能编写测试用例',
      status: TODO_STATUS.PENDING, // 未处理
      createTime: '2025-01-27 10:00:00',
      updateTime: '2025-01-27 12:00:00',
    },
  ]

  const handleToggleStatus = (id, currentStatus) => {
    const statusConfig = getStatusConfig(currentStatus)
    const nextStatus = getNextStatus(currentStatus)
    const nextStatusConfig = getStatusConfig(nextStatus)

    console.log(
      `切换状态: ID=${id}, 当前状态=${statusConfig.text} → ${nextStatusConfig.text}`
    )
    // 这里会调用API切换状态
    // 实际项目中会调用 onToggle(id, currentStatus)
  }

  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'left',
      render: (status, record) => {
        const statusConfig = getStatusConfig(status)
        const nextStatus = getNextStatus(status)
        const nextStatusConfig = getStatusConfig(nextStatus)

        // 根据状态配置获取对应的图标
        const getStatusIcon = () => {
          const iconProps = { fontSize: '16px', color: statusConfig.color }
          switch (statusConfig.icon) {
            case 'CheckCircleOutlined':
              return <CheckCircleOutlined style={iconProps} />
            case 'ClockCircleOutlined':
              return <ClockCircleOutlined style={iconProps} />
            case 'ExclamationCircleOutlined':
              return <ExclamationCircleOutlined style={iconProps} />
            default:
              return <ExclamationCircleOutlined style={iconProps} />
          }
        }

        return (
          <Tooltip title={`${statusConfig.text} → ${nextStatusConfig.text}`}>
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s',
                border: '1px solid transparent',
              }}
              onClick={() => handleToggleStatus(record.id, record.status)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.borderColor = statusConfig.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
              }}
            >
              {getStatusIcon()}
              <span
                style={{
                  fontSize: '12px',
                  color: statusConfig.color,
                  fontWeight: '500',
                }}
              >
                {statusConfig.text}
              </span>
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => {
        const isCompleted = record.status === TODO_STATUS.COMPLETED
        return (
          <span
            style={{
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? '#999' : '#000',
            }}
          >
            {title}
          </span>
        )
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h2>状态列功能演示</h2>
      <p>点击状态列可以切换任务状态，状态列固定在左侧</p>

      <Table
        columns={columns}
        dataSource={mockData}
        rowKey='id'
        scroll={{ x: 800 }}
        size='middle'
      />

      <div style={{ marginTop: '20px' }}>
        <h3>功能说明：</h3>
        <ul>
          <li>
            ✅ <strong>左固定</strong>：状态列固定在表格左侧，滚动时不会移动
          </li>
          <li>
            🎨 <strong>三种状态</strong>：
            <ul>
              <li>红色 ⚠️ 未处理 (0)</li>
              <li>黄色 ⏰ 处理中 (1)</li>
              <li>绿色 ✓ 已完成 (2)</li>
            </ul>
          </li>
          <li>
            🖱️ <strong>点击切换</strong>：点击状态列可以循环切换任务状态
          </li>
          <li>
            💡 <strong>悬停效果</strong>：鼠标悬停时显示边框和背景色
          </li>
          <li>
            📝 <strong>提示信息</strong>：显示当前状态和切换后的状态
          </li>
        </ul>
      </div>
    </div>
  )
}

export default StatusColumnDemo
