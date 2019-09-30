<template>
  <div class="app-container" v-loading="listLoading">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button
          class="filter-item"
          style="margin-left: 10px;margin-bottom:20px"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate(-1)"
          v-if="GLOBAL.checkPermission(8)"
        >{{ $t('node.addRoot') }}</el-button>
      </el-col>
      <el-col :span="8">
        <el-tree :data="nodeList" node-key="Id" :default-expand-all="true" v-if="GLOBAL.checkPermission(11)">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-circle-plus-outline"
                @click="() => handleCreate(data.Id)"
                v-if="data.TempLevel == 1 && GLOBAL.checkPermission(8)"
              ></el-button>
              <el-button type="text" size="mini" icon="el-icon-edit" @click="() => handleUpdate(data)" v-if="GLOBAL.checkPermission(9)"></el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="() => handleDelete(node, data)" v-if="GLOBAL.checkPermission(10)"></el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
    </el-row>

    <!--新增/编辑节点-->
    <el-dialog
      v-el-drag-dialog
      :title="titleTxt"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      @close="loadingSaveBtn = false"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-form-item :label="$t('node.name')" prop="Name">
          <el-input v-model="temp.Name" :placeholder="$t('node.name')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
        <el-form-item :label="$t('node.url')" prop="Url">
          <el-input v-model="temp.Url" :placeholder="$t('node.url')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
        <el-form-item :label="$t('node.icon')" prop="Icon">
          <el-input v-model="temp.Icon" :placeholder="$t('node.icon')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
        <el-form-item :label="$t('node.cn')" prop="LangCn">
          <el-input v-model="temp.LangCn" :placeholder="$t('node.cn')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
        <el-form-item :label="$t('node.tw')">
          <el-input v-model="temp.LangTw" :placeholder="$t('node.tw')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
        <el-form-item :label="$t('node.sort')" prop="Sort">
          <el-input-number v-model="temp.Sort" :step="1" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('node.description')" prop="Description">
          <el-input v-model="temp.Description" :placeholder="$t('node.description')" :maxlength="GLOBAL.inputMaxLenght"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create' || dialogStatus==='createRoot'?createData():updateData()"
          :loading="loadingSaveBtn"
        >{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchNodeList,
  createNode,
  fetchNodeDetail,
  updateNode,
  deleteNode
} from "@/api/system/node";
import elDragDialog from "@/directive/el-dragDialog";
import local from "./local";
import store from "@/store";
export default {
  name: "nodeTree",
  directives: { elDragDialog },
  data() {
    return {
      nodeList: [],
      // 新增/编辑数据字段
      temp: {
        Id: undefined,
        ParentId: "",
        Name: "", // 节点名称
        Url: "", // 链接地址
        Icon: "", //Icon图标
        Sort: "", // 排序编号
        LangCn: "", //简体中文
        LangTw: "", //繁体中文
        Description: "" // 备注说明
      },
      dialogFormVisible: false,
      loadingSaveBtn: false,
      dialogStatus: "create",
      // 弹出框标题
      textMap: {
        update: "edit",
        create: "add",
        createRoot: "addRoot",
        updateRoot: "editRoot"
      },
      rules: {
        Name: [
          {
            required: true,
            message: this.$t("rules.required"),
            trigger: "change"
          }
        ],
        LangCn: [
          {
            required: true,
            message: this.$t("rules.required"),
            trigger: "change"
          }
        ]
      },
      titleTxt: ""
    };
  },
  created() {
    if (!this.$i18n.getLocaleMessage("zh")["node"]) {
      this.$i18n.mergeLocaleMessage("tw", local.tw);
      this.$i18n.mergeLocaleMessage("zh", local.zh);
    }
    this.getList();
    console.log(this.textMap[this.dialogStatus]);

    this.titleTxt = this.$t("node." + this.textMap[this.dialogStatus]);
  },
  methods: {
    // 重置新增字段数据
    resetTemp() {
      this.temp = {
        Id: undefined,
        ParentId: "",
        Name: "", // 节点名称
        Url: "", // 链接地址
        Icon: "", //Icon图标
        Sort: "", // 排序编号
        LangCn: "", //简体中文
        LangTw: "", //繁体中文
        Description: "" // 备注说明
      };
    },
    //获取节点列表
    getList() {
      this.listLoading = true;
      fetchNodeList()
        .then(response => {
          this.nodeList = this.formatDatalistTree({}, response.data.Data, 1);
          this.nodeList = this.nodeList.children;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    //点击新增
    handleCreate(parentId) {
      this.resetTemp();
      this.temp.ParentId = parentId;
      this.dialogStatus = parentId == -1 ? "createRoot" : "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loadingSaveBtn = true;
          createNode(this.temp)
            .then(() => {
              this.dialogFormVisible = false;
              this.$message.success(this.$t("common.addSuccess"));
              this.loadingSaveBtn = false;
              this.getList();
              store.dispatch("fnGetConfig").then(res => {});
            })
            .catch(err => {
              this.loadingSaveBtn = false;
            });
        }
      });
    },
    //点击编辑
    handleUpdate(data) {
      fetchNodeDetail(data.Id).then(response => {
        this.temp = Object.assign({}, response.data.Data);
      });
      this.dialogStatus = data.ParentId == -1 ? "updateRoot" : "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loadingSaveBtn = true;
          const tempData = Object.assign({}, this.temp);
          updateNode(tempData)
            .then(() => {
              this.dialogFormVisible = false;
              this.$message.success(this.$t("common.editSuccess"));
              this.loadingSaveBtn = false;
              this.getList();
              store.dispatch("fnGetConfig").then(res => {});
            })
            .catch(err => {
              this.loadingSaveBtn = false;
            });
        }
      });
    },
    //点击删除
    handleDelete(node, data) {
      this.$confirm(this.$t("common.confirmDelete"), this.$t("common.hint"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          deleteNode(data.Id).then(response => {
            this.$message.success(this.$t("common.deleteSuccess"));
            this.getList();
            store.dispatch("fnGetConfig").then(res => {});
          });
        })
        .catch(() => {});
    }
  },
  watch: {
    dialogStatus() {
      this.titleTxt = this.$t("node." + this.textMap[this.dialogStatus]);
    }
  }
};
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
