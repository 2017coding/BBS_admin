import {
  _setSessionStore,
  _getSessionStore
} from '@/common/js/storage'

const app = {
  namespaced: true,
  state: {
    // 是否全屏
    isFullScreen: false,
    // 菜单状态
    sidebar: {
      opened: !+_getSessionStore('sidebarStatus')
    }
  },
  mutations: {
    // 切换全屏
    TOGGLE_FULLSCREEN: (state, status) => {
      state.isFullScreen = status
    },
    // 切换侧边菜单显示状态
    TOGGLE_SIDEBAR: (state, status) => {
      if (status || status === false) {
        state.sidebar.opened = status
      }
      if (state.sidebar.opened) {
        _setSessionStore('sidebarStatus', 1)
      } else {
        _setSessionStore('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    }
  },
  actions: {
    // 切换侧边菜单
    toggleSideBar ({commit, state}, status) {
      commit('TOGGLE_SIDEBAR', status)
    }
  }
}

export default app
