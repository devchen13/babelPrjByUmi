import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'

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

  // 缓存高度计算结果，避免重复计算
  const calculateHeight = useCallback(() => {
    if (!containerRef.current || !footerRef.current || !tableRef.current)
      return 0

    const containerHeight = containerRef.current.offsetHeight
    const footerHeight = footerRef.current.offsetHeight || 0
    const tableHeader = tableRef.current.querySelector(
      '.ant-table-thead'
    ) as HTMLElement
    const headerHeight = tableHeader?.offsetHeight || 0

    return Math.max(containerHeight - footerHeight - headerHeight, minHeight)
  }, [])

  // 使用 useMemo 优化表格滚动配置
  const scrollConfig = useMemo(
    () => ({
      y: tableHeight,
      ...tableProps.scroll,
    }),
    [tableHeight, tableProps.scroll]
  )

  useEffect(() => {
    if (!containerRef.current || !footerRef.current || !tableRef.current) return

    let timeoutId: NodeJS.Timeout | null = null
    let rafId: number | null = null

    const resizeObserver = new ResizeObserver(() => {
      // 使用 requestAnimationFrame 确保在下一帧执行
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        // 防抖处理，避免频繁计算
        if (timeoutId) {
          clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
          const newHeight = calculateHeight()

          // 只有高度真正变化时才更新状态
          setTableHeight((prevHeight) => {
            if (Math.abs((prevHeight || 0) - newHeight) > 1) {
              return newHeight
            }
            return prevHeight
          })
        }, 16) // 约60fps的更新频率
      })
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      resizeObserver.disconnect()
    }
  }, [calculateHeight])

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', display: 'grid', gridTemplateRows: '1fr auto' }}
    >
      <div style={{ overflow: 'hidden' }} ref={tableRef}>
        <Table {...tableProps} scroll={scrollConfig} pagination={false} />
      </div>
      <div style={{ padding: '8px 0' }} ref={footerRef}>
        <Pagination {...pagination} />
      </div>
    </div>
  )
}

export default DataGrid
