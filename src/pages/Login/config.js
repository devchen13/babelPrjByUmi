import globalConfig from '@GlobalConfig'
export const loginConfig = {
  type: globalConfig.type, // 1：账号登录 2.手机号码登录
  target:"",
  tid: globalConfig.tid,
  uid: globalConfig.uid,
  pwd: globalConfig.pwd,
}
