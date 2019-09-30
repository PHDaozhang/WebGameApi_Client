<template>
  <div class="app-container" v-loading="listLoading" v-if="GLOBAL.checkPermission(104) || GLOBAL.checkPermission(107)">

    <search-type-two
      :showAddBtn="GLOBAL.checkPermission(104)"
      :showDateTime="false"
      :options="selectInputOption"
      @getParams="getQueryParams" 
      @resetParams="resetQyeryParams"
      @addElement="handleCreate"
    />

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      v-if="GLOBAL.checkPermission(107)"
    >
      <el-table-column :label="$t('admin.id')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.username')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.name')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('admin.parentId')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ParentId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.parentTree')"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ParentTree }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('admin.status')" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.Status == 1 ?'success':'info'">{{ scope.row.Status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.mobile')" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.Mobile }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('admin.returnRate')" class-name="status-col" >
        <template slot-scope="scope">
          <span>{{ scope.row.ReturnRate }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('admin.loginTime')" class-name="status-col" >
        <template slot-scope="scope">
          <span>{{ scope.row.LoginTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.loginIp')" class-name="status-col" >
        <template slot-scope="scope">
          <span>{{ scope.row.LoginIp }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.createTime')" class-name="status-col" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" align="center" width="180" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.Id)" v-if="GLOBAL.checkPermission(105)">{{ $t('common.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" v-if="GLOBAL.checkPermission(106)">
            {{ $t('common.del') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.PageSize" @pagination="getList" />

    <el-dialog v-el-drag-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?$t('admin.add'):$t('admin.edit')" :visible.sync="dialogFormVisible" @close="loadingSaveBtn = false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" >
        <el-form-item :label="$t('admin.username')" prop="Username">
          <el-input v-model="temp.Username" :disabled="dialogStatus==='update'" :placeholder="$t('admin.username')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('admin.password')" prop="Password" v-if="dialogStatus==='create'">
          <el-input v-model="temp.Password" auto-complete="new-password" type="password" :placeholder="$t('admin.password')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('admin.confimPass')" prop="ConfirmPassword" v-if="dialogStatus==='create'">
          <el-input v-model="temp.ConfirmPassword" auto-complete="new-password" type="password" :placeholder="$t('admin.confimPass')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>

        <el-form-item :label="$t('admin.password')" v-if="dialogStatus==='update'">
          <el-input v-model="temp.Password" auto-complete="new-password" type="password" :placeholder="$t('admin.password')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('admin.confimPass')" v-if="dialogStatus==='update'">
          <el-input v-model="temp.ConfirmPassword" auto-complete="new-password" type="password" :placeholder="$t('admin.confimPass')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('admin.name')">
          <el-input v-model="temp.Name" :placeholder="$t('admin.name')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('admin.mobile')">
          <el-input v-model="temp.Mobile" :placeholder="$t('admin.mobile')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item>
        <el-form-item :label="$t('admin.role')">
          <el-select v-model="temp.Role" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in systemConfig.Role"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('admin.returnRate')">
          <el-input v-model="temp.ReturnRate" :placeholder="$t('admin.returnRate')" :maxlength="GLOBAL.inputMaxLenght" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="loadingSaveBtn">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
    <back-to-top />
  </div>
</template>

<script>
import { fetchList, fetchDetail, createUser, updateUser, deleteUser } from '@/api/system/admin';
import waves from '@/directive/waves';
import elDragDialog from '@/directive/el-dragDialog';
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';
import local from './local';
import BackToTop from '@/components/BackToTop';
import SearchTypeTwo from "@/components/ListSearch/SearchTypeTwo";//查询条件
export default {
  name: 'AdminList',
  components: { Pagination,BackToTop,SearchTypeTwo },
  directives: { waves,elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '无效',
        1: '有效'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      loadingSaveBtn:false,
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
        Keyword: ''
      },
      // 新增/编辑数据字段
      temp: {
        Id: undefined,
        Username: '', // 登录账号
        Password: '', // 密码
        ConfirmPassword: '', // 确认密码
        Name: '', // 姓名
        Role: [], // 角色
        Mobile: ''// 手机号
      },
      dialogFormVisible: false,
      dialogStatus: '',
      // 弹出框标题
      textMap: {
        update: 'edit',
        create: 'add'
      },
      rules: {
        Username: [
          { required: true, message: this.$t('rules.required'), trigger: 'change' },
          { min: 2, max: 20, message: this.$t("rules.stringLength"), trigger: 'blur' }
        ],
        Password: [{ required: true, message: this.$t('rules.required'), trigger: 'change' }],
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'systemConfig',
      'roles'
    ])
  },
  created() {
    if (!this.$i18n.getLocaleMessage('zh')['admin']) {
      this.$i18n.mergeLocaleMessage('tw', local.tw)
      this.$i18n.mergeLocaleMessage('zh', local.zh)
    }
    this.getList()
  },
  methods: {
    // 获取管理员列表
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
        ConfirmPassword: '', // 确认密码
        Name: '', // 姓名
        Role: [], // 角色
        Mobile: ''// 手机号
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
          this.loadingSaveBtn = true;
          createUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message.success(this.$t('common.addSuccess'))
            this.loadingSaveBtn = false
            this.getList()
          }).catch(err => {
            this.loadingSaveBtn = false
          })
        }
      })
    },
    // 点击编辑
    handleUpdate(id) {
      fetchDetail(id).then(response => {
        this.temp = Object.assign({}, response.data.Data)
        this.temp.Role = response.data.Data.Role.split(",")
        this.temp.Role = this.clearNullOfArray(this.temp.Role)
        this.temp.Role = this.stringTranslateNumber(this.temp.Role)
        //this.temp.ConfirmPassword = ''
        this.temp.Password = ''
        
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
          this.loadingSaveBtn = true
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
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
        deleteUser(row.Id).then(response => {
          this.$message.success(this.$t('common.deleteSuccess'))
          this.getList()
        })
      }).catch(() => {

      })
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


      this.listQuery.EndTime = "";
      this.listQuery.BeginTime = "";
      
      this.getList();
    },
  }
}
</script>
