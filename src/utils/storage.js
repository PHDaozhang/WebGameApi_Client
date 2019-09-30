var storage = {
    set(key, value) {
        var val = value.toString();
        localStorage.setItem(key, JSON.stringify(val));
    },
    get(key) {
        // 判断是否有这个Key，没有的话return空数组，防止报错
        if (localStorage.getItem(key)) {
            var arr = JSON.parse(localStorage.getItem(key)).split(",");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == "true") {
                    arr[i] = true;
                } else {
                    arr[i] = false;
                }
            }
            return arr
        } else {
            return []
        }
    },
    remove() {
        localStorage.removeItem(key)
    }

}
export default storage;