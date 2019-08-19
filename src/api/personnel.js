// 人员管理列表相关api
import request from '../utils/request'
export default {
  // 用户列表
  userPagination (obj) {
    return request.get('/pf-api/user/pagination', obj)
  },
  // 用户详情
  userDetail (obj) {
    return request.get('/pf-api/user/detail', obj)
  },
  // 导出
  userExcel (obj) {
    return request.getBlob('/pf-api/user/excel', obj)
  },
  // 回收者审核列表
  recyclerAuthPagination (obj) {
    return request.get('/pf-api/recyclerAuth/pagination', obj)
  },
  // 回收者审核详情
  recyclerAuthDetail (obj) {
    return request.get('/pf-api/recyclerAuth/detail', obj)
  },
  // 修改审核状态
  recyclerAuthChangeStatus (obj) {
    return request.postJson('/pf-api/recyclerAuth/changeStatus', obj)
  },
  // 回收者列表
  recyclerPagination (obj) {
    return request.get('/pf-api/recycler/pagination', obj)
  },
  // 回收者详情
  recyclerDetail (obj) {
    return request.get('/pf-api/recycler/detail', obj)
  },
  // 修改回收者状态
  recyclerChangeStatus (obj) {
    return request.postJson('/pf-api/recycler/changeStatus', obj)
  },
  // 司机认证审核列表
  driverAuthPagination (obj) {
    return request.get('/pf-api/driverAuth/pagination', obj)
  },
  // 司机认证审核详情
  driverAuthDetail (obj) {
    return request.get('/pf-api/driverAuth/detail', obj)
  },
  // 修改认证状态
  driverAuthChangeStatus (obj) {
    return request.postJson('/pf-api/driverAuth/changeStatus', obj)
  },
  // 司机列表
  driverPagination (obj) {
    return request.get('/pf-api/driver/pagination', obj)
  },
  // 司机详情
  driverDetail (obj) {
    return request.get('/pf-api/driver/detail', obj)
  },
  // 修改司机列状态
  driverChangeStatus (obj) {
    return request.postJson('/pf-api/driver/changeStatus', obj)
  }
}
