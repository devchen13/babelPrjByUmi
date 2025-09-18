import React from 'react'
import { Link, useLocation, Outlet } from 'umi'
// 导入dayjs全局配置，确保整个应用使用中文本地化
import '@/utils/dayjsConfig'
import './index.less'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const menuItems = [
    { path: '/', name: '首页' },
    { path: '/docs', name: '文档' },
    { path: '/login', name: '登录' },
    { path: '/sum-overtime', name: 'static' },
    { path: '/todo-list', name: '待办事项' },
    { path: '/test', name: '测试页面' },
    { path: '/gua', name: 'emm' },
  ]

  return (
    <div className='nav-container'>
      <ul className='nav-list'>
        {menuItems.map((item) => (
          <li key={item.path} className='nav-item'>
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? 'active-link' : ''
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li className='nav-item'>
          <a
            href='https://github.com/umijs/umi'
            target='_blank'
            rel='noopener noreferrer'
            className='external-link'
          >
            Github
          </a>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
