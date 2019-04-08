import request from '@/common/js/request'

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

// 获取角色绑定的用户
export function getBindUserApi () {
  return request({
    url: `/api/roleRelation/getBindUser`,
    method: 'get'
  })
}
