import Cookies from 'js-cookie'

/**
 * 对cookie操作
 */
export function _setCookie (key, value, params, type) {
  if (!key) return
  if (type === 'JSONStr') {
    value = JSON.stringify(value)
  }
  Cookies.set(key, value, params)
}
export function _getCookie (key, type) {
  if (!Cookies.get(key)) {
    return
  }
  if (type === 'JSONStr') {
    return JSON.parse(Cookies.get(key))
  } else {
    return Cookies.get(key)
  }
}
export function _removeCookie (key) {
  return Cookies.remove(key)
}

/**
 * 对sessionStorage操作
 */
export const _setSessionStore = (key, value, type) => {
  if (!key) return
  if (type === 'JSONStr') {
    value = JSON.stringify(value)
  }
  sessionStorage.setItem(key, value)
}

export const _getSessionStore = (key, type) => {
  if (!sessionStorage.getItem(key)) {
    return
  }
  if (type === 'JSONStr') {
    return JSON.parse(sessionStorage.getItem(key))
  } else {
    return sessionStorage.getItem(key)
  }
}

export const _removeSessionStore = key => {
  if (!key) return
  sessionStorage.removeItem(key)
}

/**
 * 对localStorage操作
 */
export const _setLocalStore = (key, value, type) => {
  if (!key) return
  if (type === 'JSONStr') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}
export const _getLocalStore = (key, type) => {
  if (!localStorage.getItem(key)) {
    return
  }
  if (type === 'JSONStr') {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return localStorage.getItem(key)
  }
}
export const _removeLocalStore = key => {
  if (!key) return
  localStorage.removeItem(key)
}
