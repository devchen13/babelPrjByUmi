import { Link, Outlet } from 'umi'
import styles from './index.less'
// 导入dayjs全局配置，确保整个应用使用中文本地化
import '@/utils/dayjsConfig'

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/docs'>Docs</Link>
        </li>
        <li>
          <a href='https://github.com/umijs/umi'>Github</a>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
