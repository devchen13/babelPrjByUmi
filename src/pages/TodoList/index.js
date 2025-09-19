import React, { useState, useEffect } from 'react'

import {
  TODO_STATUS,
  getNextStatus,
  getStatusConfig,
  convertToNewStatus,
} from './statusEnum'
import { todoListApi } from './api'

import { PlusOutlined } from '@ant-design/icons'
import { Input, Button, Space, message, Form, Layout } from 'antd'
import Dialog from '@components/Dialog'
import TodoTable from './TodoTable'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [editForm] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 获取TodoList
  const fetchTodos = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const response = await todoListApi.getList({
        page,
        pageSize,
        sortBy: 'createdAt',
        sortOrder: 'asc',
      })
      if (response.data) {
        const { items = [], meta } = response.data
        const { total = 0 } = meta
        setTodos(items)
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total,
        }))
      } else {
        message.error('获取列表失败')
      }
    } catch (error) {
      console.error('获取TodoList失败:', error)
      message.error('获取列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 添加Todo
  const addTodo = async () => {
    if (!newTodo.trim()) {
      message.warning('请输入待办事项')
      return
    }

    try {
      const response = await todoListApi.addTodo({
        title: newTodo.trim(),
        status: TODO_STATUS.PENDING, // 使用新的状态枚举
        createTime: new Date().toISOString(),
      })

      if (response.data) {
        message.success('添加成功')
        setNewTodo('')
        fetchTodos()
      } else {
        message.error('添加失败')
      }
    } catch (error) {
      console.error('添加Todo失败:', error)
      message.error('添加失败')
    }
  }

  // 更新Todo
  const updateTodo = async (values) => {
    try {
      const response = await todoListApi.updateTodo({
        id: editingTodo.id,
        ...values,
      })

      if (response.data) {
        message.success('更新成功')
        setModalVisible(false)
        setEditingTodo(null)
        editForm.resetFields()
        fetchTodos()
      } else {
        message.error('更新失败')
      }
    } catch (error) {
      console.error('更新Todo失败:', error)
      message.error('更新失败')
    }
  }

  // 删除Todo
  const deleteTodo = async (id) => {
    Dialog.confirm({
      title: '确认删除',
      content: '确定要删除这个待办事项吗？',
      onOk: async () => {
        try {
          const response = await todoListApi.deleteTodo(id)
          if (response.data) {
            message.success('删除成功')
            fetchTodos()
          } else {
            message.error('删除失败')
          }
        } catch (error) {
          console.error('删除Todo失败:', error)
          message.error('删除失败')
        }
      },
    })
  }

  // 切换状态 - 支持三种状态循环切换
  const toggleStatus = async (id, currentStatus) => {
    try {
      // 获取下一个状态
      const nextStatus = getNextStatus(currentStatus)
      const currentConfig = getStatusConfig(currentStatus)
      const nextConfig = getStatusConfig(nextStatus)

      const response = await todoListApi.updateStatus(id, nextStatus)
      if (response.data) {
        message.success(
          `状态更新成功: ${currentConfig.text} → ${nextConfig.text}`
        )
        fetchTodos()
      } else {
        message.error('状态更新失败')
      }
    } catch (error) {
      console.error('切换Todo状态失败:', error)
      message.error('状态更新失败')
    }
  }

  // 编辑Todo
  const editTodo = (todo) => {
    setEditingTodo(todo)
    editForm.setFieldsValue({
      title: todo.title,
      description: todo.description || '',
    })
    setModalVisible(true)
  }

  // 分页变化处理
  const handlePageChange = (page, pageSize) => {
    fetchTodos(page, pageSize)
  }

  // 组件挂载时获取数据
  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <Layout className='full-height'>
      {/* 添加新Todo */}
      <Space.Compact style={{ width: '100%', marginBottom: '20px' }}>
        <Input
          placeholder='请输入待办事项'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onPressEnter={addTodo}
          style={{ flex: 1 }}
        />
        <Button type='primary' icon={<PlusOutlined />} onClick={addTodo}>
          添加
        </Button>
      </Space.Compact>
      <Layout.Content>
        {/* Todo表格 */}
        <TodoTable
          dataSource={todos}
          loading={loading}
          pagination={pagination}
          onEdit={editTodo}
          onDelete={deleteTodo}
          onToggle={toggleStatus}
          onPageChange={handlePageChange}
        />
      </Layout.Content>

      {/* 编辑Modal */}
      <Dialog
        title='编辑待办事项'
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingTodo(null)
          editForm.resetFields()
        }}
        footer={null}
      >
        <Form form={editForm} layout='vertical' onFinish={updateTodo}>
          <Form.Item
            name='title'
            label='标题'
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder='请输入标题' />
          </Form.Item>

          <Form.Item name='description' label='描述'>
            <Input.TextArea placeholder='请输入描述（可选）' rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit'>
                保存
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false)
                  setEditingTodo(null)
                  editForm.resetFields()
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Dialog>
    </Layout>
  )
}

export default TodoList
