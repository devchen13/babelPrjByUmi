import React from 'react'
import { Card, Typography, Layout } from 'antd'

const { Title, Paragraph } = Typography

const DocsPage = () => {
  return (
    <Layout>
      <Card>
        <Title level={2}>项目文档</Title>
        <Paragraph>这是项目的文档页面。路由功能已经成功配置！</Paragraph>
        <Paragraph>您现在可以通过导航菜单在不同的页面之间切换：</Paragraph>
        <ul>
          <li>首页 - 项目概览和功能导航</li>
          <li>待办事项 - 任务管理功能</li>
          <li>加班统计 - 时间统计工具</li>
          <li>登录系统 - 用户认证</li>
          <li>测试页面 - API 测试</li>
          <li>卦象 - 传统文化展示</li>
        </ul>
      </Card>
    </Layout>
  )
}

export default DocsPage
