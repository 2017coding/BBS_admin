import request from '@/common/js/request'

// 创建
export function createApi (data) {
  return request({
    url: '/api/article/create',
    method: 'post',
    data
  })
}

// 编辑
export function updateApi (data) {
  return request({
    url: '/api/article/update',
    method: 'put',
    data
  })
}

// 删除
export function deleteApi (id) {
  return request({
    url: `/api/article/delete/${id}`,
    method: 'delete'
  })
}

// 得到单条数据
export function getRowApi (id) {
  return request({
    url: `/api/article/getRow/${id}`,
    method: 'get'
  })
}

// 获取列表
export function getListApi (params) {
  return request({
    url: '/api/article/getList',
    method: 'get',
    params
  })
}

// 获取全部
export function getAllApi (params) {
  return request({
    url: '/api/article/getAll',
    method: 'get',
    params
  })
}
