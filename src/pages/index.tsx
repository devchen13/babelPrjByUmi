import { useState } from 'react'

import SumOvertime from './SumOvertime'
import Gua from './Gua'
import { Layout, Row } from 'antd'
import Login from './Login'

export default function HomePage() {
  const aa = 1
  return (
    <Layout>
      <Login />
      <Row>
        <SumOvertime />
      </Row>
      <Row>
        <Gua />
      </Row>
    </Layout>
  )
}
