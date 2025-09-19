import {
  Layout,
  Row,
  Col,
  Table,
  TableProps,
  PaginationProps,
  Pagination,
} from 'antd'
import React from 'react'

interface DataGridProps {
  tableProps: TableProps<any>
  pagination: PaginationProps
}

const DataGrid = (props: DataGridProps) => {
  const { pagination, tableProps } = props
  return (
    <Layout>
      <Table {...tableProps} />
      <Pagination {...pagination} />
    </Layout>
  )
}

export default DataGrid
