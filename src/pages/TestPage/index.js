import React from 'react'
import { localGet, localPost } from '@/utils/request'
import { Layout, Row, Button } from 'antd'
import BabelTest from './BabelTest'
import Login from '../Login'

const TestPage = () => {
  const handleClick = () => {
    console.log('handleClick')
    localGet('/api/users', { email: 'c13@test.com' })
    localPost('/api/todolist/add.do', { title: 'c13@test.com' })
    // localGet('/api/users/all', {})
  }
  return (
    <div>
      <Row>dddd</Row>
      <Login />
    </div>
  )
  return (
    <Layout>
      <Row>
        <Button onClick={handleClick}>点击</Button>
      </Row>
      <Row>BabelTest</Row>
      <Row>
        <BabelTest />
      </Row>
    </Layout>
  )
}

export default TestPage
