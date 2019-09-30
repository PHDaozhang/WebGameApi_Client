import store from '@/store'


export default function checkPermission(mode) {
  if (mode) {
    const roles = store.getters && store.getters.roles;
    for (var i in roles){
      if (roles[i]["Permission"].indexOf(mode) > -1) {
        return true;
      }
    }
    return false
  } else {
    return true
  }
}
