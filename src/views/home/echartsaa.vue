<template>
  <div id="main3" style="width: 600px; height: 500px; text-align: center" />
</template>

<script lang="ts" setup name="qitingtongji">
import * as echarts from "echarts";
import "echarts-gl";
import { onMounted, ref } from "vue";
let option: any;
let data: any = ref([]);
// Parametric curve
for (let t = 0; t < 25; t += 0.001) {
  let x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t);
  let y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t);
  let z = t + 2.0 * Math.sin(75 * t);
  if (x) {
    data.value.push([x, y, z]);
  }
}
setTimeout(() => {
  console.log("准备数据", data.value);
  console.log("哈哈----------0");
}, 1000);

option = {
  tooltip: {},
  backgroundColor: "#fff",
  visualMap: {
    show: false,
    dimension: 2,
    min: 0,
    max: 30,
    inRange: {
      color: [
        "#313695",
        "#4575b4",
        "#74add1",
        "#abd9e9",
        "#e0f3f8",
        "#ffffbf",
        "#fee090",
        "#fdae61",
        "#f46d43",
        "#d73027",
        "#a50026"
      ]
    }
  },
  xAxis3D: {
    type: "value"
  },
  yAxis3D: {
    type: "value"
  },
  zAxis3D: {
    type: "value"
  },
  grid3D: {
    viewControl: {
      projection: "orthographic"
    }
  },
  series: [
    {
      type: "line3D",
      data: data.value,
      lineStyle: {
        width: 4
      }
    }
  ]
};
onMounted(() => {
  let chartDom = document.getElementById("main3");
  let myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
});
</script>
<style scoped lang="scss"></style>
