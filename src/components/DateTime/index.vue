<template>
  <el-date-picker
    v-model="dateTime"
    :type="inputType"
    :picker-options="pickerOptions2"
    :value-format="valueFormat"
    :range-separator="rangeText"
    :start-placeholder="startText"
    :end-placeholder="endText"
    @change="dateTimeChange"
    :align="align"
    unlink-panels
  ></el-date-picker>
</template>
<script>
import { pickerOptions } from "@/utils/index";
export default {
  name: "dataTime",
  props: {
    align: {
      type: String,
      default: "left"
    },
    rangeText: {
      type: String,
      default: "至"
    },
    startText: {
      type: String,
      default: "开始日期"
    },
    endText: {
      type: String,
      default: "结束日期"
    },
    inputType: {
      type: String,
      default: "datetimerange"
    },
    valueFormat: {
      type: String,
      default: "timestamp"
    },
    defaultDateTime: {
      type: Array,
      default: () =>[]
    },
    showOptions:{
      type:Boolean,
      default:true
    },
    limitNumber:{
      type:Number,
      default:0
    }
  },
  watch: {
    defaultDateTime: {
      handler(newVal,oldVal) {
        this.dateTime = newVal
      },
      deep: true
    },
  },
  data() {
    let _minTime = null
    let _maxTime = null
    return {
      dateTime: [],
      pickerOptions2: {
        shortcuts: this.showOptions ? pickerOptions : '' ,
        onPick: (time) => {
          if(this.limitNumber != 0){
            // 如果选择了只选择了一个时间
            if (!time.maxDate) {
              let timeRange = this.limitNumber*24*60*60*1000 // 限制的天数
              _minTime = time.minDate.getTime() - timeRange // 最小时间
              _maxTime = time.minDate.getTime() + timeRange // 最大时间
              // 如果选了两个时间，那就清空本次范围判断数据，以备重选
            } else {
              _minTime = _maxTime = null
            }
          }
        },
        disabledDate: (time) => {
            // onPick后触发
            // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
            if(_minTime && _maxTime){
              return time.getTime() < _minTime || time.getTime() > _maxTime
            }
        }
      }
    };
  },
  created() {
    this.dateTime = this.defaultDateTime;
  },
  methods: {
    dateTimeChange(val) {
      const timeArray = ["", ""];
      if(val && val.length > 0){
        if(this.valueFormat == "timestamp"){
          timeArray[0] = (val[0] / 1000).toFixed(0);
          timeArray[1] = (val[1] / 1000 + 86399).toFixed(0);
        }else{
          timeArray[0] = val[0]
          timeArray[1] = val[1]
        }
      }
      this.$emit("chooseDateTime", timeArray);
    }
  }
};
</script>

