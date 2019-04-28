import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { _getSessionStore } from '@/common/js/storage'
import globalFn from '@/common/js/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 10000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 设置请求头
  if (store.getters.token) {
    // 让每个请求携带token
    config.headers['Authorization'] = _getSessionStore('token')
  }
  // 对全局参数做过滤，把不存在的参数删除
  if (config.method === 'post') {
    for (const key in config.data) {
      if (!config.data[key] && config.data[key] !== 0) {
        delete config.data[key]
      }
    }
  } else if (config.method === 'get') {
    for (const key in config.params) {
      if (!config.params[key] && config.params[key] !== 0) {
        delete config.params[key]
      }
    }
  }
  // 全局去前后空格
  function dataTrim (data) {
    if (Array.isArray(data)) {
      for (let item of data) {
        if (typeof item === 'object') {
          dataTrim(item)
        } else if (typeof item === 'string') {
          item = item.trim()
        }
      }
    } else if (typeof data === 'object') {
      for (const key in data) {
        if (typeof data[key] === 'object') {
          dataTrim(data[key])
        } else if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
    }
  }
  dataTrim(config.data)
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    let tips = '用户信息错误'; let btMsg = '重新登录'
    if (res.code === 20101 || res.code === 20201) {
      switch (res.code) {
        case 20101:
          tips = '当前账号在其他地方登陆, 如不是本人操作，请及时修改密码'
          btMsg = '确定'
          break
        case 20201:
          tips = '用户信息错误, 请重新登录'
          btMsg = '重新登录'
          break
      // case 20203:
      //   tips = '用户未绑定角色，无法登陆'
      //   btMsg = '确定'
      //   break
      }
      MessageBox.alert(tips, {
        confirmButtonText: btMsg,
        type: 'info'
      }).then(() => {
        store.dispatch('user/loginOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {
      })
      return Promise.reject('error')
    } else {
      const data = response.data
      return data
    }
  },
  error => {
    console.log(error) // for debug
    const message = error.response ? globalFn.requestError(error.response.status) : '请求超时'
    Message({
      showClose: true,
      message: message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
