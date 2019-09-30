<template>
    <div    class="modeBox app-container" v-loading="listloading">
        <search-type-two
        :showDateTime="false"
        :showAddBtn="true"
        :options="selectInputOption"
        @getParams="getQueryParams"
        @resetParams="resetQyeryParams"
        @addElement="handleCreate"
        />

        <el-table :data="listData" border fit highlight-current-row style="width: 100%;" >
            <el-table-column label="Id" align="center" width="50">
                <template slot-scope="scope">
                    <span>{{scope.row.Id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Name" align="center" width="260">
                <template slot-scope="scope">
                    <span>{{scope.row.Name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="AppKey" align="center" width="260">
                <template slot-scope="scope">
                    <span>{{scope.row.AppKey}}</span>
                </template>
            </el-table-column>
            <el-table-column label="Desc" align="center" width="200">
                <template slot-scope="scope">
                    <span>{{scope.row.Desc}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="260">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handlerUpdate(scope.row)" >{{$t('common.edit')}}</el-button>
                    <el-button type="danger" size="mini" @click="handlerDel(scope.row)">{{$t('common.del')}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Pagesize" @pagination="getList" />

        <el-dialog
        v-el-drag-dialog
        :title="titleTxt"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        >
            <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" >
                <el-form-item :label="$t('agent.name')" >
                    <el-input v-model="temp.Name" :placeholder="$t('agent.place_hold_name')" :maxlength="GLOBAL.inputMaxLenght" />
                </el-form-item>
                <el-form-item :label="$t('agent.desc')">
                    <el-input v-model="temp.Desc" :placeholder="$t('agent.place_desc_name')" :maxlength="GLOBAL.inputMaxLenght" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">{{$t('common.cancel')}}</el-button>
                <el-button type="primary" @click="dialogStatus=='create'?createData():updateData()"
                :loading="loadingSaveBtn"
                >{{$t('common.confirm')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import SearchTypeTwo from "@/components/ListSearch/SearchTypeTwo"; //查询条件
import {addAgent,getList,deleteAgent,fetchAgentDetail,updateAgent} from "@/api/agent/agent"
import elDragDialog from "@/directive/el-dragDialog";
import local from "./local";
import Pagination from "@/components/Pagination";

export default {
    name:"Agent",
    directives: { elDragDialog },
    components:{SearchTypeTwo,Pagination},
    data:function()
    {
        return {
            listloading:false,
            loadingSaveBtn:false,
            titleTxt:"新增代理",
            selectInputOption:[
                {
                    label:"全部",value:"All"
                },
                {
                    label:"代理编号",value:"Id"
                },
                {
                    label:"代理姓名",value:"Name"
                },
                {
                    label:"AppKey",value:"AppKey"
                }
            ],
            textMap:{
                create:"add",
                update:"edit",
            },
            dialogFormVisible:false,
            listQuery:      //查询条件
            {
                Page:1,
                PageSize:this.$store.getters.pageSize,
                Keyword:"",         //玩家输入的值
                FilterKey:"",       //玩家选择的值
            },
            temp://代理临时数据
            {      
                Id:undefined,
                Name:"",                //代理名称
                Desc:"",                //说明
            },
            dialogStatus:"create",
            listData:[],
            total:0,            //当前的总页数
        }
    },
    created:function()
    {
        if(!this.$i18n.getLocaleMessage('zh')["agent"])
        {
            this.$i18n.mergeLocaleMessage("tw", local.tw);
            this.$i18n.mergeLocaleMessage("zh", local.zh);
        }
        this.getList()
    },
    methods:
    {
        //获取所有代理信息
        getList:function()
        {
            this.listloading = true;
            getList(this.listQuery).then(response=>{
                this.listloading = false;
                this.listData = response.data.Data.Items;
                this.total = response.data.Data.Pagination.MaxCount;
                this.listloading = false;

            }).catch(err=>{
                console.log("获取信息发生错误1");
                this.listloading = false;
            })
        },
        //获取组件返回的查询参数
        getQueryParams:function(val)
        {
            this.listQuery.Page = 1;
            this.listQuery.Keyword = val.filterValue;
            this.listQuery.FilterKey = val.filterKey
            this.getList();
        },
        //重置查询参数
        resetQyeryParams:function()
        {
            this.listQuery.Page = 1;
            this.listQuery.Sort = "";
            this.listQuery.Keyword = "";
            this.listQuery.FilterKey = "";

            this.getList();
        },
        resetTemp:function()
        {
            this.temp.Id = undefined;
            this.temp.Name = "";
            this.temp.Desc = "";
        },
        //点击新增
        handleCreate:function()
        {
            this.dialogFormVisible = true
            this.dialogStatus = "create";
            this.resetTemp();
            this.$nextTick(()=>{
                this.$refs.dataForm.clearValidate();
            })
        },
        createData:function()
        {
            this.$refs["dataForm"].validate(valid=>{
                if(!valid)
                {
                    return
                }
                const tempData = Object.assign({},this.temp)
                addAgent(tempData).then(()=>{
                    this.$message.success(this.$t('common.addSuccess'))
                    this.getList();
                    this.dialogFormVisible = false;
                })
                .catch(err=>{
                    console.log("错误了");
                })
            })
        },
        updateData:function()       //点击更新按钮操作发送给服务器
        {
            this.loadingSaveBtn = true;
            this.$refs.dataForm.validate(valid=>{
                if(!valid)
                {
                    return
                }

                const tempData = Object.assign({},this.temp);
                updateAgent(tempData).then(response=>{
                    this.dialogFormVisible = false;
                    this.loadingSaveBtn = false
                    this.$message.success(this.$t('common.editSuccess'));
                    this.getList();
                })
                .catch(err=>{
                    console.log(err)
                    this.loadingSaveBtn = false
                })

            })
        },
        handlerUpdate:function(row)                //更新按钮
        {
            this.dialogStatus = "update";
            this.dialogFormVisible = true;
            this.$nextTick(()=>{
                fetchAgentDetail(row.Id).then( response=>{
                    this.temp = Object.assign({},response.data.Data)

                })
                .catch(err=>{console.log("获取具体信息错误")});
                this.$refs.dataForm.clearValidate();
            })
        },
        handlerDel:function(row)                  //删除按钮操作
        {
            this.$confirm(this.$t('common.confirmDelete'),this.$t('common.hint'),{
                confirmButtonText:this.$t('common.confirm'),
                cancelButtonText:this.$t('common.cancel'),
                type:"warning"
            }) 
            .then(()=>{
                deleteAgent(row.Id).then(response=>{
                    this.$message.success(this.$t('common.deleteSuccess'));
                    this.getList();
                })
            })
        }
    },
    watch:
    {
        dialogStatus:function()
        {
            this.titleTxt = this.$t('agent.'+this.textMap[this.dialogStatus])
        }
    }
}
</script>

<style>

</style>