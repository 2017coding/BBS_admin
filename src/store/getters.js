const getters = {
  // 用户模块
  sign: state => state.user.sign,
  userInfo: state => state.user.userInfo,
  // app模块
  lock: state => state.app.lock,
  lockStatus: state => state.app.lockStatus,
  loadingStatus: state => state.app.loadingStatus,
  routerType: state => state.app.routerType,
  projectInfo: state => state.app.projectInfo
}
export default getters
