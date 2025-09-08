import React, { useState } from 'react'

import dayjs from 'dayjs'
import { Input, Button, message, Space } from 'antd'
import mockData from './mockData'

const SumOvertime = () => {
  const defaultData = mockData
  const [data, setData] = useState(defaultData || [])

  const handleSummaryDataChange = result => {
    try {
      if (result?.code === '1') {
        let overtimeHours = sumOvertimeTool(result.data)

        window.overtimeHours = overtimeHours.toFixed(2)
        console.log(overtimeHours.toFixed(2))
        message.success(overtimeHours.toFixed(2))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = () => {
    handleSummaryDataChange({ data, code: '1' })
  }

  return (
    <div style={{ width: '100vw' }}>
      <Space.Compact>
        <Input
          onChange={e => {
            try {
              const objList = JSON.parse(e.target.value || '[]')
              setData(objList)
            } catch (error) {}
          }}
        />
        <Button onClick={handleClick}>ok</Button>
      </Space.Compact>
    </div>
  )
}

export default SumOvertime
