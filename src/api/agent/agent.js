import request from '@/utils/request';

export function getList(query) {
	return request({
		url: '/agent/list',
        method: 'get',
        params:query
	});
}

export function addAgent(data) {
    return request({
        url:"/agent/",
        method:"post",
        data
    })
}


export function fetchAgentDetail(id){
    return request({
        url:"/agent/" + id,
        method:"get",
    })
}

export function deleteAgent(id){
    return request({
        url:"/agent/" + id,
        method:"delete",
    })
}

export function updateAgent(data){
    return request({
        url:"/agent/",
        method:"put",
        data
    })
}