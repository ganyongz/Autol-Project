<template>
  <div>
    <div style="padding: 5px; text-align: left">
      转速(rpm)：<el-input style="width: 200px" v-model.number="rotateSpeed" @change="handleRpm"></el-input>
    </div>
    <div v-if="xAxisData" ref="chartRef" style="height: 350px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="jieCiFenXi">
// 阶次分析
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
// 修改转速
const handleRpm = async () => {
  xAxisData.value = false;
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
          end: 100 // 滑动条的结束位置，表示数据窗口包含数据系列的后80%
        },
        {
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        boundaryGap: false,
        name: "阶次",
        type: "category",
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
          show: true,
          type: "dashed",
          color: "#eeeeee"
        },
        splitNumber: 10, //Y轴，X轴分割段数
        axisLabel: {
          rotation: 90 // 设置 Y 轴标题旋转角度
        },
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
      // tooltip (Y轴坐标数据)
      series: [
        {
          name: "幅值",
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
};
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
          end: 100 // 滑动条的结束位置，表示数据窗口包含数据系列的后80%
        },
        {
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        boundaryGap: false,
        name: "阶次",
        type: "category",
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
          show: true,
          type: "dashed",
          color: "#eeeeee"
        },
        splitNumber: 10, //Y轴，X轴分割段数
        axisLabel: {
          rotation: 90 // 设置 Y 轴标题旋转角度
        },
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
      // tooltip (Y轴坐标数据)
      series: [
        {
          name: "幅值",
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
let rotateSpeed = ref(1000);
const getTrendChart = async () => {
  let obj: any = dataObj?.value;
  let params = {
    id: obj["id"],
    tableName: obj["tableName"],
    type: 9,
    rotateSpeed: rotateSpeed.value
  };
  // 判断是否存在Id
  if (!obj["id"]) return;
  let res: any = await Diagram_professionalAtlas(params);
  if (res.code == "200") {
    if (res.data?.amplitudes) {
      xAxisData.value = res.data?.orders;
      yAxisData.value = res.data?.amplitudes;
      boxingKey.value += 1;
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
