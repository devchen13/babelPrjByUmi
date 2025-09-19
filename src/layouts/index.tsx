import React from 'react'
import { Link, useLocation, Outlet } from 'umi'
import { routes } from '../../routerConfig'
// 导入dayjs全局配置，确保整个应用使用中文本地化
import '@/utils/dayjsConfig'
import { ThemeProvider, ThemeToggle } from '@/contexts/ThemeContext'
import './index.less'
import '@/styles/theme.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const menuItems = routes

  return (
    <ThemeProvider>
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
            <ThemeToggle />
          </li>
        </ul>
      </div>
      <Outlet />
    </ThemeProvider>
  )
}
