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
    target: globalConfig.baseUrl,
    tid: 'jctx',
    uid: 'c13',
    pwd: 'a888888',
  },
}
