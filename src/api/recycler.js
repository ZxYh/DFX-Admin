// 回收商列表相关api
import request from '../utils/request'
export default {
  // 新增回收商
  add (obj) {
    return request.postJson('/pf-api/recyclerMerchant/add', obj)
  },
  // 修改回收商状态
  changeStatus (obj) {
    return request.post('/pf-api/recyclerMerchant/changeStatus', obj)
  },
  // 回收商详情
  detail (obj) {
    return request.get('/pf-api/recyclerMerchant/detail', obj)
  },
  // 回收商列表
  pagination (obj) {
    return request.get('/pf-api/recyclerMerchant/pagination', obj)
  }
}
