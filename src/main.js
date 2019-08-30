// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import { _getLocalStore } from '@/common/js/storage'

import 'normalize.css/normalize.css' // 样式初始化

import ElementUI from 'element-ui'
import '@/common/style/index.scss' // 自定义样式
// import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import vueWaves from '@/directive/waves/index'// 水波纹指令
import vueFocus from '@/directive/focus/index'// 聚焦指令
import vueImgAlart from '@/directive/imgAlart/index'// 图片弹窗指令
import '@/common/config/errorLog' // 错误日志
import '@/common/config/permission' // 路由动态配置
import prototype from '@/common/js/prototype' // 挂载在原型上的方法
import i18n from './lang' // Internationalization

Vue.use(prototype)
// Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(vueWaves)
Vue.use(vueFocus)
Vue.use(vueImgAlart)
Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: _getLocalStore('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
