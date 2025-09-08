import { useState } from 'react'

import SumOvertime from './SumOvertime'
import Gua from './Gua'
import { Layout, Row } from 'antd'
import Login from './Login'
import mockData from './SumOvertime/mockData'
import { localPost } from '@utils/request'

export default function HomePage() {
  const aa = 1
  return (
    <Layout>
      <Login />
      <Row>
        <div
          onClick={() => {
            localPost('/api/app/apaas/metadata/queryFieldList.do', {
              metadataObjectId: '5641569516017122737',
              excludeFieldList: ['id'],
              isIncludeDisabledField: true,
              forceDb: true,
            })
          }}
        >
          getData
        </div>
      </Row>
      <Row>
        <SumOvertime defaultData={mockData} />
      </Row>

      <Row>
        <Gua />
      </Row>
    </Layout>
  )
}
