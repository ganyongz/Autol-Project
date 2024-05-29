<template>
  <p style="margin: 10px 0 10px 10px">危险总数：0</p>
  <div ref="chartDom" style="width: 600px; height: 400px"></div>
</template>

<script lang="ts" setup>
// 报警饼图
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
type EChartsOption = echarts.EChartsOption;
let chartDom = ref();

let option: EChartsOption;

option = {
  // title: {
  //   text: "Referer of a Website",
  //   subtext: "Fake Data",
  //   left: "center"
  // },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: "right",
    top: "50px",
    right: "0"
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1, name: "阈值报警" },
        { value: 2, name: "窄带报警" },
        { value: 3, name: "频段报警" },
        { value: 4, name: "包络值报警" },
        { value: 5, name: "无量纲报警" },
        { value: 6, name: "统计量报警" },
        { value: 7, name: "变化率报警" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};

onMounted(() => {
  let myChart = echarts.init(chartDom.value);
  option && myChart.setOption(option);
});
</script>
<style scoped lang=""></style>
