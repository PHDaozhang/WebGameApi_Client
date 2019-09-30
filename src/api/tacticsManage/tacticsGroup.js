import request from '@/utils/request'

export function getChannelList(query) {
  return request({
    url: '/admin/channel/config/list',
    method: 'get',
    params: query
  })
}
export function getAllGroupList(query) {
  return request({
    url: '/admin/policy/group/list',
    method: 'get',
    params: query
  })
}

export function addGroup(data) {
  return request({
    url: '/admin/policy/group/',
    method: 'post',
    data
  })
}
