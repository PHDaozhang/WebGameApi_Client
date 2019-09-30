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
    },
    xData: {
      handler() {
        this.initChart();
      },
      deep: true
    },
    legendData: {
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
    // this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.clear();
      this.chart.setOption(
        {
          title: {
            text: this.title
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            },
            padding: [5, 10]
          },
          legend: {
            top: 0,
            icon: "rect",
            itemWidth: 14,
            itemHeight: 5,
            data: this.legendData
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
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
              axisTick: {
                show: true
              }
            }
          ],
          series: this.seriesData
        },
        true
      );
    }
  }
};
</script>
