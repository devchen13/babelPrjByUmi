import React from 'react'
import { Link, useLocation, Outlet } from 'umi'
import { routes } from '../../routerConfig'
import { ThemeProvider, ThemeToggle, useTheme } from '@/contexts/ThemeContext'
import { Layout, Menu } from 'antd'

// 导入dayjs全局配置，确保整个应用使用中文本地化
import '@/utils/dayjsConfig'
import '@/styles/theme.css'
import './index.less'
import './baseVar.less'

const { Sider, Content, Header } = Layout

// 内部布局组件，可以使用 useTheme hook
function LayoutContent() {
  const location = useLocation()
  const { theme } = useTheme()

  // 将路由转换为菜单项
  const menuItems = routes.map((route) => ({
    key: route.path,
    label: (
      <Link
        to={route.path}
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        {route.name}
      </Link>
    ),
  }))

  return (
    <Layout className='layout-container'>
      <Header className='header-container'>
        <ThemeToggle />
      </Header>
      <Layout>
        <Sider width={256} className='sider-container'>
          <div className='sider-header'>导航菜单</div>
          <Menu
            theme={theme}
            mode='inline'
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
        </Sider>
        <Content className='content-container'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default function BaseLayout() {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  )
}
