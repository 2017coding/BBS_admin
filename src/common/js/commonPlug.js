import commonApi from '@/api/common' // 公共接口
import utils from '@/common/js/utils' // 公共方法
import validate from '@/common/js/validate' // 公共验证
import echarts from 'echarts' // 图表
import config from '@/common/js/config'
import eventBus from '@/common/js/eventBus'

export default {
  install (Vue, options) {
    Vue.prototype.$api = commonApi
    Vue.prototype.$fn = utils
    Vue.prototype.$validate = validate
    Vue.prototype.$echarts = echarts
    Vue.prototype.$config = config
    Vue.prototype.$eventBus = eventBus
  }
}
