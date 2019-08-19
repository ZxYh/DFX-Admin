import Vue from 'vue'
import Router from 'vue-router'
import PERMISSION from '@/constants/permission'
import ROUTE from '@/constants/route'
import store from '@/store'

Vue.use(Router)

const Layout = resolve => require(['@/views/main.vue'], resolve)
const router = new Router({
  base: '/',
  routes: [
    { path: '/login', name: 'login', component: resolve => require(['@/login'], resolve), hidden: true },
    {
      path: '/',
      component: Layout,
      hidden: true,
      meta: { requireAuth: true },
      children: [{
        path: '',
        redirect: '/welcome',
        meta: { requireAuth: true },
        hidden: true
      }, {
        path: 'welcome',
        name: 'welcome',
        meta: { requireAuth: true },
        component: resolve => require(['@/views/page/welcome'], resolve)
      }]
    },
    {
      meta: { title: '人员管理', icon: 'iconfont el-icon-back-guanyanren', requireAuth: true },
      component: Layout,
      name: 'person',
      path: '/person',
      children: [{
        path: '/personnel/list',
        name: ROUTE.PERSON.USERLIST,
        meta: { title: '用户管理', requireAuth: true },
        component: resolve => require(['@/views/page/personnel/userPerson'], resolve)
      },
      {
        path: '/personnel/reclaimer',
        name: ROUTE.PERSON.RECYCLERLIST,
        meta: { title: '回收者管理', requireAuth: true },
        component: resolve => require(['@/views/page/personnel/reclaimerPerson'], resolve)
      },
      {
        path: '/personnel/driver-auditing',
        name: ROUTE.PERSON.DRIVERLIST,
        meta: { title: '司机管理', requireAuth: true },
        component: resolve => require(['@/views/page/personnel/driverPerson'], resolve)
      }
      ]
    },
    {
      meta: { title: '回收点管理', icon: 'iconfont el-icon-back-dizhiguanli', requireAuth: true },
      name: 'recyclerPoint',
      path: '/recyclerPoint',
      component: Layout,
      children: [{
        path: '/recyclerPoint/list',
        name: ROUTE.RECYCLERPOINT.RECYCLERPOINTLIST,
        meta: { title: '回收点列表', requireAuth: true },
        component: resolve => require(['@/views/page/recoverypoint/list'], resolve)
      }, {
        path: '/recyclerPoint/statistics',
        name: ROUTE.RECYCLERPOINT.RETRIEVEPAGER,
        meta: { title: '回收量统计', requireAuth: true },
        component: resolve => require(['@/views/page/recoverypoint/statistics'], resolve)
      }]
    },
    {
      meta: { title: '回收商管理', icon: 'iconfont el-icon-back-shouye', requireAuth: true },
      name: 'recyclerMerchant',
      path: '/recyclerMerchant',
      component: Layout,
      children: [{
        path: '/recycler',
        name: ROUTE.RECYCLERMERCHANT.RECYCLERMERCHANTLIST,
        meta: { title: '回收商列表', requireAuth: true },
        component: resolve => require(['@/views/page/recycler/list'], resolve)
      }]
    },
    {
      meta: { title: '订单管理', icon: 'iconfont el-icon-back-yanchurili', requireAuth: true },
      path: '/order',
      name: 'order',
      component: Layout,
      children: [{
        path: '/order/recovery',
        name: ROUTE.ORDER.RECYCLERORDERLIST,
        meta: { title: '回收订单管理', requireAuth: true },
        component: resolve => require(['@/views/page/order/recovery'], resolve)
      }, {
        path: '/order/appointment',
        name: ROUTE.ORDER.DRIVERORDERPAGINATION,
        meta: { title: '回收请求管理', requireAuth: true },
        component: resolve => require(['@/views/page/order/appointment'], resolve)
      }, {
        path: '/order/driver',
        name: ROUTE.ORDER.DRIVERORDERLIST,
        meta: { title: '司机订单任务', requireAuth: true },
        component: resolve => require(['@/views/page/order/driver'], resolve)
      }, {
        path: '/order/urgent',
        name: ROUTE.ORDER.CRASHORDERLIST,
        meta: { title: '紧急订单管理', requireAuth: true },
        component: resolve => require(['@/views/page/order/urgent'], resolve)
      }, {
        path: '/order/OwnRecycler',
        name: ROUTE.ORDER.OWNPAGINSTION,
        meta: { title: '自有回收者订单任务', requireAuth: true },
        component: resolve => require(['@/views/page/order/OwnRecycler'], resolve)
      }]
    },
    {
      meta: { title: '财务管理', icon: 'iconfont el-icon-back-daifukuan', requireAuth: true },
      path: '/finance',
      name: 'finance',
      component: Layout,
      children: [{
        path: '/finance/cash',
        name: ROUTE.FINANCE.WITHDRAWLIST,
        meta: { title: '提现管理', requireAuth: true },
        component: resolve => require(['@/views/page/finance/cash'], resolve)
      }, {
        path: '/finance/recharge',
        name: ROUTE.FINANCE.RECHARGELIST,
        meta: { title: '回收商充值', requireAuth: true },
        component: resolve => require(['@/views/page/finance/recharge'], resolve)
      }, {
        path: '/finance/record',
        name: ROUTE.FINANCE.ORDERLIST,
        meta: { title: '交易记录', requireAuth: true },
        component: resolve => require(['@/views/page/finance/record'], resolve)
      }]
    },
    {
      meta: { title: '管理员管理', icon: 'iconfont el-icon-back-wode', requireAuth: true },
      path: '/admin',
      name: 'admin',
      component: Layout,
      children: [{
        path: '/admin/role',
        name: ROUTE.ADMIN.ROLELIST,
        meta: { title: '角色管理', requireAuth: true },
        component: resolve => require(['@/views/page/administrators/role'], resolve)
      }, {
        path: '/admin/list',
        name: ROUTE.ADMIN.ADMINLIST,
        meta: { title: '管理员管理', requireAuth: true },
        component: resolve => require(['@/views/page/administrators/list'], resolve)
      }]
    },
    {
      meta: { title: '平台管理', icon: 'iconfont el-icon-back-fenlei', requireAuth: true },
      path: '/platform',
      name: 'platform',
      component: Layout,
      children: [{
        path: '/platform/trading-area',
        name: ROUTE.PLATFORM.BUSINESSDISTRICTLIST,
        meta: { title: '商圈管理', requireAuth: true },
        component: resolve => require(['@/views/page/platform/TradingArea'], resolve)
      }, {
        path: '/platform/carousel',
        name: ROUTE.PLATFORM.VIEWPAGERLIST,
        meta: { title: '轮播图管理', requireAuth: true },
        component: resolve => require(['@/views/page/platform/carousel'], resolve)
      }, {
        path: '/platform/classification',
        name: ROUTE.PLATFORM.BUSINESSDISTRICTLIST,
        meta: { title: '废品分类管理', requireAuth: true },
        component: resolve => require(['@/views/page/platform/classification'], resolve)
      }, {
        path: '/platform/integral',
        name: ROUTE.PLATFORM.GETSCORECONFIG,
        meta: { title: '积分配置管理', requireAuth: true },
        component: resolve => require(['@/views/page/platform/integral'], resolve)
      }, {
        path: '/platform/business-hours',
        name: ROUTE.PLATFORM.GETMANGETIME,
        meta: { title: '营业时间配置管理', requireAuth: true },
        component: resolve => require(['@/views/page/platform/BusinessHours'], resolve)
      }, {
        path: '/platform/region',
        name: ROUTE.PLATFORM.REGIONLIST,
        meta: { title: '区域管理', requireAuth: true },
        component: resolve => require(['@/views/page/platform/region'], resolve)
      }]
    }
  ]
})

