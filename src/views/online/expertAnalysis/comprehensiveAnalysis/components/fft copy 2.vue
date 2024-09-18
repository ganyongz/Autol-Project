<template>
  <div>
    <div v-if="fftData.series[0].data" ref="chartRef" style="width: 100%; height: 400px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="fft">
// 短时FFT分析
import { ref, onMounted, onUnmounted, toRefs } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import "echarts-gl";
import { Diagram_professionalAtlas } from "@/api/online/comprehensiveAnalysis";
const props = defineProps({
  stationId: {
    type: String,
    default: ""
  },
  dataObj: {
    type: Object
  }
});
const { dataObj } = toRefs(props);
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
// let xAxisData = ref();
// let yAxisData = ref();
let boxingKey = ref(1);
// 假设 fftData 是从服务器获取的 FFT 结果
let fftData = ref({
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
      data: [],
      lineStyle: {
        width: 4
      }
    }
  ]
});

onMounted(async () => {
  if (dataObj?.value) {
    await getTrendChart();
  }
  chartInstance = echarts.init(chartRef.value as HTMLElement);
  chartInstance.setOption(fftData.value);
});
const getTrendChart = async () => {
  let obj: any = dataObj?.value;
  let params = {
    id: obj["id"],
    tableName: obj["tableName"],
    type: 7
  };
  let res: any = await Diagram_professionalAtlas(params);
  if (res.code == "200" && res.data?.frequencies) {
    // 首先，循环 arr1 和 arr2 来创建一个新数组
    let arr1 = res.data?.frequencies;
    let arr2 = res.data?.magnitude;
    let arr3 = res.data?.times;
    let combinedArr = arr1.map((item1, index1) => {
      return arr2[index1].map(item2 => [item1, item2]);
    });

    // 然后，循环新数组和 arr3 来创建最终的数组
    let finalArr: any = [];
    combinedArr.forEach(subArr => {
      subArr.forEach((item: any) => {
        arr3.forEach((item3: any) => {
          finalArr.push([...item, item3]);
        });
      });
    });
    fftData.value.series[0].data = finalArr;
    console.log(fftData.value.series[0].data);

    boxingKey.value += 1;
  } else {
    ElMessage.error(res?.message);
  }
};
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
