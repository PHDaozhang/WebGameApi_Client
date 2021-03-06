const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  pageSize: state => state.app.pageSize,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  adminInfo: state => state.user.adminInfo,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  home: state => state.permission.home,
  errorLogs: state => state.errorLog.logs,
  systemConfig: state => state.user.systemConfig,
  accountInfo: state => state.user.accountInfo,
  projectConfig: state => state.user.projectConfig,
  channelData: state => state.user.channelData,
  gamesData: state => state.user.gamesData,
  accountData: state => state.user.accountData,
}
export default getters
