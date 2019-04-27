export default {
  data () {
    /**
     * 页面上的可复用的验证规则
     */
    // 验证号码格式
    const CHECK_PHONE = (rule, value, callback) => {
      let check = this.$validate({label: '号码', value, rules: ['phone']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 验证号码格式以及不能为空
    const CHECK_PHONE_NOTNULL = (rule, value, callback) => {
      let check = this.$validate({label: '号码', value, rules: ['notnull', 'phone']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测邮箱格式
    const CHECK_EMAIL = (rule, value, callback) => {
      let check = this.$validate({label: '邮箱', value, rules: ['email']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测邮箱格式以及不能为空
    const CHECK_EMAIL_NOTNULL = (rule, value, callback) => {
      let check = this.$validate({label: '邮箱', value, rules: ['notnull', 'email']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      CHECK_PHONE,
      CHECK_PHONE_NOTNULL,
      CHECK_EMAIL,
      CHECK_EMAIL_NOTNULL
    }
  },
  methods: {
    // 初始化验证数据
    _initValidate (formInfo) {
      const obj = {},
        fieldList = formInfo.fieldList
      // 循环字段列表
      for (let item of fieldList) {
        let type = item.type === 'select' ? '选择' : '输入'
        if (item.required) {
          if (item.validator) {
            obj[item.value] = {
              required: item.required,
              validator: item.validator,
              trigger: 'blur'
            }
          } else {
            obj[item.value] = {
              required: item.required,
              message: '请' + type + item.label,
              trigger: 'blur'
            }
          }
        } else if (item.validator) {
          obj[item.value] = {
            validator: item.validator,
            trigger: 'blur'
          }
        }
      }
      formInfo.rules = obj
    }
  }
}
