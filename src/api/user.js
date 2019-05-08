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

// 退出登录
export function loginOutApi (params) {
  return request({
    url: '/api/user/loginOut',
    method: 'post',
    params
  })
}

// 得到用户信息
export function getUserInfoApi (params) {
  return request({
    url: '/api/user/userInfo',
    method: 'get',
    params
  })
}

// 得到用户相关权限数据
export function getPermissionsApi () {
  return request({
    url: '/api/user/getPermissions?type=1',
    method: 'get'
  })
}
