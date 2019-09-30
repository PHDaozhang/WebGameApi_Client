import request from '@/utils/request'

export function fnGetList(query) {
  return request({
    url: '/system/mode/list',
    method: 'get',
    params: query
  })
}

export function fnModeAdd(query) {
  return request({
    url: '/system/mode/',
    method: 'post',
    params: query
  })
}

export function fnDeleteMode(id) {
  return request({
    url: '/system/mode/'+id,
    method: 'delete',
  })
}

export function fnEditData(query) {
  return request({
    url: '/system/mode/' + query,
    method: 'get'
  })
}

export function fnEditMode(data) {
  return request({
    url: '/system/mode/',
    method: 'put',
    data
  })
}

export function fetchNodeList() {
  return request({
    url: '/system/node/list',
    method: 'get'
  })
}

