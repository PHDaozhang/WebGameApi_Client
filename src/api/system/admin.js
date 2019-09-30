import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/admin/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/system/admin/' + id,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/system/admin/',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/system/admin/',
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/system/admin/' + id,
    method: 'delete',
  })
}

export function updatePassworld(data) {
  return request({
    url: '/system/public/modifypassword',
    method: 'put',
    data
  })
}
