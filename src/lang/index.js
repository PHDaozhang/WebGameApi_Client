import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementTwLocale from 'element-ui/lib/locale/lang/zh-TW'
import zhLocale from './zh'
import twLocale from './tw'

Vue.use(VueI18n)

const messages = {
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  tw: {
    ...twLocale,
    ...elementTwLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: Cookies.get('language') || 'zh',
  // set locale messages
  messages
})

export default i18n
