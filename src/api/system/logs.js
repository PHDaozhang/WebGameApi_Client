import request from '@/utils/request';

export function getList(param) {
	return request({
		url: '/system/logs/list',
		method: 'get',
		params: param
	});
}

export function listEmpty(param) {
	return request({
		url: '/system/logs/list',
		method: 'get',
		params: param
	});
}
