// 管理员列表相关api
import request from '../utils/request'
export default {
  // 查询全部角色列表
  roleAll (obj) {
    return request.get('/pf-api/role/all', obj)
  },
  // 创建角色
  roleCreate (obj) {
    return request.postJson('/pf-api/role/create', obj)
  },
  // 删除角色
  roleDelete (obj, url) {
    return request.postJson('/pf-api/role/delete/' + url, obj)
  },
  // 禁用角色
  roleDisable (obj, url) {
    return request.post('/pf-api/role/disable/' + url, obj)
  },
  // 启用角色
  roleEnable (obj, url) {
    return request.post('/pf-api/role/enable/' + url, obj)
  },
  // 获取角色详情
  roleGetDetail (obj, url) {
    return request.get('/pf-api/role/getDetail/' + url, obj)
  },
  // 获取全部功能权限
  roleListPermissions (obj) {
    return request.get('/pf-api/role/listPermissions', obj)
  },
  // 分页查询角色列表
  rolePaginate (obj) {
    return request.get('/pf-api/role/paginate', obj)
  },
  // 更新角色
  roleUpdate (obj) {
    return request.postJson('/pf-api/role/update', obj)
  },
  // 修改管理员账号状态
  adminChangeStatus (obj) {
    return request.postJson('/pf-api/admin/changeStatus', obj)
  },
  // 创建管理员
  adminCreate (obj) {
    return request.postJson('/pf-api/admin/create', obj)
  },
  // 删除管理员
  adminDelete (obj) {
    return request.post('/pf-api/admin/delete', obj)
  },
  // 查看管理员
  adminDetail (obj) {
    return request.get('/pf-api/admin/detail', obj)
  },
  // 忘记密码时重置
  adminForgetPwd (obj) {
    return request.post('/pf-api/admin/forgetPwd', obj)
  },
  // 查看个人信息
  adminGetPersonalInfo (obj) {
    return request.get('/pf-api/admin/getPersonalInfo', obj)
  },
  // 修改密码
  adminModifyPwd (obj) {
    return request.post('/pf-api/admin/modifyPwd', obj)
  },
  // 管理员列表
  adminPaginate (obj) {
    return request.get('/pf-api/admin/paginate', obj)
  },
  // 重置管理员密码
  adminResetPwd (obj) {
    return request.post('/pf-api/admin/resetPwd', obj)
  },
  // 忘记密码时，下发邮件验证码
  adminSendForgetCode (obj) {
    return request.post('/pf-api/admin/sendForgetCode', obj)
  },
  // 解锁用户
  adminUnlock (obj) {
    return request.post('/pf-api/admin/unlock', obj)
  },
  // 修改管理员
  adminUpdate (obj) {
    return request.postJson('/pf-api/admin/update', obj)
  }
}
