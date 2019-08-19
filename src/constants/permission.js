import ROUTE from './route'

const permissions = {
  [ROUTE.PERSON.USERLIST]: [
    'person.userList.userDetail'
  ],
  [ROUTE.PERSON.RECYCLERLIST]: [
    'person.recyclerList.recyclerDetail'
  ],
  [ROUTE.PERSON.RECYCLERAUTHLIST]: [
    'person.recyclerAuthList.recyclerAuthDetail'
  ],
  [ROUTE.PERSON.DRIVERLIST]: [
    'person.driverList.driverDetail'
  ],
  [ROUTE.PERSON.DRIVERAUTHLIST]: [
    'person.driverAuthList.driverAuthDetail'
  ],
  [ROUTE.RECYCLERPOINT.RECYCLERPOINTLIST]: [
    'recyclerPoint.recyclerPointList.recyclerPointDetail'
  ],
  [ROUTE.RECYCLERPOINT.RETRIEVEPAGER]: [
    'recyclerPoint.retrievePager.retrieveDetail'
  ],
  [ROUTE.RECYCLERMERCHANT.RECYCLERMERCHANTLIST]: [
    'recyclerMerchant.recyclerMerchantList.addRecyclerMerchant',
    'recyclerMerchant.recyclerMerchantList.changeStatusRecyclerMerchant',
    'recyclerMerchant.recyclerMerchantList.changPwd',
    'recyclerMerchant.recyclerMerchantList.recyclerMerchantDetail'
  ],
  [ROUTE.FINANCE.ORDERLIST]: [
    'finance.orderList.orderDetail'
  ],
  [ROUTE.FINANCE.RECHARGELIST]: [
    'finance.rechargeList.addRecharge'
  ],
  [ROUTE.FINANCE.WITHDRAWLIST]: [
    'finance.withdrawList.changeStausMultiple',
    'finance.withdrawList.withdrawChangeStatus',
    'finance.withdrawList.withdrawDetail'
  ],
  [ROUTE.ADMIN.ADMINLIST]: [
    'admin.adminList.adminDetail',
    'admin.adminList.changeStatus',
    'admin.adminList.createAdmin',
    'admin.adminList.deleteAdmin',
    'admin.adminList.resetPwd',
    'admin.adminList.unlockAdmin',
    'admin.adminList.updateAdmin'
  ],
  [ROUTE.ADMIN.ROLELIST]: [
    'admin.roleList.allRole',
    'admin.roleList.createRole',
    'admin.roleList.deleteRole',
    'admin.roleList.roleDetail',
    'admin.roleList.setIfEnableToFalse',
    'admin.roleList.setIfEnableToFalseMultiple',
    'admin.roleList.setIfEnableToTrue',
    'admin.roleList.updateRole'
  ],
  [ROUTE.PLATFORM.BUSINESSDISTRICTLIST]: [
    'platform.businessDistrictList.addBusinessDistrict',
    'platform.businessDistrictList.deleteBusinessDistrict',
    'platform.businessDistrictList.updateName'
  ],
  [ROUTE.PLATFORM.VIEWPAGERLIST]: [
    'platform.viewPagerList.createViewPager',
    'platform.viewPagerList.deleteViewPager'
  ],
  [ROUTE.PLATFORM.GETSCORECONFIG]: [
    'platform.getScoreConfig.disable',
    'platform.getScoreConfig.enable',
    'platform.getScoreConfig.setScoreConfig'
  ],
  [ROUTE.PLATFORM.GETMANGETIME]: [
    'platform.getMangeTime.setMangeTime'
  ],
  [ROUTE.PLATFORM.REGIONLIST]: [
    'platform.regionList.addRegion',
    'platform.regionList.delete',
    'platform.regionList.regionDetai',
    'platform.regionList.update'
  ],
  [ROUTE.PLATFORM.SCRAPTYPELIST]: [
    'platform.scrapTypeList.addScrapType',
    'platform.scrapTypeList.deleteScrapType',
    'platform.scrapTypeList.disableMultiple',
    'platform.scrapTypeList.scrapTypeDetail',
    'platform.scrapTypeList.updateScrapType'
  ],
  [ROUTE.ORDER.RECYCLERORDERLIST]: [
    'order.recyclerOrderList.recyclerOrderDetail'
  ],
  [ROUTE.ORDER.DRIVERORDERPAGINATION]: [
    'order.driverOrderPagination.recyclerQuestDetail'
  ],
  [ROUTE.ORDER.DRIVERORDERLIST]: [
    'order.driverOrderList.driverOrderDetail'
  ],
  [ROUTE.ORDER.CRASHORDERLIST]: [
    'order.crashOrderList.crashOrderDetail'
  ],
  [ROUTE.ORDER.OWNPAGINSTION]: [
    'order.ownPagination.ownDetail'
  ]
}

export default permissions
