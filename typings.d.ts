import 'umi/typings'

declare module 'umi' {
  import { ComponentType, ReactNode } from 'react'

  export const Link: ComponentType<{
    to: string
    children: ReactNode
    style?: React.CSSProperties
    className?: string
  }>

  export const useLocation: () => {
    pathname: string
    search: string
    hash: string
    state: any
  }
  export const Outlet: ComponentType<{
    children: ReactNode
  }>

  //   export const history: {
  //     push: (path: string) => void
  //     replace: (path: string) => void
  //     goBack: () => void
  //     goForward: () => void
  //     go: (n: number) => void
  //     listen: (listener: (location: any) => void) => () => void
  //   }
}
