import globalConfig from '@GlobalConfig'
export const loginConfig = {
  host: '', // 使用相对路径，通过代理转发
  url: '/api/login',
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + 'token',
  },
  body: {
    "type": "1", // 1：账号登录 2.手机号码登录
    target: globalConfig.baseUrl,
    tid: 'jctx',
    uid: 'c13',
    pwd: 'a888888',
  },
}
