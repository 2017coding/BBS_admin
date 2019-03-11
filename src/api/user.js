import request from '@/common/js/request'

// 注册
export function registeredApi (data) {
  return request({
    url: '/api/user/registered',
    method: 'post',
    data
  })
}

// 登陆
export function loginApi (data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

// 得到用户信息
export function getUserInfoApi (params) {
  return request({
    url: '/api/user/GetUserinfo',
    method: 'get',
    params
  })
}

// 退出登录
export function loginOutApi (params) {
  return request({
    url: '/api/user/WriteLog',
    method: 'get',
    params
  })
}
