// 财务列表相关api
import request from '../utils/request'
export default {
  // 审核提现申请
  withdrawChange (obj) {
    return request.postJson('/pf-api/withdraw/changeStaus', obj)
  },
  // 批量审核提现申请
  withdrawChangeMultiple (obj) {
    return request.postJson('/pf-api/withdraw/changeStausMultiple', obj)
  },
  // 提现申请详情
  withdrawDetail (obj) {
    return request.get('/pf-api/withdraw/detail', obj)
  },
  // 提现申请列表
  withdrawPagination (obj) {
    return request.get('/pf-api/withdraw/pagination', obj)
  },
  // 导出提现申请列表
  withdrawExcel (obj) {
    return request.getBlob('/pf-api/withdraw/excel', obj)
  },
  // 创建新的充值
  rechargeAdd (obj) {
    return request.postJson('/pf-api/rechargeAuth/add', obj)
  },
  // 充值详情
  rechargeDetail (obj) {
    return request.get('/pf-api/rechargeAuth/detail', obj)
  },
  // 充值列表
  rechargePagination (obj) {
    return request.get('/pf-api/rechargeAuth/pagination', obj)
  },
  // 交易详情
  transactionDetail (obj) {
    return request.get('/pf-api/transaction/detail', obj)
  },
  // 交易列表
  transactionPagination (obj) {
    return request.get('/pf-api/transaction/pagination', obj)
  }
}
