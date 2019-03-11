import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { _getCookie } from '@/common/js/storage'

NProgress.configure({showSpinner: false}) // 不显示加载圆圈

// 免登陆可进入的页面
const whiteList = ['/login', '/401', '/404']

// 路由前置
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (_getCookie('token')) {
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done()
    } else {
      next()
      return
      if (store.getters.menus.length === 0) { // 判断当前用户是否已拉取完菜单信息
        store.dispatch('user/getUserMenu').then(() => { // 拉取用户有的目录
          store.dispatch('permission/generateRoutes', store.getters.menus).then(() => { // 根据权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,设置replace: true，以便导航不会留下历史记录
          })
        }).catch((err) => {
          store.dispatch('user/loginOut').then(() => {
            Message.error(err || '验证失败，请重新登录')
            next({path: '/'})
          })
        })
        store.dispatch('socket/connectSocket')
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
// 路由后置
router.afterEach(() => {
  NProgress.done()
})
