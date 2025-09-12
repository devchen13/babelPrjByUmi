import React, { useState, useEffect } from 'react'
import {
  Card,
  Input,
  Button,
  List,
  Checkbox,
  Space,
  message,
  Modal,
  Form,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { todoListApi } from './api'

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [editForm] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  // 获取TodoList
  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await todoListApi.getList({ action: 'list' })
      if (response.data) {
        setTodos(response.data || [])
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
        completed: false,
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
    Modal.confirm({
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

  // 切换完成状态
  const toggleTodo = async (id, completed) => {
    try {
      const response = await todoListApi.toggleTodo(id, !completed)
      if (response.data) {
        message.success('状态更新成功')
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

  // 组件挂载时获取数据
  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title='TodoList 待办事项' style={{ marginBottom: '20px' }}>
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

        {/* Todo列表 */}
        <List
          loading={loading}
          dataSource={todos}
          renderItem={(todo) => (
            <List.Item
              actions={[
                <Button
                  key='edit'
                  type='link'
                  icon={<EditOutlined />}
                  onClick={() => editTodo(todo)}
                >
                  编辑
                </Button>,
                <Button
                  key='delete'
                  type='link'
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteTodo(todo.id)}
                >
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                }
                title={
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#999' : '#000',
                    }}
                  >
                    {todo.title}
                  </span>
                }
                description={
                  <div>
                    {todo.description && (
                      <div style={{ marginTop: '4px', color: '#666' }}>
                        {todo.description}
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: '4px',
                        fontSize: '12px',
                        color: '#999',
                      }}
                    >
                      创建时间: {new Date(todo.createTime).toLocaleString()}
                      {todo.updateTime && (
                        <span>
                          {' '}
                          | 更新时间:{' '}
                          {new Date(todo.updateTime).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 编辑Modal */}
      <Modal
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
      </Modal>
    </div>
  )
}

export default TodoList
