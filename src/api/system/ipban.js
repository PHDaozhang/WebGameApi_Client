import request from '@/utils/request';

export function getList(data) {
	return request({
		url: '/system/ipban/list',
		method: 'get',
		params:data
	});
}

//新增
export function addList(data) {
	return request({
		url: '/system/ipban/',
		method: 'post',
		data
	});
}

//根据id获取要修改的详细信息
export function getListData(id) {
	return request({
		url: 'system/ipban/' + id,
		method: 'get'
	});
}

//修改
export function listEdit(data) {
	return request({
		url: '/system/ipban/',
		method: 'put',
		data
	});
}

//删除
export function listDelete(id) {
	return request({
		url: 'system/ipban/' + id,
		method: 'delete',
	});
}
