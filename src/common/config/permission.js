import router from '@/router'
import store from '@/store'
import { _getCookie } from '@/common/js/storage'

// 路由前置
router.beforeEach((to, from, next) => {
  if (_getCookie('token')) {
    next()
  } else {
    store.dispatch('user/setUserInfo', {})
    next()
  }
})
// 路由后置
router.afterEach(() => {
})
