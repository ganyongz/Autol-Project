<template>
  <div id="main5" style="width: 600px; height: 500px; text-align: center" />
</template>

<script lang="ts" setup name="qitingtongji">
import * as echarts from "echarts";
import { onMounted } from "vue";

onMounted(() => {
  // type EChartsOption = echarts.EChartsOption;
  let chartDom = document.getElementById("main5");
  let myChart = echarts.init(chartDom);
  let option: any;

  option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: ["未下发", "已下发", "已完成"],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: "value"
      }
    ],
    legend: {
      top: "5%", // 控制 板块控制器的位置
      right: "right",
      // icon: 'rect',//形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
      // itemWidth: 10,  // 设置宽度
      // itemHeight: 4, // 设置高度
      itemGap: 40, // 设置两个legend之间的间距
      data: [
        {
          name: "未下发", // 这个name需要和 series 里面的 name 对应起来
          textStyle: {
            color: "#2DC3FB" // 单独设置某一个图列的颜色
          }
        },
        {
          name: "黄色柱子",
          textStyle: {
            color: "#FDD43C"
          }
        }
      ]
    },
    series: [
      {
        name: "未下发",
        type: "bar",
        barWidth: "30%",
        data: [
          {
            value: 10
          },
          {
            value: 20,
            itemStyle: {
              color: "#339933"
            }
          },
          {
            value: 14,
            itemStyle: {
              color: "#cc66ff"
            }
          }
        ]
      }
    ]
  };
  option && myChart.setOption(option);
});
</script>
<style scoped lang="scss"></style>
