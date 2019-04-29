import request from '@/common/js/request'

// 平台相关数据统计
export function userLoginAnalyzeApi (params) {
  return request({
    url: '/api/charts/userLoginAnalyze',
    method: 'get',
    params
  })
}
