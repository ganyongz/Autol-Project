<template>
  <div ref="chartDom" class="chartDom"></div>
</template>

<script lang="ts" setup name="CurrentState">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
let chartDom = ref();
let echartData = [
  {
    value: 2154,
    name: "正常运行"
  },
  {
    value: 3854,
    name: "注意待观察"
  },
  {
    value: 3515,
    name: "预警"
  },
  {
    value: 3515,
    name: "故障"
  }
];
let option = {
  legend: {
    top: "bottom",
    textStyle: {
      color: "#ffffff" // 设置图例文字的颜色为红色
    }
  },
  series: [
    {
      name: "状态分析",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      label: {
        // normal: {
        show: true,
        formatter: "{c}({d}%)" //自定义显示格式(b:name, c:value, d:百分比)
        // }
      },
      data: echartData
    }
  ]
};

onMounted(() => {
  let myChart = echarts.init(chartDom.value);
  option && myChart.setOption(option);
});
</script>
<style scoped lang="scss">
.chartDom {
  width: 100%;
  height: calc(100% - 48px);
  min-height: 280px;
}
</style>
