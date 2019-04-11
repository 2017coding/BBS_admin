import request from '@/common/js/request'

// 创建
export function createApi (data) {
  return request({
    url: '/api/menu/create',
    method: 'post',
    data
  })
}

// 编辑
export function updateApi (data) {
  return request({
    url: '/api/menu/update',
    method: 'put',
    data
  })
}

// 删除
export function deleteApi (id) {
  return request({
    url: `/api/menu/delete/${id}`,
    method: 'delete'
  })
}

// 得到单条数据
export function getRowApi (id) {
  return request({
    url: `/api/menu/getRow/${id}`,
    method: 'get'
  })
}

// 获取列表
export function getListApi (params) {
  return request({
    url: '/api/menu/getList',
    method: 'get',
    params
  })
}

// 获取所有
export function getRoleMenuApi (params) {
  return request({
    url: `/api/menu/getRoleMenu`,
    method: 'get',
    params
  })
}

// 获取所有
export function getAllApi (params) {
  return request({
    url: `/api/menu/getAll`,
    method: 'get',
    params
  })
}

/**
 * 菜单相关的数据权限
 */
// 创建
export function dataPermsCreateApi (data) {
  return request({
    url: '/api/dataPerms/create',
    method: 'post',
    data
  })
}

// 编辑
export function dataPermsUpdateApi (data) {
  return request({
    url: '/api/dataPerms/update',
    method: 'put',
    data
  })
}

// 删除
export function dataPermsDeleteApi (id) {
  return request({
    url: `/api/dataPerms/delete/${id}`,
    method: 'delete'
  })
}

// 得到单条数据
export function dataPermsGetRowApi (id) {
  return request({
    url: `/api/dataPerms/getRow/${id}`,
    method: 'get'
  })
}

// 获取列表
export function dataPermsGetListApi (params) {
  return request({
    url: '/api/dataPerms/getList',
    method: 'get',
    params
  })
}

// 获取用户拥有
export function getRoleDataPermsApi (params) {
  return request({
    url: `/api/dataPerms/getRoleDataPerms`,
    method: 'get',
    params
  })
}

// 获取所有
export function dataPermsGetAllApi (params) {
  return request({
    url: `/api/dataPerms/getAll`,
    method: 'get',
    params
  })
}
