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
export function loginOutApi () {
  return request({
    url: '/api/user/loginOut',
    method: 'post'
  })
}

// 创建
export function createApi (data) {
  return request({
    url: '/api/user/create',
    method: 'post',
    data
  })
}

// 编辑
export function updateApi (data) {
  return request({
    url: '/api/user/update',
    method: 'put',
    data
  })
}

// 删除
export function deleteApi (id) {
  return request({
    url: `/api/user/delete/${id}`,
    method: 'delete'
  })
}

// 得到用户xixni
export function getUserInfoApi (params) {
  return request({
    url: '/api/user/userInfo',
    method: 'get',
    params
  })
}

// 得到单条数据
export function getRowApi (id) {
  return request({
    url: `/api/user/getRow/${id}`,
    method: 'get'
  })
}

// 获取列表
export function getListApi (params) {
  return request({
    url: '/api/user/getList',
    method: 'get',
    params
  })
}
