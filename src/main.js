import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import ElementUI from 'element-ui'
import VueMap from 'vue-amap'
import VueClipboard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/index.less'
// import request from './utils/request'
import './assets/icon/iconfont.css'

Vue.use(ElementUI)
Vue.use(VueMap)
Vue.use(VueClipboard)

Vue.config.productionTip = false

VueMap.initAMapApiLoader({
  key: '2a9c5ece8f2d42b158f2ea6481339b62',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MouseTool', 'AMap.RectangleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
