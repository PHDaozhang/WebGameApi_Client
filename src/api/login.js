import request from '@/utils/request'

export function loginByUsername(Username, Password) {
  const data = {
    Username,
    Password
  }
  return request({
    url: '/system/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/system/user/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/system/user/islogin',
    method: 'get'
    // params: { token }
  })
}

//获取系统配置
export function getSystemConfig(token) {
  return request({
    url: '/system/public/config',
    method: 'get'
  })
}

//获取项目配置
// export function getProjectConfig(token) {
//   return request({
//     url: '/admin/config/info',
//     method: 'get'
//   })
// }