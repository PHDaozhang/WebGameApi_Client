// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils';

function pluralize(time, label) {
	if (time === 1) {
		return time + label;
	}
	return time + label + 's';
}

export function timeAgo(time) {
	const between = Date.now() / 1000 - Number(time);
	if (between < 3600) {
		return pluralize(~~(between / 60), ' minute');
	} else if (between < 86400) {
		return pluralize(~~(between / 3600), ' hour');
	} else {
		return pluralize(~~(between / 86400), ' day');
	}
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
	const si = [
		{ value: 1e18, symbol: 'E' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e9, symbol: 'G' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e3, symbol: 'k' }
	];
	for (let i = 0; i < si.length; i++) {
		if (num >= si[i].value) {
			return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
		}
	}
	return num.toString();
}

export function toThousandFilter(num) {
	return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

// 格式化时间，将时间格式化为多少天前
export function dateFormatDays(time) {
	var temp = time.split('+');
	var times = temp[0].replace('T', ' ');

	var cuTime = new Date().getTime();
	var preTime = new Date(times).getTime();
	var mss = cuTime - preTime;
	var days = parseInt(mss / (1000 * 60 * 60 * 24));
	var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var reutnText = '';
	if (days > 0) {
		if (days >= 365) {
			reutnText = '一年前';
		} else if (days >= 90) {
			reutnText = '三个月前';
		} else if (days > 30) {
			reutnText = '一个月前';
		} else {
			reutnText = days + '天前';
		}
	} else if (hours > 0) {
		reutnText = hours + '小时前';
	} else {
		reutnText = '刚刚';
	}
	return reutnText;
}

// 格式化时间 后端给的时间后面有一串莫名的后缀，需要去掉
export function dateFormat(time) {
	var temp = time.split('+');
	var times = temp[0].replace('T', ' ');
	// var d = new Date(time);
	// var times = d.format('yyyy-mm-dd hh:mm:ss');
	// var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
	return times;
}

//时间戳格式化
export function formatDate(date, fmt) {
	if (!date || date == 0) {
		return date
	}
	fmt = fmt || "yyyy-MM-dd hh:mm:ss";
	var time = date * 1000;
	date = new Date(time);
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
		}
	}
	return fmt;
}

//数字格式化
export function NumFormat(value) {
	if (!value) return "0.00";

	/*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
	var intPart = Number(value) | 0; //获取整数部分
	var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断

	var floatPart = ".00"; //预定义小数部分
	var value2Array = value.split(".");

	//=2表示数据有小数位
	if (value2Array.length == 2) {
		floatPart = value2Array[1].toString(); //拿到小数部分

		if (floatPart.length == 1) {
			//补0,实际上用不着
			return intPartFormat + "." + floatPart + "0";
		} else {
			return intPartFormat + "." + floatPart;
		}
	} else {
		return intPartFormat + floatPart;
	}
}

//保存两位小数并加上百分号(计算百分比)
export function NumtoFixed(value) {
	var num = Number(value) * 100;
	if (num == 0 || num == '') {
		return '0%'
	} else {
		return num.toFixed(2) + '%'
	}

}

//格式化Arpu,Arppu
export function NumtoFixed2(value) {
	return value.toFixed(2);
}

//计算arppu 和 arpu
export function ArppuFixed(num1,num2){
	if (num1 == 0 || !num1) return '¥ 0.00';
	return "¥ " + ((num2 / num1) / 100).toFixed(2)
}

//人民币统一除以100保留两位小数
export function RMBfilters(value) {
	if (value) {
		value = "¥ " + (value / 100).toFixed(2);
	} else {
		value = "¥ 0.00"
	}
	return value;
}

//计算充兑比
export function toFixedNum(resulet, num1, num2) {
	if (num1 == 0 || !num1) return '10000.00';
	return (num2 / num1).toFixed(2)
}

//两数相除百分比
export function dividerToTwoNum(num1, num2) {
	if (num1 == 0 || !num1) return '0.0%';
	return (num2 / num1 * 100).toFixed(1) + "%";
}

//将秒转化为小时
export function formatSecond(value) {
	if (value && value != 0) {
		var secondTime = parseInt(value) // 秒
		var minuteTime = 0 // 分
		var hourTime = 0 // 小时
		var dayTime = 0 // 天
		var result = ''
		if (value < 60) {
			result = secondTime + '秒'
		} else {
			if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
				// 获取分钟，除以60取整数，得到整数分钟
				minuteTime = parseInt(secondTime / 60)
				// 获取秒数，秒数取佘，得到整数秒数
				secondTime = parseInt(secondTime % 60)
				// 如果分钟大于60，将分钟转换成小时
				if (minuteTime >= 60) {
					// 获取小时，获取分钟除以60，得到整数小时
					hourTime = parseInt(minuteTime / 60)
					// 获取小时后取佘的分，获取分钟除以60取佘的分
					minuteTime = parseInt(minuteTime % 60)
					if (hourTime >= 24) {
						// 获取天数， 获取小时除以24，得到整数天
						dayTime = parseInt(hourTime / 24)
						// 获取小时后取余小时，获取分钟除以24取余的分；
						hourTime = parseInt(hourTime % 24)
					}
				}
			}
			if (secondTime > 0) {
				secondTime = parseInt(secondTime) >= 10 ? secondTime : '0' + secondTime
				result = '' + secondTime + '秒'
			}
			if (minuteTime > 0) {
				minuteTime = parseInt(minuteTime) >= 10 ? minuteTime : '0' + minuteTime
				result = '' + minuteTime + '分' + result
			}
			if (hourTime > 0) {
				result = '' + parseInt(hourTime) + '小时' + result
			}
			if (dayTime > 0) {
				result = '' + parseInt(dayTime) + '天' + result
			}
		}
		return result
	} else {
		return value
	}
}

//将银行代码转化为银行名称
export function formatBankCode(code) {
	const bankList = {
		1: "中国银行",
		2: "中国工商银行",
		3: "中国农业银行",
		4: "中国建设银行",
		5: "中国交通银行",
	}
	return bankList[code]
}


//根据游戏ID获取游戏名称
export function formatGameId(gameId, data) {
	var gameName = "无此游戏"
	for (const key in data) {
		if (data.hasOwnProperty(gameId) && key == gameId) {
			gameName = data[key].gameName;
		}
	}
	return gameName;
}

//根据游戏ID和房间ID获取房间名称
export function formatRoomId(roomId, gameId, data) {
	var roomName = "无此房间"
	for (const key in data) {
		if (data.hasOwnProperty(gameId) && key == gameId) {
			for (const room in data[key].rooms) {
				if (room == roomId) {
					roomName = data[key].rooms[room]
				}
			}
			// for (let i = 0; i < data[key].rooms.length; i++) {
			// 	if (data[key].rooms[i].roomId == roomId) {
			// 		roomName = data[key].rooms[i].roomName
			// 	}
			// }
		}
	}
	return roomName;
}

//根据来源Id获取来源名称
export function formatReasonId(reasonId, data) {
	if (data == undefined) {
		return reasonId;
	}
	var reasonName = "来源不明";
	reasonName = data[reasonId];
	return reasonName;
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}


export function booleanFilter(value)
{
	return value ? "是" : "否";
}