import app from './modules/app'
import permission from './modules/permission'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission
  }
})

export default store
