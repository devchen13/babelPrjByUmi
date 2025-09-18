import SumOvertime from './SumOvertime'
import Gua from './Gua'
import { Row } from 'antd'
import Login from './Login'

import mockData from './SumOvertime/mockData'
import { localPost } from '@utils/request'
import TestPage from './TestPage'
import TodoList from './TodoList'
import './index.less'

export default function HomePage() {
  const aa = 1
  // return <TodoList />
  // return <TestPage />
  return (
    <div className='page-container'>
      <div className='bottom-section'>
        <Login />
        <Row>
          <div
            onClick={() => {
              // localPost('/api/app/attendance/attstatistics/loadDetailData.do', {
              //   userId: '8029684919709945361',
              //   userName: '陈斌',
              //   field: '',
              //   isContainsNoWork: '0',
              //   startDate: '2025-08-26',
              //   endDate: '2025-09-25',
              //   page: 1,
              //   rows: 100,
              // })
              localPost('/api/app/apaas/metadata/queryFieldList.do', {
                metadataObjectId: '6928086010769155398',
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
      </div>
    </div>
  )
}
