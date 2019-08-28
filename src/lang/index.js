import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {
  _getLocalStore
} from '@/common/js/storage'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
// import elementEsLocale from 'element-ui/lib/locale/lang/es'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
// import esLocale from './es'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: _getLocalStore('language') || 'zh',
  // set locale messages
  messages
})

export default i18n
