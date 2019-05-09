import { getPermissionsApi } from '@/api/user'
import globalFn from '@/common/js/utils'
// 布局组件
import Layout from '@/views/layout/index'

// 添加默认页面
function addPage (arr) {
  // 首页
  const home = {
    id: 0,
    pid: 1,
    path: '',
    component: Layout,
    redirect: '/',
    meta: { title: '首页', icon: '' },
    children: [
      {
        path: '/',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: { title: '首页', icon: 'el-icon-albb-homepage' },
        children: []
      }
    ]
  }
  const HOWTOUSE = {
    id: 0,
    pid: 1,
    path: '/HOWTOUSE',
    component: Layout,
    redirect: '/HOWTOUSE/PAGE',
    meta: { title: '使用说明', icon: '' },
    children: [
      {
        path: 'PAGE',
        component: () => import('@/views/HOWTOUSE/index'),
        name: 'PAGE',
        meta: { title: '使用说明', icon: 'el-icon-albb-feedback' },
        children: []
      }
    ]
  }
  arr.unshift(home)
  arr.push(HOWTOUSE)
  return arr
}
// 得到页面路径
function getPath (arr, child, code) {
  const pItem = arr.find(item => child.pid === item.id)
  // 当前元素还存在父节点, 且父节点不为根节点
  if (arr.find(item => pItem.pid === item.id && item.pid > -1)) {
    getPath(arr, pItem, `${pItem.code}/${code}`)
  } else {
    return `${pItem.code}/${code}`
  }
}

const permission = {
  namespaced: true,
  state: {
    menu: [],
    baseMenu: [],
    dataPerms: []
  },
  mutations: {
    // 设置用户菜单
    SET_MENU: (state, menu, baseMenu) => {
      state.menu = menu
      state.baseMenu = baseMenu
    },
    // 设置数据权限
    SET_DATAPERMS: (state, dataPerms) => {
      state.dataPerms = dataPerms
    }
  },
  actions: {
    // 获取用户权限数据
    getPermissions ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getPermissionsApi().then(res => {
          if (res.success) {
            const menu = res.content.mod.filter(item => item.pid > -1)
            const dataPerms = res.content.dataPerms.map(item => item.code); let baseMenu = []; let treeMenu = []
            // 将菜单数据处理成可挂载的路由数据
            baseMenu = menu.map((item, index) => {
              // 对基础数据的处理
              item.meta = {}
              item.meta.title = item.name
              item.meta.icon = item.icon
              item.meta.id = item.id
              // 使路由名字具有唯一性
              item.name = item.name + index
              // 设置对应的页面路径
              item.path = '/' + item.code
              // 设置页面对应的组件 对应组件: -1. 根节点 1. 页面组件 2.默认布局 3456...扩展布局
              switch (item.component) {
                case -1:
                  console.log('根节点，已经过滤掉了')
                  break
                case 1:
                  item.component = resolve => require([`@/views/${getPath(menu, item, item.code)}/index`], resolve)
                  break
                case 2:
                  item.component = Layout
                  break
                default:
                  item.component = resolve => require(['@/views/errorPage/401'], resolve)
                  break
              }
              return {
                id: item.id,
                pid: item.pid,
                path: item.path,
                component: item.component,
                name: item.name,
                meta: item.meta,
                sort: item.sort
              }
            })
            // 数据排序
            baseMenu = baseMenu.sort((a, b) => a.sort - b.sort)
            // 得到树状数组
            treeMenu = globalFn.getTreeArr({ key: 'id', pKey: 'pid', data: baseMenu, jsonData: false })
            // 得到静态目录
            treeMenu = addPage(treeMenu)
            // 添加不需要权限也能访问的页面
            commit('SET_MENU', treeMenu, baseMenu)
            commit('SET_DATAPERMS', dataPerms)
            resolve(treeMenu)
          } else {
            // 得到静态目录
            const treeMenu = addPage([])
            commit('SET_MENU', treeMenu, treeMenu)
            reject()
          }
        })
      })
    }
  }
}

export default permission
