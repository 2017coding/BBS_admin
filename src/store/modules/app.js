import {
  _setSessionStore,
  _getSessionStore
} from '@/common/js/storage'

const app = {
  namespaced: true,
  state: {
    // 菜单状态
    sidebar: {
      opened: _getSessionStore('sidebarStatus') ? !!+_getSessionStore('sidebarStatus') : true
    }
  },
  mutations: {
    // 切换侧边菜单显示状态
    TOGGLE_SIDEBAR: (state, status) => {
      state.sidebar.opened = !state.sidebar.opened
      if (state.sidebar.opened) {
        _setSessionStore('sidebarStatus', 1)
      } else {
        _setSessionStore('sidebarStatus', 0)
      }
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
