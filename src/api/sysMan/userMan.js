import request from '@/common/js/request'

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

// 获取全部
export function getAllApi (params) {
  return request({
    url: '/api/user/getAll',
    method: 'get',
    params
  })
}

// 得到用户创建的用户列表
export function getCreateUserApi (id) {
  return request({
    url: `/api/user/getCreateUser/${id}`,
    method: 'get'
  })
}

// 用户转移
export function userTransferApi (data) {
  return request({
    url: `/api/user/userTransfer`,
    method: 'post',
    data
  })
}
