import request from '@/utils/request'

export function fetchNodeList() {
  return request({
    url: '/system/node/list',
    method: 'get',
  })
}

export function createNode(data) {
  return request({
    url: '/system/node/',
    method: 'post',
    data
  })
}

export function fetchNodeDetail(id) {
  return request({
    url: '/system/node/'+id,
    method: 'get',
  })
}

export function updateNode(data) {
  return request({
    url: '/system/node/',
    method: 'put',
    data
  })
}

export function deleteNode(id) {
  return request({
    url: '/system/node/' + id,
    method: 'delete',
  })
}
