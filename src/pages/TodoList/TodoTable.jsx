import React from 'react'
import { Table, Button, Tag, Space, Tooltip } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import DateTimeUtils from '@/utils/dateTimeUtils'
import {
  TODO_STATUS,
  getStatusConfig,
  getNextStatus,
  convertToNewStatus,
} from './statusEnum'

const TodoTable = ({
  dataSource = [],
  loading = false,
  pagination = {},
  onEdit,
  onDelete,
  onToggle,
  onPageChange,
}) => {
  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'left',
      render: (status, record) => {
        // 兼容旧数据，将completed转换为新状态
        const currentStatus = status || convertToNewStatus(record.completed)
        const statusConfig = getStatusConfig(currentStatus)
        const nextStatus = getNextStatus(currentStatus)
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
              onClick={() => onToggle && onToggle(record.id, currentStatus)}
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
      ellipsis: {
        showTitle: false,
      },
      render: (title, record) => {
        // 兼容旧数据和新状态
        const currentStatus =
          record.status || convertToNewStatus(record.completed)
        const isCompleted = currentStatus === TODO_STATUS.COMPLETED

        return (
          <Tooltip placement='topLeft' title={title}>
            <span
              style={{
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? '#999' : '#000',
              }}
            >
              {title}
            </span>
          </Tooltip>
        )
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement='topLeft' title={description}>
          <span style={{ color: '#666' }}>{description || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (createTime) => (
        <span style={{ fontSize: '12px', color: '#999' }}>
          {/* iso8601格式 转 YYYY-MM-DD HH:mm:ss*/}
          {DateTimeUtils.format(createTime, 'YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (updateTime) => (
        <span style={{ fontSize: '12px', color: '#999' }}>
          {DateTimeUtils.format(updateTime, 'YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size='small'>
          <Button
            type='link'
            size='small'
            icon={<EditOutlined />}
            onClick={() => onEdit && onEdit(record)}
          >
            编辑
          </Button>
          <Button
            type='link'
            size='small'
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete && onDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey='id'
      pagination={{
        current: pagination.current || 1,
        pageSize: pagination.pageSize || 10,
        total: pagination.total || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: onPageChange,
        onShowSizeChange: onPageChange,
      }}
      scroll={{ x: 900 }}
      size='middle'
    />
  )
}

export default TodoTable
