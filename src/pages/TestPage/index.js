import React from 'react'
import { localGet, localPost } from '@/utils/request'

const TestPage = () => {
  const handleClick = () => {
    console.log('handleClick')
    localGet('/api/users', { email: 'c13@test.com' })
    localPost('/api/todolist/add.do', { title: 'c13@test.com' })
    // localGet('/api/users/all', {})
  }
  return <div onClick={handleClick}>TestPage</div>
}

export default TestPage
