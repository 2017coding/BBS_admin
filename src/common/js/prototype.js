import config from '@/common/js/config' // 配置文件
import utils from '@/common/js/utils' // 公共方法
import validate from '@/common/js/validate' // 公共验证方法
import initRules from '@/common/js/initRules' // 初始化验证规则
import initDataPerms from '@/common/js/initDataPerms' // 初始化数据权限
import handleAPI from '@/common/js/handleApi' // 基本操作API的方法
import eventBus from '@/common/js/eventBus'

export default {
  install (Vue, options) {
    Vue.prototype.$config = config
    Vue.prototype.$fn = utils
    Vue.prototype.$validate = validate
    Vue.prototype.$initRules = initRules
    Vue.prototype.$initDataPerms = initDataPerms
    Vue.prototype.$handleAPI = handleAPI
    Vue.prototype.$eventBus = eventBus
  }
}
