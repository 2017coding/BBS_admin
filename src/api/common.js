import request from '@/common/js/request'

/** 平台级公共接口 **/
// 获取模块
function getModApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetAllModule',
    method: 'get',
    params
  })
}

// 获取区域
function getAreaApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetAreaListToCity',
    method: 'get',
    params
  })
}

// 获取启用的区域，并构成树状数据
function getAreaTreeApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetDistrictTree',
    method: 'get',
    params
  })
}

// 获取服务商
function getEsprApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetEsprovicer',
    method: 'get',
    params
  })
}

// 获取数据库分库
function getDBApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetBranchdb',
    method: 'get',
    params
  })
}

// 获取版本
function getVernApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetVersion',
    method: 'get',
    params
  })
}

// 获取角色类型
function getRoleTypeApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetRoleType',
    method: 'get',
    params
  })
}

// 获取角色
function getRoleApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetRole',
    method: 'get',
    params
  })
}

// 获取全局的参数类型
function getParamsTypeApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetCodeByType',
    method: 'get',
    params
  })
}

/** 项目级公共接口 **/
// 获取公司简介接口
function getCompanyInfoApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetCompanyinfo',
    method: 'get',
    params
  })
}
// 获取项目基本配置信息接口
function getProjectBaseConfigApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetProjectBaseConfig',
    method: 'get',
    params
  })
}
// 读取项目名称以及logo
function getProjectInfoApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetProjectBaseInfo',
    method: 'get',
    params
  })
}
// 根据项目ID获取建筑
function getBuildApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetBubiByProjId',
    method: 'get',
    params
  })
}

// 根据项目ID获取能耗类型
function getEntpApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetEnergyTypeByPID',
    method: 'get',
    params
  })
}

// 根据能耗类型获取维度信息
function getDagdByEntpApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetDataGroupDim',
    method: 'get',
    params
  })
}

// 根据项目ID查询采集器信息
function getDaciApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetDaciByProj',
    method: 'get',
    params
  })
}

// 根据项目ID查询表计信息
function getMetrApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetMetrByProj',
    method: 'get',
    params
  })
}

// 根据项目ID查询维度信息
function getDagdByProjApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetDagdByProj',
    method: 'get',
    params
  })
}

// 根据分组维度编码获取分组信息列表
function GetGroupListApi (params) {
  return request({
    // url: 'static/json/userInfo.json',
    url: '/api/Common/GetGroupList',
    method: 'get',
    params
  })
}

export default {
  // 平台级公共接口
  getModApi,
  getAreaApi,
  getAreaTreeApi,
  getEsprApi,
  getDBApi,
  getVernApi,
  getRoleTypeApi,
  getRoleApi,
  getParamsTypeApi,
  // 项目级公共接口
  getCompanyInfoApi,
  getProjectBaseConfigApi,
  getProjectInfoApi,
  getBuildApi,
  getEntpApi,
  getDagdByEntpApi,
  getDaciApi,
  getMetrApi,
  getDagdByProjApi,
  GetGroupListApi
}
