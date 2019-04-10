import request from '@/common/js/request'

// 创建
export function createApi (data) {
  return request({
    url: '/api/role/create',
    method: 'post',
    data
  })
}

// 编辑
export function updateApi (data) {
  return request({
    url: '/api/role/update',
    method: 'put',
    data
  })
}

// 删除
export function deleteApi (id) {
  return request({
    url: `/api/role/delete/${id}`,
    method: 'delete'
  })
}

// 得到单条数据
export function getRowApi (id) {
  return request({
    url: `/api/role/getRow/${id}`,
    method: 'get'
  })
}

// 获取列表
export function getListApi (params) {
  return request({
    url: '/api/role/getList',
    method: 'get',
    params
  })
}

// 获取所有
export function getAllApi () {
  return request({
    url: `/api/role/getAll`,
    method: 'get'
  })
}

/**
 * 角色依赖关系
 */
// 设置角色权限
export function setPermissionsApi (data) {
  return request({
    url: '/api/roleRelation/setPermissions',
    method: 'post',
    data
  })
}

// 获取角色权限
export function getPermissionsApi (params) {
  return request({
    url: '/api/roleRelation/getPermissions',
    method: 'get',
    params
  })
}

// 设置角色绑定的用户
export function setBindUserApi (data) {
  return request({
    url: `/api/roleRelation/setBindUser`,
    method: 'post',
    data
  })
}

// 获取角色绑定的用户
export function getBindUserApi (params) {
  return request({
    url: `/api/roleRelation/getBindUser`,
    method: 'get',
    params
  })
}
