import request from '@/common/js/request'

// 创建
export function writeLogApi (data) {
  return request({
    url: '/api/log/writeLog',
    method: 'post',
    data
  })
}

// 获取列表
export function getListApi (params) {
  return request({
    url: '/api/log/getList',
    method: 'get',
    params
  })
}
