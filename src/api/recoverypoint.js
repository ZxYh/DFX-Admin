// 回收点列表相关api
import request from '../utils/request'
export default {
  // 回收点列表
  pagination (obj) {
    return request.get('/pf-api/recyclerPoint/pagination', obj)
  },
  // 回收点详情
  pointDetail (obj) {
    return request.get('/pf-api/recyclerPoint/detail', obj)
  },
  // 获取回收商的回收点
  merchantRecyclerPointList (obj) {
    return request.get('/pf-api/recyclerPoint/merchantRecyclerPointList', obj)
  },
  // 新增回收点
  add (obj) {
    return request.post('/pf-api/recyclerPoint/add', obj)
  },
  // 回收量统计
  retrievePager (obj) {
    return request.get('/pf-api/recyclerPoint/retrievePager', obj)
  },
  // 回收统计详情
  retrieveDetail (obj) {
    return request.get('/pf-api/recyclerPoint/retrieveDetail', obj)
  },
  // 更新回收点
  update (obj) {
    return request.post('/pf-api/recyclerPoint/update', obj)
  }
}
