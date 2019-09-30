import { loginByUsername, logout, getUserInfo, getSystemConfig } from '@/api/login' //getProjectConfig
import { getToken, setToken, removeToken } from '@/utils/auth'

export function formatChannelData(data) {
  if (data && data.length > 0) {
    data.unshift({
      ChannelId: "",
      ChannelName: "全部渠道"
    })
  }
  return data
}

export function formatAccountData(data) {
  if (data && data.length > 0) {
    data.unshift({
      Id: "",
      Username: "全部账号"
    })
  }
  return data
}

export function formatGameData(data) {
  const gameData = {}
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].Type == "fishSource") {
        gameData.fishSource = data[i].Value ? JSON.parse(data[i].Value) : {}
      } else if (data[i].Type == "games") {
        gameData.games = data[i].Value ? JSON.parse(data[i].Value) : {}
      } else if (data[i].Type == "goldSource") {
        gameData.goldSource = data[i].Value ? JSON.parse(data[i].Value) : {}
      } else if (data[i].Type == "betName") {
        gameData.betName = data[i].Value ? JSON.parse(data[i].Value) : {}
      }else if (data[i].Type == "cardType") {
        gameData.cardType = data[i].Value ? JSON.parse(data[i].Value) : {}
      }else if (data[i].Type == "baseInfo") {
        gameData.baseInfo = data[i].Value ? JSON.parse(data[i].Value) : {}
      }else if (data[i].Type == "majongFanName") {
        gameData.majongFanName = data[i].Value ? JSON.parse(data[i].Value) : {}
      }

    }
  }
  return gameData
}

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    adminInfo: '',
    avatar: '',
    introduction: '',
    roles: [],//用户角色
    setting: {
      articlePlatform: []
    },
    systemConfig: '',//系统配置信息
    accountInfo: '',
    projectConfig: '',//项目配置信息
    channelData: '',//全部渠道
    gamesData: '',//全部游戏
    accountData:'',//全部账号
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_ADMININFO: (state, data) => {
      state.adminInfo = data
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CONFIG: (state, config) => {
      state.systemConfig = config
    },
    SET_ACCOUNT: (state, info) => {
      state.accountInfo = info
    },
    SET_PROJECT_CONFIG: (state, info) => {
      state.projectConfig = info
    },
    SET_CHANNEL: (state, data) => {
      state.channelData = data
    },
    SET_GAMES: (state, data) => {
      state.gamesData = data
    },
    SET_ACCOUNTDATA: (state, data) => {
      state.accountData = data
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data.Data
          commit('SET_TOKEN', data.Token)
          setToken(data.Token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack
          if (!response.data.Data) {
            reject('请重新登陆')
          }
          const data = response.data.Data
          commit('SET_TOKEN', data.Token)
          commit('SET_ACCOUNT', data.Account)
          commit('SET_ADMININFO', data)
          setToken(data.Token)
          if (data.Role) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.Role)
          } else {
            reject('获取用户信息错误')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取系统全局配置
    fnGetConfig({ commit, state }) {
      return new Promise((resolve, reject) => {
        getSystemConfig(state.token).then(response => {
          if (!response.data.Data) {
            reject('请重新登陆')
          }
          const data = response.data.Data
          commit('SET_CONFIG', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取项目全局配置
    // fnGetProjectConfig({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getProjectConfig(state.token).then(response => {
    //       if (!response.data.Data) {
    //         reject('请重新登陆')
    //       }
    //       const data = response.data.Data;
    //       const channelData = data.ChildChannelInfo;
    //       const gameData = formatGameData(data.GameSetting);
    //       const accountData = data.ChildAdminInfo;
    //       console.log(gameData)
    //       commit('SET_CHANNEL', channelData);
    //       commit('SET_GAMES', gameData);
    //       commit('SET_PROJECT_CONFIG', data);
    //       commit('SET_ACCOUNTDATA',accountData);
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    //清空token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

  }
}

export default user
