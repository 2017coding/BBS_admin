// import Cookies from 'js-cookie'

const tokenKey = 'token',
  userInfo = 'userInfo',
  projectInfo = 'projectInfo'

/**
 * token
 */
export function _setToken (token) {
  // return Cookies.set(tokenKey, token)
  return sessionStorage.setItem(tokenKey, token)
}
export function _getToken () {
  // return Cookies.get(tokenKey)
  return sessionStorage.getItem(tokenKey)
}
export function _removeToken () {
  // return Cookies.remove(tokenKey)
  return sessionStorage.removeItem(tokenKey)
}

/**
 * userInfo
 */
export function _setUserInfo (data) {
  return sessionStorage.setItem(userInfo, JSON.stringify(data))
}
export function _getUserInfo () {
  if (!sessionStorage.getItem(userInfo)) {
    return
  }
  return JSON.parse(sessionStorage.getItem(userInfo))
}
export function _removeUserInfo () {
  return sessionStorage.removeItem(userInfo)
}

/**
 * projectInfo
 */
export function _setprojectInfo (data) {
  return sessionStorage.setItem(projectInfo, JSON.stringify(data))
}
export function _getProjectInfo () {
  if (!sessionStorage.getItem(projectInfo)) {
    return
  }
  return JSON.parse(sessionStorage.getItem(projectInfo))
}
export function _removeProjectInfo () {
  return sessionStorage.removeItem(projectInfo)
}
