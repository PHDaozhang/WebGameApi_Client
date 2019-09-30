<template>
  <div class="app-container" v-loading="listLoading" v-if="GLOBAL.checkPermission(128) || GLOBAL.checkPermission(131)">
    <search-type-two
      :showAddBtn="GLOBAL.checkPermission(128)"
      :showDateTime="false"
      :options="selectInputOption"
      @getParams="getQueryParams"
      @resetParams="resetQyeryParams"
      @addElement="handleCreate"
    />
    <!--角色列表-->
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" v-if="GLOBAL.checkPermission(131)">
      <el-table-column label="ID" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('role.name')" width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('role.description')" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.Type == 1&&AdminId!=-1?true:false"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row.Id)"
            v-if="GLOBAL.checkPermission(129)"
          >{{ $t('common.edit') }}</el-button>
          <el-button
            :disabled="scope.row.Type == 1&&AdminId!=-1?true:false"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row,'deleted')"
            v-if="GLOBAL.checkPermission(130)"
          >{{ $t('common.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.PageSize" @pagination="getList"/>

    <!--新增角色-->
    <el-dialog
      :title="dialogStatus=='create'?$t('role.add'):$t('role.edit')"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      height="900"
      v-el-drag-dialog
      @close="loadingSaveBtn = false"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" v-loading="dialogLoad">
        <el-form-item :label="$t('role.name')" prop="Name">
          <el-input v-model="temp.Name" :placeholder="$t('role.name')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
        <el-form-item :label="$t('role.description')" prop="Description">
          <el-input v-model="temp.Description" :placeholder="$t('role.description')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="24" style="height:400px;overflow-y:scroll">
            <el-form-item :label="$t('role.node')">
              <el-tree
                ref="nodeTree"
                :data="nodeList"
                show-checkbox
                node-key="PubliceId"
                :default-expand-all="false"
                class="permission-tree"
                :check-strictly="checkType"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
          :loading="loadingSaveBtn"
        >{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
  <div v-else>
    <error-page></error-page>
  </div>
</template>

<script>
import {
  fetchList,
  fetchDetail,
  createRole,
  updateRole,
  deleteRole,
  fetchNodeList,
  updateNode,
  fetchPermissionList,
  updatePermission
} from "@/api/system/role";
import waves from "@/directive/waves";
import elDragDialog from "@/directive/el-dragDialog";
import Pagination from "@/components/Pagination";
import SearchTypeTwo from "@/components/ListSearch/SearchTypeTwo"; //查询条件
import { mapGetters } from "vuex";
import local from "./local";
import store from "@/store";
import ErrorPage from "@/components/ErrorPage";
export default {
  name: "roleList",
  components: { Pagination, SearchTypeTwo, ErrorPage },
  directives: { waves, elDragDialog },
  data() {
    return {
      checkType: false,
      // AdminId: this.$store.getters.accountInfo.AdminId,
      AdminId: -1,
      MyRoles: [],
      MyNodes: [],
      tableKey: 0,
      list: null, //角色列表
      nodeList: null, //节点列表
      permissionList: null, //权限列表
      total: 0,
      checkStrictlyMode: false,
      checkStrictlyNode: false,
      listLoading: true,
      loadingSaveBtn: false,
      dialogLoad: true,
      selectInputOption: [
        {
          label: "全部",
          value: "All"
        },
        {
          label: "角色名称",
          value: "Name"
        }
      ],
      // 查询条件
      listQuery: {
        Page: 1,
        PageSize: this.$store.getters.pageSize,
        Keyword: ""
      },
      // 新增/编辑数据字段
      temp: {
        Id: undefined,
        Name: "", // 角色名称
        Description: "" // 备注
      },
      dialogFormVisible: false,
      nodeFormVisible: false,
      perFormVisible: false,
      dialogStatus: "",
      // 弹出框标题
      textMap: {
        update: "edit",
        create: "add"
      },
      rules: {
        Name: [
          {
            required: true,
            message: this.$t("rules.required"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["systemConfig"])
  },
  created() {
    let rolesArr = this.$store.getters.roles;
    // console.log(rolesArr);
    let MyRoles = [];
    let MyNodes = [];
    for (let i = 0; i < rolesArr.length; i++) {
      let NodesStr = rolesArr[i].Node;
      let NodesArr = NodesStr.split(","); //将拿到的节点字符串转为数组
      MyNodes = MyNodes.concat(NodesArr);
      for (let index = 0; index < MyNodes.length; index++) {
        MyNodes[index] = MyNodes[index] - 0; // 将字符串转数字
      }
      let RoleStr = rolesArr[i].Permission;
      let RolesArr = RoleStr.split(","); //将拿到的权限字符串转为数组
      MyRoles = MyRoles.concat(RolesArr);
      for (let index = 0; index < MyRoles.length; index++) {
        MyRoles[index] = MyRoles[index] - 0; // 将字符串转数字
      }
    }
    this.MyRoles = this.fnUniq(MyRoles);
    this.MyNodes = this.fnUniq(MyNodes);
    // console.log(this.MyRoles);
    // console.log(this.MyNodes);

    // console.log(this.MyRoles);
    if (!this.$i18n.getLocaleMessage("en")["role"]) {
      this.$i18n.mergeLocaleMessage("tw", local.tw);
      this.$i18n.mergeLocaleMessage("zh", local.zh);
    }
    this.getList();
    // this.getNodeList();
    this.fnGetConfig();
  },
  methods: {
    // 获取角色表格列表
    getList() {
      console.log("权限",this.AdminId);
      
      this.listLoading = true;
      fetchList(this.listQuery)
        .then(response => {
          this.list = response.data.Data.Items;
          this.total = response.data.Data.Pagination.MaxCount;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    //获取节点列表
    // getNodeList() {
    //   fetchNodeList()
    //     .then(response => {
    //       var dataArr = response.data.Data;
    //       for (let index = 0; index < dataArr.length; index++) {
    //         dataArr[index].PubliceId = "N" + dataArr[index].Id;
    //         // 将拿到的节点和自己有的节点对比,没有的加上disabled
    //         // console.log(this.MyNodes.indexOf(dataArr[index].Id));
    //         if (this.AdminId != -1) {
    //           if (this.MyNodes.indexOf(dataArr[index].Id) == -1) {
    //             dataArr[index].disabled = true;
    //           } else {
    //             dataArr[index].disabled = false;
    //           }
    //         }
    //       }
    //       this.nodeList = dataArr;
    //       this.getPermissionList();
    //     })
    //     .catch(() => {});
    // },
    // //获取权限列表
    // getPermissionList(id) {
    //   fetchPermissionList(id)
    //     .then(response => {
    //       var dataArr = response.data.Data;
    //       for (let index = 0; index < dataArr.length; index++) {
    //         dataArr[index].PubliceId = "M" + dataArr[index].Id;
    //         // 将拿到的权限和自己有的权限对比,没有的加上disabled
    //         // console.log(this.MyRoles.indexOf(dataArr[index].Id));
    //         if (this.AdminId != -1) {
    //           if (this.MyRoles.indexOf(dataArr[index].Id) == -1) {
    //             dataArr[index].disabled = true;
    //           } else {
    //             dataArr[index].disabled = false;
    //           }
    //         }
    //       }
    //       this.permissionList = this.formatDatalistTreeOfPer(
    //         {},
    //         response.data.Data,
    //         1
    //       );
    //       var array = this.permissionList.children;
    //       // console.log("权限列表", array);
    //       this.permissionList = array;
    //       this.fnFormtData();
    //     })
    //     .catch(() => {});
    // },
    // 从配置文件拿到节点和权限
    fnGetConfig() {
      var systemConfig = this.$store.getters.systemConfig;
      // console.log(systemConfig);
      // 节点
      var NodeArr = systemConfig.Node;
      console.log("节点",systemConfig);
      for (let index = 0; index < NodeArr.length; index++) {
        NodeArr[index].PubliceId = "N" + NodeArr[index].Id;
        // 将拿到的节点和自己有的节点对比,没有的加上disabled
        // console.log(this.MyNodes.indexOf(NodeArr[index].Id));
        if (this.AdminId != -1) {
          if (this.MyNodes.indexOf(NodeArr[index].Id) == -1) {
            NodeArr[index].disabled = true;
          } else {
            NodeArr[index].disabled = false;
          }
        }
      }
      this.nodeList = NodeArr;
      // 权限
      var ModeArr = systemConfig.Mode;
      for (let index = 0; index < ModeArr.length; index++) {
        ModeArr[index].PubliceId = "M" + ModeArr[index].Id;
        // 将拿到的权限和自己有的权限对比,没有的加上disabled
        // console.log(this.MyRoles.indexOf(ModeArr[index].Id));
        if (this.AdminId != -1) {
          if (this.MyRoles.indexOf(ModeArr[index].Id) == -1) {
            ModeArr[index].disabled = true;
          } else {
            ModeArr[index].disabled = false;
          }
        }
      }
      this.permissionList = this.formatDatalistTreeOfPer({}, ModeArr, 1);
      var array = this.permissionList.children;
      // console.log("权限列表", array);
      this.permissionList = array;
      this.fnFormtData();
    },
    // 格式化数据结构
    fnFormtData() {
      var nodeListArr = this.nodeList;
      var permissionListArr = this.permissionList;
      var idArr = [];
      var nodeObj = {};
      for (let i = 0; i < nodeListArr.length; i++) {
        nodeListArr[i].label = nodeListArr[i].LangCn;
        idArr.push(nodeListArr[i].Id);
        nodeListArr[i].children = [];
        if (nodeListArr[i].ParentId == -1) {
          nodeObj[nodeListArr[i].Id] = nodeListArr[i];
        }
      }
      for (let i = 0; i < permissionListArr.length; i++) {
        var index = idArr.indexOf(permissionListArr[i].NodeId);
        if (index != -1) {
          nodeListArr[index].children.push(permissionListArr[i]);
          // console.log("下标", index);
          // console.log("根据下表找到的", nodeListArr[index]);
        }
      }

      for (let i = 0; i < nodeListArr.length; i++) {
        if (nodeListArr[i].ParentId != -1) {
          nodeObj[nodeListArr[i].ParentId].children.push(nodeListArr[i]);
        }
      }
      this.nodeList = [];
      for (const key in nodeObj) {
        this.nodeList.push(nodeObj[key]);
      }
      // console.log("节点列表", this.nodeList);
      this.dialogLoad = false;
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.Page = 1;
      this.getList();
    },
    // 重置新增字段数据
    resetTemp() {
      this.temp = {
        Id: undefined,
        Name: "", // 角色名称
        Description: "" // 备注
      };
    },
    // 点击新增
    handleCreate() {
      this.checkType = false;
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.nodeTree.setCheckedKeys([]);
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loadingSaveBtn = true;
          var tempArr = this.$refs.nodeTree.getCheckedKeys();
          var tempArrHalf = this.$refs.nodeTree.getHalfCheckedKeys(); //获取全部半选
          tempArr = tempArr.concat(tempArrHalf); //合并数组
          // console.log("tempArr", tempArr);
          this.temp.Node = [];
          this.temp.Permission = [];

          

 


          // console.log("新增的数组", tempArr);
          for (let index = 0; index < tempArr.length; index++) {
            if (tempArr[index].substring(0, 1) == "M") {
              this.temp.Permission.push(tempArr[index].slice(1));
            } else {
              this.temp.Node.push(tempArr[index].slice(1));
            }
          }
          createRole(this.temp)
            .then(() => {
              this.dialogFormVisible = false;
              this.$message.success(this.$t("common.addSuccess"));
              this.getList();
              this.loadingSaveBtn = false;
              // 更新全局配置
              store.dispatch("fnGetConfig").then(res => {});
            })
            .catch(() => {
              this.loadingSaveBtn = false;
            });
        }
      });
    },
    // 点击编辑
    handleUpdate(id) {
      this.checkType = true;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.checkStrictlyMode = true;
      this.checkStrictlyNode = true;
      this.$nextTick(() => {
        this.$refs.nodeTree.setCheckedKeys([]);
        fetchDetail(id).then(response => {
          this.checkStrictlyMode = false;
          this.checkStrictlyNode = false;
          this.temp = Object.assign({}, response.data.Data);
          var modeArr = [];
          if (response.data.Data.Permission) {
            modeArr = response.data.Data.Permission.split(",");
            for (let i = 0; i < modeArr.length; i++) {
              modeArr[i] = "M" + modeArr[i];
            }
          }
          var nodeArr = [];
          if (response.data.Data.Node) {
            nodeArr = response.data.Data.Node.split(",");
            for (let i = 0; i < nodeArr.length; i++) {
              nodeArr[i] = "N" + nodeArr[i];
            }
            // console.log("nodeArr", nodeArr);
            // console.log("modeArr", modeArr);
          }
          var selectNode = [];
          var selectNode = nodeArr.concat(modeArr);
          // console.log("concat", selectNode);
          selectNode = this.clearNullOfArray(selectNode);
          this.$refs.nodeTree.setCheckedKeys(selectNode);
        });
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loadingSaveBtn = true;
          const tempData = Object.assign({}, this.temp);
          var tempArr = this.$refs.nodeTree.getCheckedKeys(); // 获取全部的全选
          var tempArrHalf = this.$refs.nodeTree.getHalfCheckedKeys(); //获取全部半选
          tempArr = tempArr.concat(tempArrHalf); //合并数组
          // console.log("tempArr", tempArr);
          tempData.Node = [];
          tempData.Permission = [];
          for (let index = 0; index < tempArr.length; index++) {
            if (tempArr[index].substring(0, 1) == "M") {
              tempData.Permission.push(tempArr[index].slice(1));
            } else {
              tempData.Node.push(tempArr[index].slice(1));
            }
          }
          updateRole(tempData)
            .then(() => {
              this.dialogFormVisible = false;
              this.$message.success(this.$t("common.editSuccess"));
              this.loadingSaveBtn = false;
              this.getList();
              // 更新全局配置
              store.dispatch("fnGetConfig").then(res => {});
            })
            .catch(() => {
              this.loadingSaveBtn = false;
            });
        }
      });
    },
    // 点击删除
    handleDelete(row) {
      this.$confirm(this.$t("common.confirmDelete"), this.$t("common.hint"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          deleteRole(row.Id).then(response => {
            this.$message.success(this.$t("common.deleteSuccess"));
            this.getList();
            // 更新全局配置
            store.dispatch("fnGetConfig").then(res => {});
          });
        })
        .catch(() => {});
    },
    //获取组件返回的查询参数
    getQueryParams(val) {
      this.listQuery.Page = 1;
      this.listQuery.BeginTime = val.BeginTime;
      this.listQuery.EndTime = val.EndTime;

      this.listQuery.Keyword = "";

      if (val.filterKey == "All") {
        this.listQuery.Keyword = val.filterValue;
      } else if (val.filterKey == "Name") {
        this.listQuery.Keyword = val.filterValue;
      }

      this.getList();
    },
    //重置查询参数
    resetQyeryParams() {
      this.listQuery.Page = 1;
      this.listQuery.Sort = "";

      this.listQuery.Keyword = "";

      this.listQuery.EndTime = "";
      this.listQuery.BeginTime = "";

      this.getList();
    },
    //数组去重
    fnUniq(array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    }
  }
};
</script>
<style>
.scrollNo::-webkit-scrollbar,
.box-card::-webkit-scrollbar {
  display: none;
}

.el-card__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>


