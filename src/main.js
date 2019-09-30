// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import router from './router'

import Cookies from 'js-cookie'
import store from './store'
import common from './utils/common'
import md5 from 'js-md5'
import * as filters from './filters' // global filters
import i18n from './lang' // Internationalization

import elDragDialog from '@/directive/el-dragDialog' // 模态框可拖拽
import global_ from './components/Global/index'

//导入css文件
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import './styles/publice.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

Vue.use(elDragDialog);
Vue.use(common);
Vue.use(ElementUI,{
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})


Vue.prototype.$md5 = md5;
Vue.prototype.GLOBAL = global_

Vue.config.productionTip = false

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
