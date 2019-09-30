import { asyncRoutes, constantRoutes } from '@/router'
const _import = require('@/router/_import_development.js')//获取组件的方法
/* Layout */
import Layout from '@/views/layout/Layout';
import i18n from '@/lang'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}


/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function formatDatalistTree(node,list,level) {
  list= list || [];
	var is_root = false;
	if (!node.hasOwnProperty("Id")) {
		node = {"Id":-1, "children":[]};
		is_root = true;
  }
  

	for (var i=0; i<list.length; i++) {
		
		if (list[i]["ParentId"] == node["Id"]) {
			
			var new_child = {};
			new_child["children"] = new Array();
			new_child["Id"] = list[i].Id;
      new_child['path'] = list[i].Url;
      new_child['name'] = list[i].Name;
      new_child['redirect'] = list[i].ParentId == -1 ? 'noredirect' : '';
			new_child['component'] = list[i].ParentId == -1 ? Layout : _import(list[i].Url);
			var metaObj =  {};
			metaObj.title = list[i].Name;
			metaObj.icon = list[i].Icon;
      metaObj.noCache = true;
			new_child['meta'] = metaObj
			
			
			formatDatalistTree(new_child, list, level+1);
			node["children"].push(new_child);		
		}
  }
  
 

	if (is_root) {
		return node;
	}
}

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    home:""
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_HOMEPATH: (state,home) => {
      state.home = home
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        console.log("GenerateRoutes");
        console.log(data)
        var menu = formatDatalistTree({},data.menu,1)
        menu = menu.children
        let accessedRoutes = menu
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        console.log("accessedRoutes");
        console.log(accessedRoutes);
        var routerCn = {}
        var routerTw = {}
        if(data.menu && data.menu.length > 0){
          for (let index = 0; index < data.menu.length; index++) {
            routerCn[data.menu[index].Name] = data.menu[index].LangCn
            routerTw[data.menu[index].Name] = data.menu[index].LangTw
          }
        }
        i18n.mergeLocaleMessage('zh',{route:routerCn})
        i18n.mergeLocaleMessage('tw',{route:routerTw})
        commit('SET_ROUTES', accessedRoutes)

        for(let i = 0;i  < accessedRoutes.length;i++)
        {
            if( accessedRoutes[i].children.length > 0 )
            {
              //commit('SET_HOMEPATH',accessedRoutes[0].children[0].path);
              //console.log("before GenerateRoutes resolve " + accessedRoutes[0].children[0].path);

              commit('SET_HOMEPATH',accessedRoutes[i].children[0].path);
              console.log("before GenerateRoutes resolve " + accessedRoutes[i].children[0].path);
              break;
            }
        }

        resolve(accessedRoutes)
      })
    }
  }
}

export default permission
