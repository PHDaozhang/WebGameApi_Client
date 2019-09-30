<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require("echarts/theme/macarons"); // echarts theme
import resize from './mixins/resize'
import uuidv1 from 'uuid/v1'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: () => {
        return uuidv1()
      }
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    title:{
      type:String,
      default:''
    },
    legendData:{
      type:Array,
      default:()=>[]
    },
    dataName:{
      type:String,
      default:''
    },
    roseType:{
      type:String,
      default:"radius"
    },
    seriesData:{
      type:Array,
      default:()=>[]
    },
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    seriesData: {
      handler() {
        this.initChart()
      }
    }
  },
  mounted() {
    
    this.chart = echarts.init(this.$el, "macarons");
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        title: {
          text: this.title,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.legendData,
        },
        series: [
          {
            name: this.dataName,
            type: 'pie',
            roseType: this.roseType,
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.seriesData,
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }
        ]
      })
    }
  }
}
</script>
