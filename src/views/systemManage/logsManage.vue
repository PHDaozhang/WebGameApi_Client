<!--日志管理-->
<template>
  <div class="app-container" v-loading="listLoading">
    <div class="filter-container">
      <el-input v-model="listQuery.Keyword" :placeholder="$t('logsManage.accountName')" clearable style="width: 30%;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.seach') }}</el-button>
    </div>
    <!-- 表格 -->
    <div class="tabs_main">
    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      @sort-change="sortChange"
      @filter-change="filterStatus"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('logsManage.buildDate')" align="center" sortable prop="CreateTime">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('logsManage.accountName')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('logsManage.type')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Role}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('logsManage.operatingContent')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateTime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.PageSize" @pagination="getList" />

    <back-to-top  />
  </div>
</template>

<script>
import { fetchList, fetchDetail, createElement, updateElement, deleteElement } from '@/api/systemManage/logs'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import local from './local'
import BackToTop from '@/components/BackToTop'
export default {
  name: 'LogsManageList',
  components: { Pagination,BackToTop },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '正常',
        2: '封停'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 查询条件
      listQuery: {
        Page: 1,
        PageSize: this.$store.getters.pageSize,
        Sort:"",
        Keyword: "",
        BeginTime:"",
        EndTime:""
      },
    }
  },
  computed: {},
  created() {
    this.$i18n.mergeLocaleMessage('tw', local.tw)
    this.$i18n.mergeLocaleMessage('zh', local.zh)
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.Data.Items
        this.total = response.data.Data.Pagination.MaxCount
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.Page = 1
      this.getList()
    },
    //过滤
    filterStatus(value){
      this.listQuery.FilterKey = Object.keys(value)[0];
      this.listQuery.FilterValue = value[Object.keys(value)[0]].join(',');
      this.listQuery.Page = 1;
      this.getList()
    },
    //排序监听
    sortChange(val){
      if(val.order == 'ascending'){
        this.listQuery.Sort = val.prop
      }else if(val.order == 'descending'){
        this.listQuery.Sort = "-" + val.prop
      }else{
        this.listQuery.Sort = ""
      }
      this.listQuery.Page = 1;
      this.getList()
    },
  }
}
</script>
