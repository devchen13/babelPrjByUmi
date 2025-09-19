import { Row } from 'antd'

import { localPost } from '@utils/request'
import './index.less'

export default function HomePage() {
  return (
    <div className='page-container'>
      <div className='bottom-section'>
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
      </div>
    </div>
  )
}
