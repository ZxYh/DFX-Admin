const permission = {
  state: {
    permissions: []
  },
  getters: {
    permissions: state => {
      return state.permissions
    }
  },
  mutations: {
    SET_PERMISSIONS: (state, payload) => {
      state.permissions = payload.permissions
    }
  }
}

export default permission
