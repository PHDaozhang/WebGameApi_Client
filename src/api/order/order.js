import request from '@/utils/request';

export function getList(query) {
	return request({
		url: '/order/list',
        method: 'get',
        params:query
	});
}


// export function fetchOrderDetail(id){
//     return request({
//         url:"/order/" + id,
//         method:"get",
//     })
// }
