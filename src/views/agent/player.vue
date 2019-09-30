<template>
    <div class="modeBox app-container">
        <search-type-two
        :showDateTime="true"
        :options="selectInputOption"
        @getParams="getQueryParams"
        @resetParams="resetQyeryParams"
        @addElement="handleCreate"
        />

        <el-table :data="listData" border fit highlight-current-row style="width: 100%;" >
            <el-table-column label="玩家账号" align="center" width="400">
                <template slot-scope="scope">
                    <span>{{scope.row.Account}}</span>
                </template>
            </el-table-column>
            <el-table-column label="代理ID" align="center" width="300">
                <template slot-scope="scope">
                    <span>{{scope.row.ChannelId}}</span>
                </template>
            </el-table-column>
            <el-table-column label="注册时间" align="center" width="300">
                <template slot-scope="scope">
                    <span>{{scope.row.RegisterTime}}</span>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Pagesize" @pagination="getList" />

    </div>
</template>

<script>

import SearchTypeTwo from "@/components/ListSearch/SearchTypeTwo"; //查询条件
import elDragDialog from "@/directive/el-dragDialog";
import local from "./local";
import Pagination from "@/components/Pagination";
import {getList} from "@/api/agent/player"

export default {
    name:"order",
    components:{SearchTypeTwo,Pagination},
    directives: { elDragDialog },
    
    data:function()
    {
        return {
            selectInputOption:
            [
                {label:"全部",value:"All"},
                {label:"代理",value:"Agent"},
                {label:"玩家账号",value:"Account"},
                {label:"创建时间",value:"CreateTime"},
            ],
            listQuery:      //查询条件
            {
                Page:1,
                PageSize:this.$store.getters.pageSize,
                Keyword:"",         //玩家输入的值
                FilterKey:"",       //玩家选择的值
            },
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
        getList:function()
        {   
            this.listloading = true;
            getList(this.listQuery).then(response=>{
                this.listloading = false;
                this.listData = response.data.Data;
                this.total = 1;// response.data.Data.Pagination.MaxCount;
                this.listloading = false;

            }).catch(err=>{
                console.log("获取信息发生错误2");
                console.log(err);
                this.listloading = false;
            })
        },
        getQueryParams:function(val)    //获取组件返回的查询参数
        {
            this.listQuery.Page = 1;
            this.listQuery.Keyword = val.filterValue;
            this.listQuery.FilterKey = val.filterKey;
            this.listQuery.BeginTime  = val.BeginTime;
            this.listQuery.EndTime = val.EndTime;
            this.getList();
        },
        resetQyeryParams:function()
        {
            this.listQuery.Page = 1;
            this.listQuery.Sort = "";
            this.listQuery.Keyword = "";
            this.listQuery.FilterKey = "";
            this.listQuery.BeginTime = undefined;
            this.listQuery.EndTime = undefined;

            this.getList();
        },
        handleCreate:function()
        {

        }
    },
    watch:
    {
        
    },
    filters:
    {
        orderStateFilter:function(value)
        {
            switch(value)
            {
                case 0: return "未处理";
                case 1: return "未知";
                case 2: return "支付成功";
                case 3: return "下分失败";
            }

            return "未处理"
        },
    }
}
</script>


<style>

</style>