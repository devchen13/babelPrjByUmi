import React from 'react'
import { localGet, localPost } from '@utils/request'
import { loginConfig } from './config'
import loginUtils from './LoginUtils'
import LoginForm from './LoginForm'

const Login = () => {
  const handleClick = () => {
    console.log('Login')
    loginUtils.autoLogin({ params: loginConfig.body })
    // localGet(`${loginConfig.host}${loginConfig.url}`, loginConfig.body, loginConfig.headers).then(
    //   res => {
    //     console.log(res)
    //   }
    // )
  }
  return (
    <div>
      <div onClick={handleClick}>
        dddddddddddddddddddddddddddd
        {/* <LoginForm /> */}
      </div>
      <div
        onClick={() => {
          localPost('/api/app/apaas/group/list.do', { origin: '2' })
        }}
      >
        cccccccccccccccccccccccccccc
        {/* <LoginForm /> */}
      </div>
    </div>
  )
}

export default Login
