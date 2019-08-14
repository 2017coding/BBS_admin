/**
 * 传入验证规则，得到验证结果
 * @param {Obj} { label, value, rules, conditions}
 *  @param {String} label: 验证的字段名称
 *  @param {String} value: 验证的值 (验证重复的时候可以添加value1属性)
 *  @param {Array} rules: 验证的规则数组 例如： ['notnull', 'length'] 如果参数必填，第一个参数为notnull
 *  @param {Array} conditions: 条件字段 例如： ['2', '10'] ,则验证长度错误会提示: 密码的长度在2到10个字符,以传入数组的条件去做验证, 验证的提示{1}开始将匹配的是当前数组
 * @return {obj} { result, message } 验证结果对象
 */
export default (obj) => {
  let reg
  const validatorObj = {
    // 验证定义
    validator: {
      // 验证失败后的提示
      messages: {
        notnull: '请输入{0}',
        max: '长度最多为 {1} 个字符',
        min: '长度最小为 {1} 个字符',
        length: '{0}的长度在 {1} 到 {2} 个字符',
        number: '{0}必须是数字',
        string: '{0}必须是字母或者数字',
        moblie: '{0}必须是手机或者电话号码格式',
        phone: '{0}格式不正确',
        noChinese: '{0}不能为中文',
        lon: '{0}范围为-180.0～+180.0（必须输入1到10位小数）',
        lat: '{0}范围为-90.0～+90.0（必须输入1到10位小数）',
        url: '请输入正确的{0}访问地址',
        repeat: '两次输入的{0}不一致',
        email: '邮箱格式不正确',
        password: '请输入由大小写字母+数字组成的6-16位密码',
        fixedNum: '请输入{1}位数字'
      },
      // 验证的方法, 返回一个布尔值
      methods: {
        notnull: obj => {
          return obj.value || obj.value === 0
        },
        max: obj => {
          if (!obj.value) return true
          return obj.conditions[0] >= obj.value.length
        },
        min: obj => {
          if (!obj.value) return true
          return obj.value.length >= obj.conditions[0]
        },
        length: obj => {
          if (!obj.value) return true
          // 如果是number，是没有length方法的，所以统一转换为String
          const value = obj.value + ''
          return obj.conditions[0] <= value.length && value.length <= obj.conditions[1]
        },
        number: obj => {
          if (!obj.value) return true
          reg = /^[0-9]*\.?[0-9]*$/
          return reg.test(obj.value)
        },
        string: obj => {
          if (!obj.value) return true
          reg = /^[a-zA-Z0-9]*$/
          return reg.test(obj.value)
        },
        moblie: obj => {
          if (!obj.value) return true
          reg = /^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/
          return reg.test(obj.value)
        },
        phone: obj => {
          if (!obj.value) return true
          reg = /^1[3,5,8,7]{1}[\d]{9}$/
          return reg.test(obj.value)
        },
        noChinese: obj => {
          if (!obj.value) return true
          reg = /[\u4e00-\u9fa5]/
          return !reg.test(obj.value)
        },
        lon: obj => {
          if (!obj.value) return true
          reg = /^[-+]?(0?\d{1,2}\.\d{1,10}|1[0-7]?\d{1}\.\d{1,10}|180\.0{1,10})$/
          return reg.test(obj.value)
        },
        lat: obj => {
          if (!obj.value) return true
          reg = /^[-+]?([0-8]?\d{1}\.\d{1,10}|90\.0{1,10})$/
          return reg.test(obj.value)
        },
        url: obj => {
          if (!obj.value) return true
          reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~/])+$/
          return reg.test(obj.value)
        },
        repeat: obj => {
          if (!obj.value) return true
          return obj.value === obj.value1
        },
        email: obj => {
          if (!obj.value) return true
          reg = /^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/
          return reg.test(obj.value)
        },
        password: obj => {
          if (!obj.value) return true
          reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,16}$/
          return reg.test(obj.value)
        },
        fixedNum: obj => {
          if (!obj.value) return true
          return obj.value.length === obj.conditions[0]
        }
      }
    },
    // 得到验证结果
    checkResult: function (obj) {
      let checkType
      let result = true
      let message = '验证成功'
      const validatorMethods = this.validator.methods
      const validatorMessage = this.validator.messages
      // 循环验证
      for (let i = 0, len = obj.rules.length; i < len; i++) {
        // 当验证的规则不存在，默认跳过这个验证
        if (!validatorMethods[obj.rules[i]]) {
          console.log(obj.rules[i] + '规则不存在')
          break
        }
        // 得到当前验证失败信息
        if (!validatorMethods[obj.rules[i]](obj)) {
          checkType = obj.rules[i]
          result = false
          break
        }
      }
      // 如果验证失败, 得到验证失败的结果集
      if (!result) {
        message = validatorMessage[checkType]
        if (obj.conditions) {
          obj.conditions.forEach((item, index) => {
            message = message.replace('{' + (index + 1) + '}', item)
          })
        }
        message = message.replace('{0}', obj.label)
        return { result, message }
      }

      return { result, message }
    }
  }
  return validatorObj.checkResult(obj)
}
