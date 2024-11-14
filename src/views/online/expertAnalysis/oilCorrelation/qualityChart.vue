<template>
  <div>
    <div v-if="showChart" ref="chartRef1" style="width: 100%; height: calc(33vh)"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
  <div style="margin-bottom: 10px; text-align: center">
    <el-radio-group v-model="radio" @change="handleRadio">
      <el-radio-button label="温度" value="oilTemperature" />
      <el-radio-button label="水活性" value="waterActivity" />
      <el-radio-button label="含水量" value="moistureContent" />
      <el-radio-button label="密度" value="density" />
      <el-radio-button label="粘度" value="viscosity" />
      <el-radio-button label="介电常数" value="dielectricConstant" />
    </el-radio-group>
  </div>
</template>

<script setup lang="ts" name="boxingtu">
import { ref, onMounted, onUnmounted, toRefs } from "vue";
import * as echarts from "echarts";
const props = defineProps({
  partId: {
    type: String
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  chartData: {
    type: Object
  }
});
const { partId, startTime, endTime, chartData } = toRefs(props);
console.log(partId?.value, startTime?.value, endTime?.value);
let radio = ref("oilTemperature");
let showChart = ref(true);
const chartRef1 = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let xAxisData = ref();
let yAxisData = ref();
xAxisData.value = chartData?.value?.xData;
yAxisData.value = chartData?.value?.oilTemperature;
let unitName = ref("℃");
// 操作按钮
const handleRadio = (val: any) => {
  showChart.value = false;
  radio.value = val;
  switch (val) {
    case "oilTemperature":
      option.value.series[0].data = chartData?.value?.oilTemperature;
      unitName.value = "℃";
      option.value.series[0].name = "温度";
      break;
    case "waterActivity":
      option.value.series[0].data = chartData?.value?.waterActivity;
      unitName.value = "aw";
      option.value.series[0].name = "水活性";
      break;
    case "moistureContent":
      option.value.series[0].data = chartData?.value?.moistureContent;
      unitName.value = "ppm";
      option.value.series[0].name = "含水量";
      break;
    case "density":
      option.value.series[0].data = chartData?.value?.density;
      unitName.value = "kg/m³";
      option.value.series[0].name = "密度";
      break;
    case "viscosity":
      option.value.series[0].data = chartData?.value?.viscosity;
      unitName.value = "cp";
      option.value.series[0].name = "粘度";
      break;
    case "dielectricConstant":
      option.value.series[0].data = chartData?.value?.dielectricConstant;
      unitName.value = "";
      option.value.series[0].name = "介电常数";
      break;

    default:
      break;
  }
  chartInstance = echarts.init(chartRef1.value);
  showChart.value = true;
  // 使用配置项和数据显示图表
  chartInstance.setOption(option.value);
};
// 配置项和数据
let option = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "line" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  dataZoom: [
    {
      type: "inside", // 表示有一个滑动条形的缩放组件
      start: 0, // 滑动条的起始位置，表示数据窗口包含数据系列的前10%
      end: 100 // 滑动条的结束位置，表示数据窗口包含数据系列的后30%
    },
    {
      start: 0,
      end: 100
    }
  ],
  xAxis: {
    type: "category",
    name: "时间",
    data: xAxisData.value ? xAxisData.value : [],
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
    splitNumber: 10,
    // 设置Y轴标题
    name: unitName,
    nameLocation: "end", // 坐标轴名称显示位置 'start'，'middle' 或者 'center'，'end'
    nameTextStyle: {
      // fontWeight: "bold",
      fontSize: "18",
      align: "left",
      color: "#000"
    },
    nameGap: 10 //到标题轴的距离
  },
  series: [
    {
      name: "温度",
      type: "line",
      stack: "Total",
      data: yAxisData.value ? yAxisData.value : [],
      markLine: {
        data: [{ xAxis: "Tue" }]
      }
    }
  ]
});
onMounted(async () => {
  if (chartRef1.value) {
    chartInstance = echarts.init(chartRef1.value);
    // 使用配置项和数据显示图表
    chartInstance.setOption(option.value);
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
