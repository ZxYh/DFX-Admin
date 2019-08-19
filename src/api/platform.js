// 平台管理列表相关api
import request from '../utils/request'
export default {
  // 新增商圈
  businessAdd (obj) {
    return request.post('/pf-api/businessDistrict/add', obj)
  },
  // 删除商圈
  businessDelete (obj) {
    return request.get('/pf-api/businessDistrict/delete', obj)
  },
  // 商圈列表
  businessPagination (obj) {
    return request.get('/pf-api/businessDistrict/pagination', obj)
  },
  // 修改名称
  businessUpdateName (obj) {
    return request.post('/pf-api/businessDistrict/updateName', obj)
  },
  // 删除轮播图
  viewDelete (obj) {
    return request.get('/pf-api/view/delete', obj)
  },
  // 轮播图列表
  viewList (obj) {
    return request.get('/pf-api/view/list', obj)
  },
  // 创建轮播图
  viewAdd (obj) {
    return request.postJson('/pf-api/view/addMultiple', obj)
  },
  // 创建废品类型
  scrapAdd (obj) {
    return request.postJson('/pf-api/scrapType/add', obj)
  },
  // 删除一个废品分类
  scrapDelete (obj) {
    return request.get('/pf-api/scrapType/delete', obj)
  },
  // 废品分类详情
  scrapDetail (obj) {
    return request.get('/pf-api/scrapType/detail', obj)
  },
  // 禁用多个废品分类
  scrapDisable (obj) {
    return request.post('/pf-api/scrapType/disableMultiple', obj)
  },
  // 废品类型列表
  scrapPagination (obj) {
    return request.get('/pf-api/scrapType/pagination', obj)
  },
  // 更新一个废品种类
  scrapUpdate (obj) {
    return request.postJson('/pf-api/scrapType/update', obj)
  },
  // 添加经营区域
  regionAdd (obj) {
    return request.postJson('/pf-api/region/add', obj)
  },
  // 删除一个区域
  regionDelete (obj) {
    return request.post('/pf-api/region/delete', obj)
  },
  // 区域详情
  regionDetail (obj) {
    return request.get('/pf-api/region/detail', obj)
  },
  // 禁用多个区域
  regionDisable (obj) {
    return request.post('/pf-api/region/disable', obj)
  },
  // 经营区域列表
  regionPagination (obj) {
    return request.get('/pf-api/region/pagination', obj)
  },
  // 修改区域详情
  regionUpdate (obj) {
    return request.postJson('/pf-api/region/update', obj)
  },
  // 获取营业时间
  getTime (obj) {
    return request.get('/pf-api/platformConfig/getMangeTime', obj)
  },
  // 设置营业时间
  setTime (obj) {
    return request.postJson('/pf-api/platformConfig/setMangeTime', obj)
  },
  // 获取积分配置
  getConfig (obj) {
    return request.get('/pf-api/scoreConfig/getConfig', obj)
  },
  // 设置积分配置
  setConfig (obj) {
    return request.postJson('/pf-api/scoreConfig/setConfig', obj)
  },
  // 启用积分配置
  enableConfig (obj) {
    return request.post('/pf-api/scoreConfig/enable', obj)
  },
  // 禁用积分配置
  disableConfig (obj) {
    return request.post('/pf-api/scoreConfig/disable', obj)
  },
  // 获取公有文件上传参数
  getPublicToken (obj) {
    return request.get('/pf-api/upload/getPublicToken', obj)
  },
  // 获取私有文件上传参数
  getPrivateToken (obj) {
    return request.get('/pf-api/upload/getPrivateToken', obj)
  }
}
