const app = {
  state: {
    ifLogin: localStorage.getItem('isLogin') || false
  },
  getters: {
    ifLogin: state => {
      return state.ifLogin
    }
  },
  mutations: {
    SET_LOGIN: (state) => {
      state.ifLogin = true
    },
    CLEAR_LOGIN: (state) => {
      state.ifLogin = false
    }
  }
}

export default app
