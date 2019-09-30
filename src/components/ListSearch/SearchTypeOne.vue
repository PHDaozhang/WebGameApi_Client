<template>
  <div class="filter-container" style="margin-bottom:10px">
    <el-select v-model="param.AdminId" filterable placeholder="代理账号选择" @change="accountChange" v-if="showAccount">
      <el-option label="全部账号" value></el-option>
      <el-option v-for="item in accountList" :key="item.Id" :label="item.Username" :value="item.Id"></el-option>
    </el-select>

    <el-select v-model="param.ChannelId" filterable placeholder="渠道选择" v-if="showChannel">
      <el-option label="全部渠道" value></el-option>
      <el-option v-for="item in channelList" :key="item.ChannelId" :label="item.ChannelName" :value="item.ChannelId"></el-option>
    </el-select>

    <el-select v-model="param.TemplateId" filterable placeholder="落地页选择" v-if="showLanding">
      <el-option label="全部落地页" value></el-option>
      <el-option v-for="item in landingList" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
    </el-select>

    <el-select v-model="param.GameId" filterable placeholder="子游戏选择" @change="gameChange" v-if="showGame">
      <el-option label="全部子游戏" value></el-option>
      <el-option v-for="(val,key) in gameList" :key="key" :label="val.gameName" :value="key"></el-option>
    </el-select>

    <el-select v-model="param.RoomId" filterable placeholder="场次选择" v-if="showRoom">
      <el-option label="全部场次" value></el-option>
      <el-option v-for="(val,key) in roomList" :key="key" :label="val" :value="key"></el-option>
    </el-select>

    <date-time
      @chooseDateTime="chooseTime"
      :inputType="dateTimeType"
      :valueFormat="valueFormat"
      :defaultDateTime="dataTime"
      :limitNumber="limitNumber"
      v-if="showDateTime"
      :showOptions="showOptions"
    />

    <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.seach') }}</el-button>
    <el-button type="warning" icon="el-icon-refresh" @click="handleReset">{{ $t('common.reset') }}</el-button>
    <el-button type="success" icon="el-icon-edit" @click="handleCreate" v-if="showAddBtn">{{ $t('common.add') }}</el-button>
  </div>
</template>
<script>
import { fetchLandingList } from "@/api/promotion/landing";
import DateTime from "@/components/DateTime";
export default {
  name: "searchTypeOne",
  components: { DateTime },
  props: {
    showAccount: {
      type: Boolean,
      default: true
    },
    showChannel: {
      type: Boolean,
      default: true
    },
    showLanding: {
      type: Boolean,
      default: false
    },
    showGame: {
      type: Boolean,
      default: false
    },
    showRoom: {
      type: Boolean,
      default: false
    },
    showAddBtn: {
      type: Boolean,
      default: false
    },
    showDateTime: {
      type: Boolean,
      default: true
    },
    showOptions: {
      type: Boolean,
      default: false
    },
    dateTimeType: {
      type: String,
      default: "datetimerange"
    },
    valueFormat: {
      type: String,
      default: "timestamp"
    },
    limitNumber: {
      type: Number,
      default: 0
    },
    defaultGameId: {
      type: String,
      default: ""
    },
    defaultAdminId: {
      type: String,
      default: ""
    },
    defaultChannelId: {
      type: String,
      default: ""
    },
    defaultTemplateId: {
      type: String,
      default: ""
    },
    defaultRoomId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      accountList: this.$store.getters.accountData, //账号列表
      channelList: this.$store.getters.channelData, //渠道列表
      gameList: this.$store.getters.gamesData.games, //游戏列表
      roomList: {}, //房间列表
      landingList: null, //落地页列表
      dataTime: [],
      param: {
        AdminId: this.defaultAdminId ? Number(this.defaultAdminId) : "",
        ChannelId: this.defaultChannelId,
        TemplateId: this.defaultGameId,
        GameId: this.defaultGameId,
        RoomId: this.defaultRoomId,
        BeginTime: "",
        EndTime: ""
      }
    };
  },
  created() {
    if (this.showLanding) {
      this.getLandingList();
    }
  },
  methods: {
    // 获取落地页列表
    getLandingList() {
      fetchLandingList()
        .then(response => {
          this.landingList = response.data.Data;
        })
        .catch(err => {});
    },
    //获取选择的时间
    chooseTime(val) {
      this.param.BeginTime = val[0];
      this.param.EndTime = val[1];
    },
    //代理账号变化查找该代理下面的渠道
    accountChange(val) {
      this.channelList = [];
      this.param.ChannelId = "";
      if (val) {
        var allChannelList = this.$store.getters.channelData;
        if (allChannelList) {
          for (let i = 0; i < allChannelList.length; i++) {
            if (allChannelList[i].AdminId == val) {
              this.channelList.push(allChannelList[i]);
            }
          }
        }
      } else {
        this.channelList = this.$store.getters.channelData;
      }
    },
    //游戏变化查找该游戏下面的房间
    gameChange(val) {
      this.roomList = {};
      this.param.RoomId = "";
      var allGameList = this.$store.getters.gamesData.games;
      if (allGameList) {
        for (const key in allGameList) {
          if (allGameList.hasOwnProperty(key)) {
            if (key == val) {
              this.roomList = allGameList[key].rooms;
            }
          }
        }
      }
    },
    //点击查询
    handleFilter() {
      this.$emit("getParams", this.param);
    },
    //点击重置
    handleReset() {
      this.param = {
        AdminId: "",
        ChannelId: "",
        TemplateId: "",
        GameId: "",
        RoomId: "",
        BeginTime: "",
        EndTime: ""
      };
      this.dataTime = [];
      this.$emit("resetParams", this.param);
    },
    //点击新增
    handleCreate() {
      this.$emit("addElement");
    }
  }
};
</script>

