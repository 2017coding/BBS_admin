import request from '@/common/js/request'

// 编辑
export function updateApi (data) {
  return request({
    url: '/api/area/update',
    method: 'put',
    data
  })
}

// 获取列表
export function getListApi (params) {
  return request({
    url: '/api/area/getList',
    method: 'get',
    params
  })
}

// 获取全部
export function getAllApi (id) {
  return request({
    url: `/api/area/getAll/${id}`,
    method: 'get'
  })
}
