import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/sonuser/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/admin/sonuser/' + id,
    method: 'get'
  })
}

export function createElement(data) {
  return request({
    url: '/admin/sonuser/',
    method: 'post',
    data
  })
}

export function updateElement(data) {
  return request({
    url: '/admin/sonuser/',
    method: 'put',
    data
  })
}

export function deleteElement(id) {
  return request({
    url: '/admin/sonuser/'+id,
    method: 'delete',
  })
}
