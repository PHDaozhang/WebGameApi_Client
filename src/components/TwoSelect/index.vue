<template>
  <div style="float:left;margin-right:5px">
    <el-select v-model="param.AdminId" filterable placeholder="代理账号选择" @change="accountChange">
      <el-option label="全部账号" value=""></el-option>
      <el-option v-for="item in accountList" :key="item.Id" :label="item.Username" :value="item.Id"></el-option>
    </el-select>
    
    <el-select v-model="param.ChannelId" filterable placeholder="渠道选择" @change="selectChange">
      <el-option label="全部渠道" value=""></el-option>
      <el-option v-for="item in channelList" :key="item.ChannelId" :label="item.ChannelName" :value="item.ChannelId"></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "twoSelect",
  props: {},
  data() {
    return {
      accountList:this.$store.getters.accountData,//账号列表
      channelList:this.$store.getters.channelData,//渠道列表
      param:{
        AdminId:'',
        ChannelId:'',
      }
    };
  },
  methods: {
    accountChange(val){
      this.channelList = [];
      this.param.ChannelId = '';
      var allChannelList = this.$store.getters.channelData;
      for (let i = 0; i < allChannelList.length; i++) {
        if(allChannelList[i].AdminId == val){
          this.channelList.push(allChannelList[i])
        }
      }
      this.selectChange()
    },
    selectChange() {
      this.$emit("selectChange", this.param);
    }
  }
};
</script>

