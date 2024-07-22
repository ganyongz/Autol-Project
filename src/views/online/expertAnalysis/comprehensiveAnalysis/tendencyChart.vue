<template>
  <div>
    <div style="margin: 10px 25px; text-align: left">[趋势图]</div>
    <div v-if="chartData.length" ref="chartRef" style="width: 100%; height: 400px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="boxingtu">
import { ref, onMounted, onUnmounted, toRefs } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import { Diagram_trendChart } from "@/api/online/comprehensiveAnalysis";
const props = defineProps({
  stationId: {
    type: String,
    default: ""
  }
});
const { stationId } = toRefs(props);
let chartData = ref([]);
let tableName = ref("");
const emit = defineEmits(["searchResult"]);

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

onMounted(async () => {
  await getTrendChart();
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

      grid: {
        //距离各个地方的边距 1
        // left: "10%",
        // right: "5%",
        // bottom: "10%",
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
        data: chartData.value.map(item => item["xAxis"]),
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
          data: chartData.value.map(item => {
            return {
              value: item["value"],
              id: item["id"]
            };
          }),
          smooth: true,
          markLine: {
            data: [{ xAxis: "Tue" }]
          }
        }
      ]
    });
    // 点击事件
    chartInstance.on("click", params => {
      let parameter = {
        tableName: tableName.value,
        data: params.data
      };
      emit("searchResult", parameter);
    });
    // 使用配置项和数据显示图表
    chartInstance.setOption(option.value);
  }
});
// 获取数据
const getTrendChart = async () => {
  let params = {
    pointId: stationId.value,
    startTime: "2024-02-08 13:07:01",
    endTime: "2024-07-18 13:07:01"
  };
  let res: any = await Diagram_trendChart(params);
  if (res.code == "200") {
    chartData.value = res.data.realData;
    tableName.value = res.data.tableName;
  } else {
    ElMessage.error(res?.mssage);
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

<style scoped></style>
