<template>
  <div class="app-container ipbanBox" v-if="GLOBAL.checkPermission(68) || GLOBAL.checkPermission(71)">
    <div class="filter-container">
      <el-input
        v-model="param.Keyword"
        :placeholder="$t('ipban.shieldingQueryIP')"
        clearable
        style="width: 30%;"
        class="filter-item"
        @keyup.enter.native="handleSearchBtn"
      />
      <el-button
        :loading="searchBtnLoadingBol"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleSearchBtn"
      >{{$t('ipban.inquire')}}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
        v-if="GLOBAL.checkPermission(68)"
      >{{$t('ipban.add_pb')}}</el-button>
      <div style="min-height: 70vh" v-loading="loading">
        <!--列表-->
        <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" v-if="GLOBAL.checkPermission(71)">
          <el-table-column label="ID" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.Id }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ipban.pb_ip')" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.Ip }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.remark')" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.Description }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ipban.starTime')" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.Start | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ipban.endTime')" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.End | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ipban.operation')" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="listEdit(scope.row.Id)" v-if="GLOBAL.checkPermission(69)">{{$t('common.edit')}}</el-button>
              <el-button size="mini" type="danger" @click="listDelete(scope.row)" v-if="GLOBAL.checkPermission(70)">{{$t('common.del')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="MaxCount>0" :total="MaxCount" :page.sync="param.Page" :limit.sync="param.PageSize" @pagination="fnGetList"/>
      </div>

      <!--新增角色-->
      <el-dialog :title="type?this.$t('ipban.add_pb'):this.$t('ipban.redact_pbip')" :close-on-click-modal="false" :visible.sync="dialogBol" v-el-drag-dialog>
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="margin-left:50px;">
          <el-form-item :label="$t('ipban.pb_ip')" prop="Ip">
            <el-input v-model="temp.Ip"/>
          </el-form-item>
          <el-form-item :label="$t('ipban.starTime')" prop="Start">
            <!-- <el-input v-model="temp.Start"/> -->
            <el-date-picker v-model="temp.Start" type="datetime" value-format="timestamp" :placeholder="$t('ipban.pcehld1')"></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('ipban.endTime')" prop="End">
            <!-- <el-input v-model="temp.End"/> -->
            <el-date-picker v-model="temp.End" type="datetime" value-format="timestamp" :placeholder="$t('ipban.pcehld2')"></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common.remark')">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              :placeholder="$t('ipban.enterRemark')"
              v-model="temp.Description"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBol = false">{{$t('common.cancel')}}</el-button>
          <el-button autofocus type="primary" @click="dialogAdd()">{{$t('common.confirm')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
  <div v-else>
    <error-page></error-page>
  </div>
</template>

<script>
import {
  getList,
  addList,
  getListData,
  listDelete,
  listEdit
} from "@/api/system/ipban";
import local from "./local";
import Pagination from "@/components/Pagination";
import ErrorPage from "@/components/ErrorPage";
export default {
  name: "ipban",
  components: { Pagination,ErrorPage },
  data() {
    return {
      searchBtnLoadingBol: false, //搜索按钮等待
      type: true, //判断是否是添加true-添加,false-编辑
      dialogBol: false, //控制模态框显示隐藏
      tableKey: 0,
      loading: true,
      // 请求后台列表的参数
      param: {
        Keyword: "",
        PageSize: this.$store.getters.pageSize, //每页多少条
        Page: 1 //哪一页
      },
      MaxCount: 0, //总条数
      list: null, //表格数据
      // 新增/编辑数据字段
      temp: {
        Id: "",
        Ip: "",
        Start: "", // 创建时间
        End: "", //结束时间
        Description: "" // 备注
      },
      //  错误提示
      rules: {
        Ip: [{ required: true, message: "请输入要屏蔽的IP", trigger: "blur" }],
        Start: [{ required: true, message: "请设置开始时间", trigger: "blur" }],
        End: [{ required: true, message: "请设置结束时间", trigger: "blur" }]
      }
    };
  },
  created() {
    if (!this.$i18n.getLocaleMessage("en")["admin"]) {
      this.$i18n.mergeLocaleMessage("tw", local.tw);
      this.$i18n.mergeLocaleMessage("zh", local.zh);
    }
    this.fnGetList();
  },
  methods: {
    //获取列表
    fnGetList() {
      this.searchBtnLoadingBol = true;
      getList(this.param).then(response => {
        var res = response.data.Data;
        this.list = res.Items;
        this.param.MaxCount = res.Pagination.MaxCount;
        //this.param.PageSize = res.Pagination.PageSize;
        this.searchBtnLoadingBol = false;
        this.loading = false;
      });
    },
    // 搜索框查询
    handleSearchBtn() {
      this.fnGetList();
    },
    //新增
    handleCreate() {
      this.type = true;
      this.deleteInput();
      this.dialogBol = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    // 模态框确定按钮/新增
    dialogAdd() {
      // alert(this.temp.Start)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.dialogBol = false;
          //   判断是发送添加请求还是修改请求
          if (this.type) {
            this.timestamp();
            addList(this.temp)
              .then(() => {
                this.loading = false;
                this.$message.success("添加成功!");
                this.fnGetList();
              })
              .catch(() => {
                this.fnGetList();
                this.loading = false;
              });
          } else {
            this.timestamp();
            listEdit(this.temp)
              .then(() => {
                this.loading = false;
                this.$message.success("修改成功!");
                this.fnGetList();
              })
              .catch(() => {
                this.fnGetList();
                this.loading = false;
              });
          }
        }
      });
    },

    //点击编辑打开模态框
    listEdit(id) {
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();data
      // });
      this.type = false;
      this.deleteInput();
      this.dialogBol = true;
      getListData(id).then(response => {
        var res = response.data.Data;
        this.temp = res;
        this.temp.Start = this.temp.Start * 1000;
        this.temp.End = this.temp.End * 1000;
      });
    },
    //删除
    listDelete(item) {
      this.$confirm("确定删除此条信息吗?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        listDelete(item.Id)
          .then(response => {
            this.dialogBol = false;
            this.loading = false;
            this.fnGetList();
            this.$message({
              message: "删除成功!",
              type: "success"
            });
          })
          .catch(() => {
            this.fnGetList();
            this.loading = false;
            this.dialogBol = false;
          });
      });
    },
    timestamp() {
      this.temp.Start = this.temp.Start / 1000;
      this.temp.End = this.temp.End / 1000;
    },
    //清空模态框输入框内容
    deleteInput() {
      this.temp.Id = "";
      this.temp.Ip = "";
      this.temp.Start = ""; // 起始时间
      this.temp.End = ""; // 结束时间
      this.temp.Description = ""; // 备注
    }
  }
};
</script>

<style scope>
</style>
<style>
</style>

