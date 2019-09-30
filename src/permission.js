import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// permission judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.includes('root')) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist



router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) {
    // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        // 获取系统全局配置
        store.dispatch('fnGetConfig').then(res => {}).catch(err =>{   console.log("fnGetConfig error") })
        
        // 获取项目全局配置
        // store.dispatch('fnGetProjectConfig').then(res => {})
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => {
          // 拉取user_info
          const menu = res.data.Data.Nav // note: roles must be a object array! such as: [{id: '1', name: 'editor'}, {id: '2', name: 'developer'}]
          //const roles = res.data.Data.Role
          store.dispatch('GenerateRoutes', { menu }).then(accessRoutes => {
            // console.log("accessRoutes");
            // console.log(JSON.stringify(accessRoutes));
            // 根据roles权限生成可访问的路由表
            router.addRoutes(accessRoutes) // 动态添加可访问路由表

            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            //next({ path: accessRoutes[0].children[0].path,replace: true })
          })
            .catch(err=>{
                console.log("GenerateRoutes err");
            })
        })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    console.log("has not token");
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
