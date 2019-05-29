import request from '@/common/js/request'

// 设置
export function setNoticesApi (data) {
  return request({
    url: '/api/notices/set',
    method: 'post',
    data
  })
}

// 获取
export function getNoticesApi () {
  return request({
    url: '/api/notices/get',
    method: 'get'
  })
}
