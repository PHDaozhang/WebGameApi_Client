<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import uuidv1 from "uuid/v1";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: () => {
        return uuidv1();
      }
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    },
    title: {
      type: String,
      default: ""
    },
    legendData: {
      type: Array,
      default: () => []
    },
    seriesData: {
      type: Array,
      default: () => []
    },
    xData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    seriesData: {
      handler() {
        this.initChart();
      },
      deep: true
    }
  },
  mounted() {
    this.chart = echarts.init(this.$el, "macarons");
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));

      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: this.legendData
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        // 滚轮放大缩小
        dataZoom: [
          {
            type: "inside"
          }
        ],
        xAxis: [
          {
            type: "category",
            axisTick: {
              show: true
            },
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: true
            }
          }
        ],
        series: this.seriesData,
        //动画效果
        animationEasing: "elasticOut",
        animationDelayUpdate: function(idx) {
          return idx * 5;
        }
      });
      var _this = this;
      _this.chart.off("click"); //阻止事件冒泡
      _this.chart.on("click", function(params) {
        _this.$emit("clickChannelId", params.name);
      });
    }
  }
};
</script>
