<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts" name="boxingtu">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
chartInstance;
chartInstance;

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);

    // mock 数据
    const xAxisData = [0, 9.897, -100, 90, 80, 100, 110, 140];
    const yAxisData = [0.88, 132, -101, 134, -90, 230, -210];

    // 配置项和数据
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "line" // 默认为直线，可选为：'line' | 'shadow'
        }
      },

      // legend: {
      //   data: ["Email", "Union Ads"]
      // },
      grid: {
        //距离各个地方的边距 1
        left: "10%",
        right: "5%",
        bottom: "10%",
        containLabel: true
      },
      // grid: {
      //   //另外一种方式控制 2
      //   x: "12%", //x 偏移量
      //   y: "7%", // y 偏移量
      //   width: "87%", // 宽度
      //   height: "79%" // 高度
      // },
      dataZoom: [
        {
          // 这部分是dataZoom的配置
          type: "inside", // 表示有一个滑动条形的缩放组件
          start: 0, // 滑动条的起始位置，表示数据窗口包含数据系列的前0%
          end: 100 // 滑动条的结束位置，表示数据窗口包含数据系列的后100%
        }
      ],
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLine: {
          show: true
        },
        // 隐藏y轴刻度线
        axisTick: {
          show: true
        }
      },
      yAxis: {
        type: "value",
        // 隐藏y轴
        axisLine: {
          show: true
        },
        // 隐藏y轴刻度线
        axisTick: {
          show: true
        },
        // y轴网格线设置
        splitLine: {
          type: "dashed",
          color: "#eeeeee"
        },
        splitNumber: 5
      },
      series: [
        {
          name: "振幅",
          type: "line",
          stack: "Total",
          data: yAxisData
        }
      ]
    };

    // 使用配置项和数据显示图表
    chartInstance.setOption(option);
  }
});

onUnmounted(() => {
  if (chartInstance) {
    // 组件卸载时清理 ECharts 实例
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
/* 这里可以添加一些样式 */
</style>
