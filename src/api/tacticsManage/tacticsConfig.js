import request from '@/utils/request'
// 获取所有策略组
export function fetchList(data) {
  return request({
    url: '/admin/policy/group/list',
    method: 'get',
    data
  })
}
// 获取单个策略详情
export function fetchDetail(id) {
  return request({
    url: '/admin/policy/group/detail/' + id,
    method: 'get'
  })
}

// 编辑单个通道详情
export function updateUser(data) {
  return request({
    url: '/admin/policy/group/detail',
    method: 'put',
    data
  })
}

// 编辑通道开关
export function updateType(data) {
  return request({
    url: '/admin/policy/group/detail/type/' + data.id,
    method: 'put',
    data
  })
}

// 编辑通道开关
export function updateSwitch(data) {
  return request({
    url: '/admin/policy/group/detail/enabled/' + data.id,
    method: 'put',
    data
  })
}