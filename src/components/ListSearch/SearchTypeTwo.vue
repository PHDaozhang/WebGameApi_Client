<template>
  <div class="filter-container w_auto" style="margin-bottom:10px">
    <el-input
      :placeholder="$t('common.plaseInput')"
      clearable
      v-model="param.filterValue"
      :maxlength="GLOBAL.inputMaxLenght"
      class="input-with-select"
    >
      <el-select
        v-model="param.filterKey"
        slot="prepend"
        :placeholder="$t('common.placeholder')"
        style="width:120px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-input>

    <date-time
      @chooseDateTime="chooseTime"
      :inputType="dateTimeType"
      :valueFormat="valueFormat"
      :defaultDateTime="dataTime"
      :limitNumber="limitNumber"
      v-if="showDateTime"
    />
    <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.seach') }}</el-button>
    <el-button type="warning" icon="el-icon-refresh" @click="handleReset">{{ $t('common.reset') }}</el-button>
    <el-button
      type="success"
      icon="el-icon-edit"
      @click="handleCreate"
      v-if="showAddBtn"
    >{{ $t('common.' + addTitle) }}</el-button>
    <el-button
      type="success"
      icon="el-icon-check"
      @click="handleMoreManual"
      v-if="showBatchManualABtn"
    >{{ $t('common.batchManual') }}</el-button>
    <el-button
      type="warning"
      icon="el-icon-close"
      @click="handleMoreReject"
      v-if="showBatchRejectABtn"
    >{{ $t('common.batchReject') }}</el-button>
  </div>
</template>
<script>
import DateTime from "@/components/DateTime";
export default {
  name: "searchTypeTwo",
  components: { DateTime },
  props: {
    options: {
      type: Array
    },
    showAddBtn: {
      type: Boolean,
      default: false
    },
    showBatchManualABtn: {
      type: Boolean,
      default: false
    },
    showBatchRejectABtn: {
      type: Boolean,
      default: false
    },
    showDateTime: {
      type: Boolean,
      default: true
    },
    dateTimeType: {
      type: String,
      default: "datetimerange"
    },
    valueFormat: {
      type: String,
      default: "timestamp"
    },
    limitNumber:{
      type: Number,
      default: 0
    },
    addTitle:{
      type:String,
      default:"add"
    }
  },
  data() {
    return {
      dataTime: [],
      param: {
        filterKey: "All",
        filterValue: "",
        BeginTime: "",
        EndTime: ""
      }
    };
  },
  created() {},
  methods: {
    //获取选择的时间
    chooseTime(val) {
      this.param.BeginTime = val[0];
      this.param.EndTime = val[1];
    },
    //点击查询
    handleFilter() {
      this.$emit("getParams", this.param);
    },
    //点击重置
    handleReset() {
      this.param = {
        filterKey: "All",
        filterValue: "",
        BeginTime: "",
        EndTime: ""
      };
      this.dataTime = [];
      this.$emit("resetParams", this.param);
    },
    //点击新增
    handleCreate() {
      this.$emit("addElement");
    },
    //点击批量人工
    handleMoreManual() {
      this.$emit("manualElement");
    },
    //点击批量拒绝
    handleMoreReject() {
      this.$emit("rejectElement");
    }
  }
};
</script>
<style>
.filter-container .el-input-group {
  width: 300px;
}
</style>

