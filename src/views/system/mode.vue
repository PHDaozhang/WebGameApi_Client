<template>
  <div class="modeBox app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.Keyword"
        :placeholder="$t('mode.placeholderSeach')"
        clearable
        style="width: 30%;"
        class="filter-item"
        @keyup.enter.native="fnGetListPublice"
      />
      <el-button
        :loading="searchBtnLoadingBol"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="fnGetListPublice"
      >{{ $t('common.seach') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreateMode()"
        v-if="GLOBAL.checkPermission(130)"
      >{{ $t('common.add') }}</el-button>
    </div>
    <el-row :gutter="20" v-loading="loading" v-if="GLOBAL.checkPermission(130)">
      <div v-for="(item , index) in list" :key="index">
        <el-col :span="6" v-if="item.ParentId == '-1'">
          <el-card shadow="hover">
            <div class="conet_box">
              <header :class="item.Type == '1'?'':'green'">
                <span class="li_content_box">{{item.Name}}({{item.Key}})</span>
                <span class="title_icon_box">
                  <i class="el-icon-plus" @click="fnAddChildren(item)"></i>
                  <i class="el-icon-edit-outline" @click="fnEditParent(item.Id)"></i>
                  <i class="el-icon-close" @click="fnDeleteParent(item)"></i>
                </span>
              </header>
              <ul>
                <div v-for="(son, index) in list" :key="index">
                  <li v-if="son.ParentId == item.Id">
                    <i v-if="son.Logs == '1'" class="el-icon-document"></i>
                    <i v-else class="el-icon-remove-outline"></i>
                    <span class="li_content_box">{{son.Name}} ({{son.Key}})</span>
                    <span class="li_icon_box">
                      <i class="el-icon-edit-outline" @click="fnEditChildren(son.Id)"></i>
                      <i class="el-icon-close" @click="fnDeleteChildren(son)"></i>
                    </span>
                  </li>
                </div>
              </ul>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <!-- 弹出框 -->
    <el-dialog
      :title="state == 'fatherAdd'|| state == 'sonAdd'?'添加模块':'编辑模块'"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      v-el-drag-dialog
    >
      <el-form ref="dataForm" :rules="rules" :model="popupParam" label-position="right" label-width="100px" v-loading="dialogLoading">
        <!-- 类型 -->
        <el-form-item :label="$t('mode.modeName')" v-if="state == 'fatherAdd' || state == 'fatherEdit'">
          <el-radio-group v-model="popupParam.Type" size="medium">
            <el-radio :label="1">{{$t('mode.projectMode')}}</el-radio>
            <el-radio :label="2">{{$t('mode.systemMode')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 名称 -->
        <el-form-item :label="$t('mode.modeName')" prop="Name">
          <el-input v-model="popupParam.Name"/>
        </el-form-item>
        <!--节点-->
        <el-form-item :label="$t('mode.nodeName')" prop="NodeId">
          <el-select v-model="popupParam.NodeId" filterable placeholder="请选择节点" style="width:100%">
            <el-option-group v-for="group in nodeList" :key="group.Id" :label="group.LangCn">
              <el-option v-for="item in group.children" :key="item.Id" :label="item.LangCn" :value="item.Id"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <!-- 别名 -->
        <el-form-item :label="$t('mode.modeAlias')" prop="Key">
          <el-input v-model="popupParam.Key"/>
        </el-form-item>
        <!-- 排序 -->
        <el-form-item :label="$t('mode.modeSort')" prop="sort">
          <el-input-number style="width: 50%" v-model="popupParam.Sort" :min="0" :max="1000"></el-input-number>
        </el-form-item>
        <!-- 是否追踪 -->
        <el-form-item v-if="state == 'sonAdd' || state == 'sonEdit'" :label="$t('mode.logTrace')">
          <el-radio-group v-model="popupParam.Logs" size="medium">
            <el-radio :label="1">{{$t('mode.Trace')}}</el-radio>
            <el-radio :label="2">{{$t('mode.noTrace')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item :label="$t('mode.modeRemark')">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            :placeholder="$t('mode.enterContent')"
            v-model="popupParam.Description"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button autofocus type="primary" @click="fnAffirm()">{{$t('common.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fnGetList,
  fnModeAdd,
  fnDeleteMode,
  fnEditData,
  fnEditMode,
  fetchNodeList
} from "@/api/system/mode";
import local from "./local";
export default {
  name: "mode",
  data() {
    return {
      searchBtnLoadingBol: false, //搜索按钮等待
      loading: true, //列表loading状态
      dialogLoading: false, // 模态框loading状态
      state: "", //fatherAdd , fatherEdit  ,  sonAdd  , sonEdit
      list: [],
      nodeList: null, //节点列表
      // 查询条件
      listQuery: {
        Keyword: "",
        Page: 1,
        PageSize: this.$store.getters.pageSize
      },
      // 新增子模块字段
      popupParam: {
        //新增模块
        Func: "0",
        //修改模块
        Id: "", // id
        Type: "", //修改时判断 1是项目模块的父级2是系统模块的父级3是子级
        Md5: "",
        // 公共参数
        ParentId: "", // 父节点
        Name: "", // 模块名称
        Key: "", // 模块别名
        Md5: "", // md5
        Logs: "", // 子列表是否追踪1追踪2不追踪
        Sort: 100, //
        Description: "" //描述
      },
      dialogFormVisible: false,
      rules: {
        Name: [
          {
            required: true,
            message: this.$t("mode.plaseEnterModeName"),
            trigger: "change"
          }
        ],
        Key: [
          {
            required: true,
            message: this.$t("mode.plaseEnterModeAliasName"),
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.$i18n.mergeLocaleMessage("tw", local.tw);
    this.$i18n.mergeLocaleMessage("zh", local.zh);
    this.getNodeList();
    this.fnGetListPublice();
  },
  methods: {
    //获取列表方法
    fnGetListPublice() {
      this.searchBtnLoadingBol = true;
      fnGetList(this.listQuery).then(response => {
        this.list = response.data.Data;
        this.loading = false;
        this.searchBtnLoadingBol = false;
      });
    },
    getNodeList() {
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
    // 父级新增方法
    handleCreateMode() {
      this.state = "fatherAdd";
      // fnResetParam方法参数为-1代表添加的是父节点
      this.fnResetParam("-1");
      this.dialogFormVisible = true;
      //关闭输入框错误提示
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //模态框保存按钮
    fnAffirm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.loading = true;
          if (this.state == "fatherAdd" || this.state == "sonAdd") {
            fnModeAdd(this.popupParam).then(response => {
              this.$message({
                message: this.$t("mode.addSucceed"),
                type: "success"
              });
              this.loading = false;
              this.fnGetListPublice();
            });
          } else {
            fnEditMode(this.popupParam).then(response => {
              this.$message({
                message: "修改成功!",
                type: "success"
              });
              this.loading = false;
              this.fnGetListPublice();
            });
          }
        }
      });
    },
    //  父级删除方法
    fnDeleteParent(item) {
      this.fnAlertDelete(item.Id);
    },
    //父级编辑方法
    fnEditParent(id) {
      this.state = "fatherEdit";
      this.Editfunc(id);
    },
    //子代新增
    fnAddChildren(item) {
      this.state = "sonAdd";
      //关闭输入框错误提示
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.fnResetParam(item.Id);
      this.dialogFormVisible = true;
    },
    //子代编辑
    fnEditChildren(id) {
      this.state = "sonEdit";
      this.Editfunc(id);
    },
    //子代删除
    fnDeleteChildren(son) {
      this.fnAlertDelete(son.Id);
    },
    // 重置project
    fnResetParam(ParentId) {
      this.popupParam.Id = "";
      this.popupParam.ParentId = ParentId;
      this.popupParam.Func = 1;
      this.popupParam.Name = "";
      this.popupParam.Key = "";
      this.popupParam.Md5 = "";
      this.popupParam.Type = 1;
      this.popupParam.Logs = 1;
      this.popupParam.Sort = 100;
      this.popupParam.Description = "";
    },
    // 封装编辑函数
    Editfunc(id) {
      this.dialogLoading = true;
      this.dialogFormVisible = true;
      fnEditData(id).then(response => {
        this.dialogLoading = false;
        var res = response.data.Data;
        this.popupParam = res;
      });
    },
    //封装删除询问弹框
    fnAlertDelete(item) {
      this.$confirm(this.$t("mode.deleteAffirm"), this.$t("mode.hint"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          fnDeleteMode(item)
            .then(response => {
              // this.loading = false;
              this.fnGetListPublice();
              this.$message({
                message: this.$t("mode.deleteSucceed"),
                type: "success"
              });
            })
            .catch(() => {
              _this.fnGetListPublice();
              // _this.loading = false;
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.modeBox .el-col {
  margin-top: 10px;
  margin-bottom: 10px;
}
.modeBox ul {
  height: 200px;
}
.li_content_box {
  display: inline-block;
  width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.title_icon_box {
  float: right;
}
.title_icon_box i {
  padding: 2px;
  font-weight: 800;
}
.li_icon_box {
  float: right;
}
.li_icon_box i {
  padding: 0 7px;
  font-weight: 800;
}
.modeBox .filter-container {
  /* margin: 20px 0 0; */
}
.green {
  background: #42b983 !important;
  color: #fff !important;
}
</style>
<style>
.modeBox .el-card__body {
  padding: 0 !important;
}
.modeBox .el-card__body header {
  padding: 14px 10px;
  background: #f6f6f6;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.modeBox ul {
  padding: 6px 15px 15px;
  margin: 0;
  overflow-y: auto;
}
.modeBox ul::-webkit-scrollbar {
  display: none;
}
/*作为IT界最前端的技术达人，页面上的每一个元素的样式我们都必须较真，就是滚动条我们也不会忽略。*/
/*定义滚动条轨道*/
/* .modeBox ul::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
} */
/*定义滚动条高宽及背景*/
/* .modeBox ul::-webkit-scrollbar {
  width: 8px;
  background-color: rgba(0, 0, 0, 0.34);
} */
/*定义滚动条*/
/* .modeBox ul::-webkit-scrollbar-thumb {
  background-color: #8b8b8b;
  border-radius: 10px;
} */
.modeBox .filter-container {
  padding: 0;
}
.modeBox ul li {
  list-style-type: none;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  color: #565656;
  font-size: 13px;
}
.modeBox .el-row {
  min-height: 90vh;
  max-height: 100vh;
}
</style>


