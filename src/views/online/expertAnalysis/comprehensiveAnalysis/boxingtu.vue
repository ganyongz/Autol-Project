<template>
  <div>
    <div v-if="xAxisData" ref="chartRef" style="width: 100%; height: 400px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="boxingtu">
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
      // legend: {
      //   data: ["Email", "Union Ads"]
      // },
      grid: {
        //距离各个地方的边距 1
        // left: "10%",
        // right: "5%",
        // bottom: "10%",
        // containLabel: true
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
          type: "inside", // 表示有一个滑动条形的缩放组件
          start: 10, // 滑动条的起始位置，表示数据窗口包含数据系列的前10%
          end: 30 // 滑动条的结束位置，表示数据窗口包含数据系列的后30%
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
        },
        // 隐藏y轴刻度线
        axisTick: {
          show: true
        }
        // graphic: [
        //   {
        //     type: "text",
        //     left: "top", // 文本水平位置，根据需求调整
        //     top: "top", // 文本垂直位置，设置为 'bottom' 以使其位于图表底部
        //     offset: [5, 3], // 根据需要调整文本与 y 轴的距离
        //     style: {
        //       text: "kg3", // 文本内容
        //       textAlign: "center", // 文本水平对齐方式
        //       fill: "#333", // 文本颜色
        //       fontSize: 12 // 文本大小
        //     },
        //     z: 100 // 设置层级，确保文本在图表上方
        //   }
        // ]
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
        name: "幅值（mm/s）",
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
          name: "振幅",
          type: "line",
          stack: "Total",
          data: yAxisData.value ? yAxisData.value : [],
          markLine: {
            data: [{ xAxis: "Tue" }]
          }
        }
      ]
      // graphic: [
      //   {
      //     type: "text",
      //     left: "center", // 文本水平位置
      //     top: "bottom", // 文本垂直位置，设置为 'bottom' 以使其位于图表底部
      //     style: {
      //       text: "时间/ms", // 文本内容
      //       textAlign: "center", // 文本水平对齐方式
      //       fill: "#333", // 文本颜色
      //       fontSize: 12 // 文本大小
      //     },
      //     z: 100 // 设置层级，确保文本在图表上方
      //   },
      //   {
      //     writingMode: "sideways-lr",
      //     type: "text",
      //     left: "left", // 文本水平位置，根据需求调整
      //     marginRight: "0",
      //     top: "center",
      //     offset: [200, 200], // 根据需要调整文本与 y 轴的距离
      //     style: {
      //       text: "幅值/mm/s",
      //       textAlign: "right",
      //       writingMode: "sideways-lr",
      //       transform: "rotate(180deg)",
      //       fontSize: 12
      //     },
      //     z: 100
      //   }
      // ]
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
    type: 1
  };
  let res: any = await Diagram_professionalAtlas(params);
  if (res.code == "200") {
    xAxisData.value = res.data?.xData;
    yAxisData.value = res.data?.yData;
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
