import Vue from 'vue'
import Router from 'vue-router'

// 布局组件
// import horizontal from '@/views/layout/horizontal'
// import vertical from '@/views/layout/vertical'

Vue.use(Router)

/**
 * 路由对象的key
 * path 路径
 * component 映射页面
 * name 路由名字 (唯一，不可重复，相当于唯一标识)
 * hidden 设置为true则加载菜单的时候不渲染这个路由
 * type 用来区分是平台级的路由还是项目级的路由
 * meta: { // 这个是菜单渲染的时候用到的参数
 *    title 菜单渲染显示的名字
 *    icon  菜单图标
 * }
 */

/**
 * 静态路由，不需要权限，所有人都有
 */
export const constantRouterMap = [
  // 登录页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: '登录',
    hidden: true,
    meta: {title: '登录', icon: ''}
  },
  // 默认进入的页面
  // {
  //   path: '/',
  //   component: horizontal,
  //   redirect: '/P01/P0101A',
  //   hidden: true,
  //   type: 'platform'
  // },
  // 错误页面定义
  {
    path: '/401',
    name: '401',
    hidden: true,
    meta: {title: '401', icon: ''},
    component: () => import('@/views/errorPage/401')
  },
  {
    path: '/404',
    name: '404',
    hidden: true,
    meta: {title: '404', icon: ''},
    component: () => import('@/views/errorPage/404')
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
