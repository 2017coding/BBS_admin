import request from '@/common/js/request'

// 编辑
export function updateApi (data) {
  return request({
    url: '/api/file/update',
    method: 'put',
    data
  })
}

// 删除
export function deleteApi (id) {
  return request({
    url: `/api/file/delete/${id}`,
    method: 'delete'
  })
}

// 得到单条数据
export function getRowApi (id) {
  return request({
    url: `/api/file/getRow/${id}`,
    method: 'get'
  })
}

// 获取列表
export function getListApi (params) {
  return request({
    url: '/api/file/getList',
    method: 'get',
    params
  })
}

// 获取全部
export function getAllApi (params) {
  return request({
    url: '/api/file/getAll',
    method: 'get',
    params
  })
}
