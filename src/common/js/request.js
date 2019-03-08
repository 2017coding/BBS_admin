import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '@/store'
import { _getCookie } from '@/common/js/storage'
import globalFn from '@/common/js/utils'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 设置请求头
  if (store.getters.token) {
    // 让每个请求携带token
    config.headers['Authorization'] = _getCookie('token')
  }

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
    if (response.status === 401 || res.status === 40101) {
      Message({
        showClose: true,
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.alert('你已被登出，请重新登录', {
          confirmButtonText: '重新登录',
          type: 'info'
        }).then(() => {
          store.dispatch('loginOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // return Promise.reject('error')
    } else {
      let data = response.data
      return data
    }
  },
  error => {
    console.log(error) // for debug
    let message = error.response ? globalFn.requestError(error.response.status) : '请求超时'
    Message({
      showClose: true,
      message: message,
      type: 'error',
      duration: 3 * 1000
    })
    // return Promise.reject(error)
  }
)

export default service
