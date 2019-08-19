const routes = {
  PERSON: { // 员工管理
    USERLIST: 'person.userList', // 用户管理
    RECYCLERLIST: 'person.recyclerList', // 回收者管理
    RECYCLERAUTHLIST: 'person.recyclerAuthList', // 回收者审核
    DRIVERLIST: 'person.driverList', // 司机管理
    DRIVERAUTHLIST: 'person.driverAuthList' // 司机审核
  },
  RECYCLERPOINT: { // 回收点
    RECYCLERPOINTLIST: 'recyclerPoint.recyclerPointList', // 回收点列表
    RETRIEVEPAGER: 'recyclerPoint.retrievePager' // 回收统计
  },
  RECYCLERMERCHANT: { // 回收商
    RECYCLERMERCHANTLIST: 'recyclerMerchant.recyclerMerchantList' // 回收商列表
  },
  FINANCE: { // 财务
    ORDERLIST: 'finance.orderList', // 交易记录
    RECHARGELIST: 'finance.rechargeList', // 回收商充值
    WITHDRAWLIST: 'finance.withdrawList' // 提现
  },
  ADMIN: { // 管理员管理
    ADMINLIST: 'admin.adminList', // 管理员列表
    ROLELIST: 'admin.roleList' // 角色列表
  },
  ORDER: { // 订单
    RECYCLERORDERLIST: 'order.recyclerOrderList', // 回收订单
    DRIVERORDERPAGINATION: 'order.driverOrderPagination', // 回收请求管理
    CRASHORDERLIST: 'order.crashOrderList', // 紧急订单列表
    DRIVERORDERLIST: 'order.driverOrderList', // 司机订单
    OWNPAGINSTION: 'order.ownPagination' // 自有回收者
  },
  PLATFORM: { // 平台管理
    BUSINESSDISTRICTLIST: 'platform.businessDistrictList', // 商圈
    VIEWPAGERLIST: 'platform.viewPagerList', // 轮播图
    GETSCORECONFIG: 'platform.getScoreConfig', // 积分配置
    GETMANGETIME: 'platform.getMangeTime', // 营业时间
    REGIONLIST: 'platform.regionList', // 区域
    SCRAPTYPELIST: 'platform.scrapTypeList'// 废品分类
  }
}

export default routes
