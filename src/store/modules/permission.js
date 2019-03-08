import { baseRouter } from '@/router'

const permission = {
  namespaced: true,
  state: {
    // 静态路由
    routers: baseRouter,
    // 动态添加的路由
    addRouters: []
  },
  mutations: {
    // 设置路由
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = baseRouter.concat(routers)
    }
  },
  actions: {
    // 生成用户的路由表
    generateRoutes ({commit}, menus) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', menus)
        resolve()
      })
    }
  }
}

export default permission
