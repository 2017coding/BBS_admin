import {
  _setSessionStore,
  _getSessionStore,
  _removeSessionStore,
  _getLocalStore,
  _setLocalStore,
  _removeLocalStore
} from '@/common/js/storage'

const app = {
  namespaced: true,
  state: {
    lock: _getLocalStore('lock', 'JSONStr'),
    lockStatus: true,
    loadingStatus: true,
    routerType: 'turn-on',
    projectInfo: _getSessionStore('projectInfo', 'JSONStr') || {}
  },
  mutations: {
    SET_LOCK: (state, lock) => {
      state.lock = lock
    },
    SET_LOCKSTATUS: (state, status) => {
      state.lockStatus = status
    },
    SET_LOADING: (state, status) => {
      state.loadingStatus = status
    },
    SET_ROUTERTYPE: (state, type) => {
      state.routerType = type
    },
    // 设置项目信息
    SET_PROJECTINFO: (state, projectInfo) => {
      state.projectInfo = projectInfo
    }
  },
  actions: {
    setLoading ({commit}, status) {
      commit('SET_LOADING', status)
    },
    setRouterType ({commit}, type) {
      commit('SET_ROUTERTYPE', type)
    },
    // 存储项目数据
    setProjectInfo ({commit}, data) {
      return new Promise((resolve, reject) => {
        commit('SET_PROJECTINFO', data)
        // 将数据存到缓存
        _setSessionStore('projectInfo', data, 'JSONStr')
        resolve()
      })
    },
    // 设置手势密码
    setLock ({commit}, data) {
      return new Promise((resolve, reject) => {
        commit('SET_LOCK', data)
        // 将数据存到缓存
        _setLocalStore('lock', data, 'JSONStr')
        resolve()
      })
    },
    // 清除手势密码
    removeLock ({commit, dispatch}) {
      return new Promise(resolve => {
        commit('SET_LOCK', '')
        _removeLocalStore('lock')
        resolve()
      })
    },
    // 清除项目数据
    removeProjectInfo ({commit, dispatch}) {
      return new Promise(resolve => {
        commit('SET_PROJECTINFO', '')
        _removeSessionStore('projectInfo')
        resolve()
      })
    }
  }
}

export default app
