import {
  _setSessionStore,
  _getSessionStore,
  _setLocalStore,
  _getLocalStore
} from '@/common/js/storage'

const app = {
  namespaced: true,
  state: {
    // 菜单状态
    sidebar: {
      opened: _getSessionStore('sidebarStatus') ? !!+_getSessionStore('sidebarStatus') : true
    },
    language: _getSessionStore('language') || 'en',
    size: _getSessionStore('size') || 'small',
    theme: _getLocalStore('theme') || 'red',
    // 全屏状态
    fullScreen: false
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
    },
    TOGGLE_FULLSCREEN: (state, val) => {
      state.fullScreen = val
    },
    // 设置语言
    SET_LANGUAGE: (state, language) => {
      state.language = language
      _setSessionStore('language', language)
    },
    setLanguage ({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    // 设置尺寸
    SET_SIZE: (state, size) => {
      state.size = size
      _setSessionStore('size', size)
    },
    // 设置主题
    SET_THEME: (state, theme) => {
      state.theme = theme
      _setLocalStore('theme', theme)
    }
  },
  actions: {
    // 切换侧边菜单
    toggleSideBar ({ commit, state }, status) {
      commit('TOGGLE_SIDEBAR', status)
    },
    setSize ({ commit }, size) {
      commit('SET_SIZE', size)
    },
    settingTheme ({ commit }, theme) {
      commit('SET_THEME', theme)
    }
  }
}

export default app
