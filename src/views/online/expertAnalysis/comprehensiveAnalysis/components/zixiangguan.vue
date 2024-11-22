<template>
  <div>
    <div v-if="xAxisData" ref="chartRef" style="width: 100%; height: 400px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="zixiangguan">
// 自相关分析
import { ref, onMounted, onUnmounted, toRefs } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
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
let xAxisData = ref();
let yAxisData = ref();
let boxingKey = ref(1);

onMounted(async () => {
  if (dataObj?.value) {
    await getTrendChart();
  }
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    // 配置项和数据
    const option = ref({
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
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        type: "category",
        name: "时间（ms）",
        data: xAxisData.value ? xAxisData.value : [],
        axisLine: {
          show: true
        }
      },
      yAxis: {
        name: "Rss(N)",
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
          type: "line",
          stack: "Total",
          data: yAxisData.value ? yAxisData.value : [],
          markLine: {
            data: [{ xAxis: "Tue" }]
          }
        }
      ]
    });

    // 使用配置项和数据显示图表
    chartInstance.setOption(option.value);
  }
});
const getTrendChart = async () => {
  let obj: any = dataObj?.value;
  let params = {
    id: obj["id"],
    tableName: obj["tableName"],
    type: 6
  };
  // 判断是否存在Id
  if (!obj["id"]) return;
  let res: any = await Diagram_professionalAtlas(params);
  if (res.code == "200") {
    if (res.data?.autocorrelation && res.data?.autocorrelation.length > 0) {
      xAxisData.value = res.data?.autocorrelation.map((item, index) => index);
      yAxisData.value = res.data?.autocorrelation.map(item => item);
      boxingKey.value += 1;
    } else {
      ElMessage.error(res.data?.error);
    }
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