const whiteList = [
  '/',
  '/login',
  '/welcome'
]

// let count = 0
router.beforeEach((to, from, next) => {
  if (store.getters.ifLogin) { // 判断是否有token
    // console.log('from: ', from)
    // console.log('to.path: ', to.path)
    // console.log('has token')
    if (to.path === '/login') {
      // console.log('visite login page by login user')
      // count += 1

      // if (count === 2) {
      //   return next()
      // } else {
      return next('/welcome')
      // }
    } else {
      // console.log('to: ', to)
      if (whiteList.includes(to.path)) {
        return next()
      }
      // console.log('check permissions')
      // console.log('PERMISSION: ', PERMISSION)
      // console.log('to.name: ', to.name)
      const permissions = PERMISSION[to.name]

      let hasPermission = false
      permissions.forEach((permission) => {
        if (store.getters.permissions.includes(permission)) {
          hasPermission = true
        }
      })

      if (hasPermission) {
        return next()
      } else {
        return next(false)
      }
    }
  } else {
    // console.log('have no token')
    const isRequireAuth = to.matched.some(route => route.meta.requireAuth)

    // console.log('isRequireAuth: ', isRequireAuth)

    if (isRequireAuth) {
      // console.log('redirect to login')
      next({ path: '/login' })
    } else {
      // console.log('access page')
      next()
    }
  }
})

export default router
