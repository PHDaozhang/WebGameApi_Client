<!--员工账号-->
<template>
  <div class="app-container" v-loading="listLoading" v-if="GLOBAL.checkPermission(154) || GLOBAL.checkPermission(157)">

    <search-type-two
      :showAddBtn="GLOBAL.checkPermission(154)"
      :options="selectInputOption"
      @getParams="getQueryParams" 
      @resetParams="resetQyeryParams"
      @addElement="handleCreate"
    />
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
      v-if="GLOBAL.checkPermission(157)"
    >
      <el-table-column 
        :label="$t('adminManage.status')" 
        align="center" 
        prop="Status"
        column-key="Status"
        :filters="[{ text: '启用', value: 1 }, { text: '停用', value: 2 }]">
        <template slot-scope="scope">
          <el-tag :type="scope.row.Status == 1 ?'success':'danger'">{{ scope.row.Status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('adminManage.buildDate')"  align="center" sortable prop="CreateTime">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column 
        :label="$t('adminManage.role')" 
        align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.Role | rolesFilter(systemConfig.Role) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('adminManage.accountNumber')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.Username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('adminManage.accountName')"  align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('adminManage.remark')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Note }}</span>
        </template>
      </el-table-column>
      
      <el-table-column :label="$t('common.actions')" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          
          <el-button
            v-if="scope.row.Status == 1 && GLOBAL.checkPermission(155)"
            size="mini"
            type="warning"
            @click="handleSwitchStatus(scope.row,2)"
          >{{ $t('common.endUse') }}</el-button>
          <el-button
            v-if="scope.row.Status == 2 && GLOBAL.checkPermission(155)"
            size="mini"
            type="success"
            @click="handleSwitchStatus(scope.row,1)"
          >{{ $t('common.startUse') }}</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row.Id)"
            v-if="GLOBAL.checkPermission(155)"
          >{{ $t('common.edit') }}</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row,'deleted')"
            v-if="GLOBAL.checkPermission(590)"
          >{{ $t('common.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 分页 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.PageSize" @pagination="getList" />
      <!-- 弹框 -->
    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?$t('common.add'):$t('common.edit')" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" v-loading="loadingDialog">
        <el-form-item :label="$t('adminManage.accountNumber')"  prop="Username">
          <el-input v-model="temp.Username" :placeholder="$t('adminManage.accountNumber')" :disabled="dialogStatus=='startUse' || dialogStatus=='endUse'" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('adminManage.accountPassword')" prop="Password" v-if="dialogStatus=='create'">
          <el-input v-model="temp.Password" auto-complete="new-password" :type="passwordType" :placeholder="$t('adminManage.accountPassword')" :maxlength="GLOBAL.inputMaxLenght" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('adminManage.accountPassword')" v-if="dialogStatus=='update'">
          <el-input v-model="temp.Password" auto-complete="new-password" :type="passwordType" :placeholder="$t('adminManage.accountPassword')" :maxlength="GLOBAL.inputMaxLenght" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item :label="$t('adminManage.accountName')">
          <el-input v-model="temp.Name" :placeholder="$t('adminManage.accountName')" :disabled="dialogStatus=='startUse' || dialogStatus=='endUse'" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('adminManage.contactWay')">
          <el-input v-model="temp.ContactInf" :placeholder="$t('adminManage.contactWay')" :disabled="dialogStatus=='startUse' || dialogStatus=='endUse'" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('adminManage.remark')">
          <el-input v-model="temp.Note" :placeholder="$t('adminManage.remark')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('adminManage.role')" prop="Role" v-if="dialogStatus=='update' || dialogStatus=='create'">
          <el-select v-model="temp.Role" multiple :placeholder="$t('common.placeholder')" style="width:100%">
            <el-option
              v-for="item in adminInfo.CRole"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('adminManage.createRole')" v-if="dialogStatus=='update' || dialogStatus=='create'">
          <el-select v-model="temp.CreateRole" multiple :placeholder="$t('common.placeholder')" style="width:100%">
            <el-option
              v-for="item in adminInfo.CRole"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="loadingSaveBtn">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
    <back-to-top  />
  </div>
  <div v-else>
    <error-page></error-page>
  </div>
</template>

<script>
import { fetchList, fetchDetail, createElement, updateElement, deleteElement } from '@/api/thirdPart/admin'
import elDragDialog from '@/directive/el-dragDialog'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import local from './local'
import BackToTop from '@/components/BackToTop'
import SearchTypeTwo from "@/components/ListSearch/SearchTypeTwo";//查询条件
import ErrorPage from "@/components/ErrorPage";
export default {
  name: 'AdminManageList',
  components: { Pagination,BackToTop,SearchTypeTwo,ErrorPage },
  directives: { elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '启用',
        2: '停用'
      }
      return statusMap[status]
    },
    rolesFilter(role,roleList) {
      var roleText = "";
      if(role){
        role = role.split(",")
        if(roleList && roleList.length > 0){
          role.forEach(element => {
            for (let i = 0; i < roleList.length; i++) {
              if(element == roleList[i].Id){
                roleText += roleList[i].Name + "，"
              }
            }
          });
        }
      }
      return roleText.slice(0,-1);
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      loadingSaveBtn:false,
      loadingDialog:false,
      listLoading: true,
      passwordType:"password",
      selectInputOption: [
        {
          label: "全部",
          value: "All"
        },
        {
          label:"账户账号",
          value:"Username"
        },
      ],
      // 查询条件
      listQuery: {
        Page: 1,
        PageSize: this.$store.getters.pageSize,
        Sort:"",
        Keyword: "",
        BeginTime:"",
        EndTime:"",
        Status:''
      },
      // 新增/编辑数据字段
      temp: {
        Id: undefined,
        Username: '', // 登录账号
        Password: '', // 密码
        Name: '', // 姓名
        Role:'',//角色
        Note:'',//备注
        ContactInf:'',//联系方式
        CreateRole:'',//可创建角色
      },
      dialogFormVisible: false,
      dialogStatus: '',
      // 弹出框标题
      textMap: {
        update: 'edit',
        create: 'add',
        startUse:'open',
        endUse:'close'
      },
      rules: {
        Username: [
          { required: true, message: this.$t('rules.required'), trigger: 'change' },
          { min: 2, max: 12, message: this.$t('rules.stringLength'), trigger: 'change' }
        ],
        Password: [{ required: true, message: this.$t('rules.required'), trigger: 'change' }],
        Role:[{ required: true, message: this.$t('rules.required'), trigger: 'change' }],
      },
    }
  },
  computed: {
    ...mapGetters([
      'systemConfig',
      'roles',
      'adminInfo'
    ])
  },
  created() {
    this.$i18n.mergeLocaleMessage('tw', local.tw)
    this.$i18n.mergeLocaleMessage('zh', local.zh)
    if(this.GLOBAL.checkPermission(157)){
      this.getList()
    }
  },
  methods: {
    //展示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
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
    // 重置新增字段数据
    resetTemp() {
      this.temp = {
        Id: undefined,
        Username: '', // 登录账号
        Password: '', // 密码
        Name: '', // 姓名
        Role:'',//角色
        Note:'',//备注
        ContactInf:'',//联系方式
        CreateRole:'',//可创建角色
      }
    },
    // 点击新增
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loadingSaveBtn = true
          this.temp.Hash = this.$md5(new Date().getTime().toString());
          createElement(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message.success(this.$t('common.addSuccess'))
            this.loadingSaveBtn = false
            this.listQuery.Page = 1
            this.getList()
          }).catch(err => {
            this.loadingSaveBtn = false
          })
        }
      })
    },
    // 点击编辑
    handleUpdate(id) {
      this.loadingDialog = true;
      this.loadingSaveBtn = true;
      fetchDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.Data)
        this.temp.Password = "";

        this.temp.Role = response.data.Data.Role.split(",")
        this.temp.Role = this.clearNullOfArray(this.temp.Role)
        this.temp.Role = this.stringTranslateNumber(this.temp.Role)

        this.temp.CreateRole = response.data.Data.CreateRole.split(",")
        this.temp.CreateRole = this.clearNullOfArray(this.temp.CreateRole)
        this.temp.CreateRole = this.stringTranslateNumber(this.temp.CreateRole)

        this.loadingDialog = false;
        this.loadingSaveBtn = false;
      }).catch(err => {
        this.loadingDialog = false;
        this.loadingSaveBtn = false;
      })

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.loadingSaveBtn = true
          updateElement(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message.success(this.$t('common.editSuccess'))
            this.loadingSaveBtn = false
            this.getList()
          }).catch(err => {
            this.loadingSaveBtn = false
          })
        }
      })
    },
    // 点击删除
    handleDelete(row) {
      this.$confirm(this.$t('common.confirmDelete'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteElement(row.Id).then(response => {
          this.$message.success(this.$t('common.deleteSuccess'))
          this.getList()
        })
      }).catch(() => {

      })
    },
    //点击切换状态
    handleSwitchStatus(row,status){
      status == 2 ? this.dialogStatus = 'endUse' : this.dialogStatus = 'startUse'
      this.dialogFormVisible = true

      this.temp = Object.assign({}, row)
      this.temp.Password = "";
      this.temp.Status = status;

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //弹框关闭回调事件
    dialogClose(){
      this.loadingSaveBtn = false;
      this.loadingDialog = false;
    },
    //过滤
    filterStatus(value){
      this.listQuery.Status = value[Object.keys(value)[0]].join(',');
      this.listQuery.Page = 1;
      this.getList()
    },
    //获取组件返回的查询参数
    getQueryParams(val){
      this.listQuery.Page = 1;
      this.listQuery.BeginTime = val.BeginTime;
      this.listQuery.EndTime = val.EndTime;

      this.listQuery.Keyword = "";

      if(val.filterKey == 'All'){
        this.listQuery.Keyword = val.filterValue
      }else if(val.filterKey == 'Username'){
        this.listQuery.Keyword = val.filterValue
      }

      this.getList();
    },
    //重置查询参数
    resetQyeryParams(){
      this.listQuery.Page = 1;
      this.listQuery.Sort = "";

      this.listQuery.Keyword = "";

      this.listQuery.Status = "";

      this.listQuery.EndTime = "";
      this.listQuery.BeginTime = "";
      
      this.getList();
    },
    //时间选择
    chooseTime(val){
      this.listQuery.BeginTime = val[0]
      this.listQuery.EndTime = val[1]
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
