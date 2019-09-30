import request from '@/utils/request';

export function getList(query) {
	return request({
		url: '/player/list',
        method: 'get',
        params:query
	});
}