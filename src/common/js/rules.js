import validate from './validate'

// 验证号码格式
export const CHECK_PHONE = (rule, value, callback) => {
  const check = validate({ label: '号码', value, rules: ['phone'] })
  if (!check.result) {
    callback(new Error(check.message))
  } else {
    callback()
  }
}
// 验证号码格式以及不能为空
export const CHECK_PHONE_NOTNULL = (rule, value, callback) => {
  const check = validate({ label: '号码', value, rules: ['notnull', 'phone'] })
  if (!check.result) {
    callback(new Error(check.message))
  } else {
    callback()
  }
}
// 检测邮箱格式
export const CHECK_EMAIL = (rule, value, callback) => {
  const check = validate({ label: '邮箱', value, rules: ['email'] })
  if (!check.result) {
    callback(new Error(check.message))
  } else {
    callback()
  }
}
// 检测邮箱格式以及不能为空
export const CHECK_EMAIL_NOTNULL = (rule, value, callback) => {
  const check = validate({ label: '邮箱', value, rules: ['notnull', 'email'] })
  if (!check.result) {
    callback(new Error(check.message))
  } else {
    callback()
  }
}
