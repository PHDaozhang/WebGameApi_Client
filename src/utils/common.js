exports.install = function(Vue, options){
  //清空数组空元素
  Vue.prototype.clearNullOfArray = function(arr){
    if(arr){
      for (let index = 0; index < arr.length; index++) {
          if(arr[index] == "" || typeof(arr[index]) == "undefined"){
            arr.splice(index,1);
            index = index - 1;
          }
      }
    }
    return arr;
  }

  //将字符串数组转化为数值数组
  Vue.prototype.stringTranslateNumber = function(arr){
    if(arr){
      var temp = [];
      arr.forEach(function(data, index, arr) {
        if(data != ''){
          temp.push(+data);
        }
      });
      return temp;
    }
  }

  Vue.prototype.formatDatalistTree = function(node,list,level){
    list= list || [];
    var is_root = false;
    
    if (!node.hasOwnProperty("Id")) {
      node = {"Id":-1, "children":[]};
      is_root = true;
    }
    
    for (var i=0; i<list.length; i++) {
      
      if (list[i]["ParentId"] == node["Id"]) {
        
        var new_child = list[i];
        new_child["label"] = list[i].LangCn;
        new_child["Name"] = list[i].LangCn;
        new_child["children"] = new Array();
        new_child["TempLevel"] = level;
        
        
        Vue.prototype.formatDatalistTree(new_child, list, level+1);
        node["children"].push(new_child);		
      }
    }
    if (is_root) {
      return node;
    }
  }


  Vue.prototype.formatDatalistTreeOfPer = function(node,list,level){
    list= list || [];
    var is_root = false;
    
    if (!node.hasOwnProperty("Id")) {
      node = {"Id":-1, "children":[]};
      is_root = true;
    }
    
    for (var i=0; i<list.length; i++) {
      
      if (list[i]["ParentId"] == node["Id"]) {
        
        var new_child = list[i];
        new_child["label"] = list[i].Name;
        new_child["Name"] = list[i].Name;
        new_child["children"] = new Array();
        new_child["TempLevel"] = level;
        
        
        Vue.prototype.formatDatalistTreeOfPer(new_child, list, level+1);
        node["children"].push(new_child);		
      }
    }
    if (is_root) {
      return node;
    }
  }

  Vue.prototype.showTagType = function(status) {
    switch (status) {
      case 0:
        return 'success'
        break;
      case 1:
        return 'danger'
        break;
      case 2:
        return ''
        break;
      default:
        return ''
        break;
    }
  }
}