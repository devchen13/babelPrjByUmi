import React, { useRef, useEffect, useState } from 'react'

import {
  Layout,
  Row,
  Col,
  Table,
  TableProps,
  PaginationProps,
  Pagination,
} from 'antd'

interface DataGridProps {
  tableProps: TableProps<any>
  pagination: PaginationProps
}
const minHeight = 100 // 最小高度200px
const DataGrid = (props: DataGridProps) => {
  const { pagination, tableProps } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableHeight, setTableHeight] = useState<number>()

  useEffect(() => {
    if (!containerRef.current || !footerRef.current || !tableRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerHeight = entry.contentRect.height
        const footerHeight = footerRef.current?.offsetHeight || 0

        // 获取表头高度
        const tableHeader = tableRef.current?.querySelector(
          '.ant-table-thead'
        ) as HTMLElement
        const headerHeight = tableHeader?.offsetHeight || 0

        const newHeight = containerHeight - footerHeight - headerHeight
        setTableHeight(Math.max(newHeight, minHeight))
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', display: 'grid', gridTemplateRows: '1fr auto' }}
    >
      <div style={{ overflow: 'hidden' }} ref={tableRef}>
        <Table {...tableProps} scroll={{ y: tableHeight }} pagination={false} />
      </div>
      <div style={{ padding: '8px 0' }} ref={footerRef}>
        <Pagination {...pagination} />
      </div>
    </div>
  )
}

export default DataGrid
