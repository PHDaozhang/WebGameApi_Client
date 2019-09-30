import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/system/role/' + id,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/system/role/',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/system/role/',
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/system/role/' + id,
    method: 'delete',
  })
}

export function fetchNodeList() {
  return request({
    url: '/system/node/list',
    method: 'get'
  })
}

export function updateNode(data) {
  return request({
    url: '/system/role/node',
    method: 'put',
    data
  })
}

export function fetchPermissionList(id) {
  return request({
    url: '/system/mode/list/',
    method: 'get',
  })
}

export function updatePermission(data) {
  return request({
    url: '/system/role/permission',
    method: 'put',
    data
  })
}