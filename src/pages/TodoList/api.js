import { localPost, localGet } from '@/utils/request'

// TodoList API接口
export const todoListApi = {
  // 获取TodoList列表
  getList: (params) => {
    return localGet('/api/todolist/list.do', params)
  },

  // 添加Todo
  addTodo: (data) => {
    return localPost('/api/todolist/add.do', {
      action: 'add',
      ...data,
    })
  },

  // 更新Todo
  updateTodo: (data) => {
    return localPost('/api/todolist/update.do', {
      action: 'update',
      ...data,
    })
  },

  // 删除Todo
  deleteTodo: (id) => {
    return localPost('/api/todolist/delete.do', {
      action: 'delete',
      id,
    })
  },

  // 切换Todo状态
  toggleTodo: (id, completed) => {
    return localPost('/api/todolist/toggle.do', {
      action: 'toggle',
      id,
      completed,
    })
  },
}
