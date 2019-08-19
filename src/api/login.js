import request from '../utils/request'
export default {
  // 登录
  login (obj) {
    return request.postJson('/pf-api/admin/login', obj)
  },
  // 退出登录
  adminLogout (obj) {
    return request.post('/pf-api/admin/logout', obj)
  },
  // 个人权限
  getPersonalInfo (obj) {
    return request.get('/pf-api/admin/getPersonalInfo', obj)
  }
}
