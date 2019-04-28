const errorLog = {
  namespaced: true,
  state: {
    logs: []
  },
  mutations: {
    ADD_ERROR_LOG: (state, log) => {
      state.logs.push(log)
    }
  },
  actions: {
    addErrorLog ({ commit }, log) {
      commit('ADD_ERROR_LOG', log)
    }
  }
}

export default errorLog
