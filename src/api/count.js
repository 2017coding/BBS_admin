import request from '@/common/js/request'

// 平台相关数据统计
export function platformDataCountApi () {
  return request({
    url: '/api/count/platformDataCount',
    method: 'get'
  })
}
