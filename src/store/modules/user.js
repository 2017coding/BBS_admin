import {
  _setSessionStore,
  _getSessionStore
} from '@/common/js/storage'
import { getUserInfoApi, loginOutApi } from '@/api/user'

const user = {
  namespaced: true,
  state: {
    token: _getSessionStore('token'),
    userInfo: ''
  },
  mutations: {
    // 设置Token
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // 设置用户信息
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 存储Token
    setToken ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', data)
        // 将数据存到缓存
        _setSessionStore('token', data)
        resolve()
      })
    },
    // 存储用户数据
    setUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfoApi().then(res => {
          if (res.success) {
            commit('SET_USERINFO', res.content[0])
            resolve()
          } else {
            reject()
          }
        }).catch(e => {
          reject(e)
        })
      })
    },
    // 退出登录,将用户数据清除
    loginOut ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          sessionStorage.clear()
          resolve()
        }, 500)
        loginOutApi({ type: 'admin' }).then(res => {
          if (res.success) {
            sessionStorage.clear()
            // localStorage.clear()
            commit('SET_USERINFO', '')
            // // 清除app模块中的相关信息
            // dispatch('app/removeProjectInfo', {}, {root: true})
            // dispatch('app/removeLock', {}, {root: true})
            resolve()
          } else {
            sessionStorage.clear()
            // localStorage.clear()
            commit('SET_USERINFO', '')
            reject()
          }
        })
      })
    }
  }
}

export default user
