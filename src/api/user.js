import request from '@/common/js/request'

// 平台用户获取平台级目录和项目级目录
export function getPlatformMenusApi (params) {
  return request({
    // url: 'static/json/menuList.json',
    url: '/api/Home/GetPlatformMenu',
    method: 'get',
    params
  })
}

// 企业用户获取项目级目录
export function getProjectMenusApi (params) {
  return request({
    // url: 'static/json/menuList1.json',
    url: '/api/SHome/GetProjectMenu',
    method: 'get',
    params
  })
}

// 更新用户信息
export function updateUserInfoApi (data) {
  return request({
    // url: 'static/json/menuList1.json',
    url: '/api/Login/UpdataUser',
    method: 'post',
    data
  })
}

// 更新用户密码
export function updateUserPwdApi (data) {
  return request({
    // url: 'static/json/menuList1.json',
    url: '/api/Login/UpdataPwd',
    method: 'post',
    data
  })
}
