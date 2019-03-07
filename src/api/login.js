import request from '@/common/js/request'

// 登陆
export function loginApi (data) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Login/UserLogin',
    method: 'post',
    data
  })
}

// 得到用户信息
export function getUserInfoApi (params) {
  return request({
    // url: 'static/json/menuList1.json',
    url: '/api/Login/GetUserinfo',
    method: 'get',
    params
  })
}

// 退出登录
// 登陆
export function loginOutApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Login/WriteLog',
    method: 'get',
    params
  })
}
