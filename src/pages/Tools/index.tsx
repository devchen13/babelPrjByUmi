import React from 'react'
import { Layout, Row } from 'antd'
import Gua from './Gua'
import SumOvertime from './SumOvertime'

const Tools = () => {
  return (
    <Layout>
      <Row>
        <SumOvertime />
      </Row>
      <Row>
        <Gua />
      </Row>
    </Layout>
  )
}

export default Tools
