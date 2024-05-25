<template>
  <div id="main4" style="width: 600px; height: 600px; text-align: center" />
</template>

<script lang="ts" setup>
// 状态统计
import { onMounted } from "vue";
import * as echarts from "echarts";

type EChartsOption = echarts.EChartsOption;

onMounted(() => {
  let chartDom = document.getElementById("main4")!;
  let myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
});
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
    left: "right"
  },
  series: [
    {
      name: "设备状态",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "在用" },
        { value: 735, name: "闲置" },
        { value: 580, name: "报废" }
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
</script>
<style scoped lang=""></style>
