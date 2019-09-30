<template>
  <div class="app-container logsBox" v-if="GLOBAL.checkPermission(95) || GLOBAL.checkPermission(94)">
    <div class="filter-container">
      <el-input
        v-model="param.Keyword"
        placeholder="日志查询"
        clearable
        style="width: 30%;"
        class="filter-item"
        @keyup.enter.native="fnGetList"
      />
      <el-button :loading="searchBtnLoadingBol" class="filter-item" type="primary" icon="el-icon-search" @click="fnGetList">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-close" @click="handleCreate" v-if="GLOBAL.checkPermission(94)">日志清空</el-button>
      <!--角色列表-->
      <div v-loading="loading">
        <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" v-if="GLOBAL.checkPermission(95)">
          <el-table-column label="ID" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.Id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作者" width="150px" align="center">
            <template slot-scope="scope">
              <span v-if="!scope.row.Ip">空</span>
              <span v-else>{{ scope.row.Ip }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作模块" min-width="150px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.Mode == 166">数据统计</span>
              <span v-else-if="scope.row.Mode == 199">财务模块</span>
              <span v-else-if="scope.row.Mode == 118">基础定制模块</span>
              <span v-else-if="scope.row.Mode == 205">系统管理</span>
              <span v-else>未知模块</span>
            </template>
          </el-table-column>
          <el-table-column label="执行动作" min-width="150px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.Action == 221">渠道每日数据</span>
              <span v-else-if="scope.row.Action == 192">渠道数据</span>
              <span v-else-if="scope.row.Action == 219">今日渠道收益</span>
              <span v-else-if="scope.row.Action == 218">个人信息</span>
              <span v-else-if="scope.row.Action == 216">查看打包数据</span>
              <span v-else-if="scope.row.Action == 212">发送验证码</span>
              <span v-else-if="scope.row.Action == 211">设置支付密码</span>
              <span v-else>未知类型</span>
            </template>
          </el-table-column>
          <el-table-column label="是否成功" min-width="150px" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.Pass == 1">执行成功</span>
              <span v-else>执行失败</span>
            </template>
          </el-table-column>
          <el-table-column label="操作日期" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.CreateTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="MaxCount>0" :total="MaxCount" :page.sync="param.Page" :limit.sync="param.PageSize" @pagination="fnGetList"/>
      </div>
    </div>
  </div>
  <div v-else>
    <error-page></error-page>
  </div>
</template>

<script>
import { formatDate } from "@/filters/index.js";
import { getList, listEmpty } from "@/api/system/logs";
import Pagination from "@/components/Pagination";
import ErrorPage from "@/components/ErrorPage";
export default {
  name: "logs",
  components: { Pagination },
  data() {
    return {
      searchBtnLoadingBol: false, //搜索按钮等待
      loading: true,
      tableKey: 0,
      // 请求后台列表的参数
      param: {
        Keyword: "",
        PageSize: this.$store.getters.pageSize, //每页多少条
        Page: 1 //哪一页
      },
      MaxCount: 0, //总条数
      list: []
    };
  },
  created() {
    this.fnGetList();
  },
  methods: {
    //获取列表
    fnGetList() {
      this.searchBtnLoadingBol = true;
      getList(this.param).then(response => {
        var res = response.data.Data;
        this.list = res.Items;
        this.MaxCount = res.Pagination.MaxCount;
        //this.param.PageSize = res.Pagination.PageSize;
        this.searchBtnLoadingBol = false;
        this.loading = false;
      });
    },
    //清空
    handleCreate() {
      this.$confirm("确定清空日志吗?", "提示", {
        confirmButtonText: "清空",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // listEmpty(this.param).then(response => {
        //   console.log(response);
        // });
      });
    }
  }
};
</script>

<style scope>
</style>
