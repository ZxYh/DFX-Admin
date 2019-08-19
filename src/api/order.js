// 订单列表相关api
import request from '../utils/request'
export default {
  // 回收订单管理,紧急订单管理,自有回收者订单任务的订单列表
  orderPagination (obj) {
    return request.get('/pf-api/recycleOrder/pagination', obj)
  },
  // 订单详情
  orderDetail (obj) {
    return request.get('/pf-api/recycleOrder/detail', obj)
  },
  // 紧急订单列表
  urgentPagination (obj) {
    return request.get('/pf-api/recycleOrder/crashOrderPagination', obj)
  },
  // 司机订单任务列表
  driverOrderPagination (obj) {
    return request.get('/pf-api/driverOrder/pagination', obj)
  },
  // 司机订单详情
  driverOrderDetail (obj) {
    return request.get('/pf-api/driverOrder/detail', obj)
  },
  // 司机列表
  driverPagination (obj) {
    return request.get('/pf-api/driver/pagination', obj)
  }
}
