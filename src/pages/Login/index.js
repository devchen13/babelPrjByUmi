import React from 'react'
import { localPost } from '@utils/request'
import { loginConfig } from './config'
import loginUtils from './LoginUtils'
import LoginForm from './LoginForm'

const Login = () => {
  const handleClick = () => {
    loginUtils.autoLogin({ params: loginConfig })
  }
  return (
    <div>
      <div onClick={handleClick}>
        login-setCookie
        {/* <LoginForm /> */}
      </div>
      <div
        onClick={() => {
          localPost('/api/app/apaas/group/list.do', { origin: '2' })
        }}
      >
        getData
      </div>
      <LoginForm />
    </div>
  )
}

export default Login
