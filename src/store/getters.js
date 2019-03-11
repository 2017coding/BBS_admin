const getters = {
  // 用户模块
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  // app模块
  sidebar: state => state.app.sidebar,
  // tags模块
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // 错误日志模块
  errorLogs: state => state.errorLog.logs
}
export default getters
