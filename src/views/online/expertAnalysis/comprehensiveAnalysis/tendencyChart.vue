<template>
  <div class="table-box">
    <div class="screenBox" style="margin: 10px; text-align: left">
      <el-select v-model="timeSelect" class="m-2" placeholder="时间筛选" style="width: 200px" @change="handleSelect">
        <el-option v-for="item in timeOPtions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-if="timeSelect == '0'"
        v-model="customValue"
        type="datetimerange"
        range-separator="~"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="width: 340px"
        @change="changeVal"
      />
      <el-button v-if="timeSelect == '1'" @click="toggleTimer" type="primary">{{
        timerActive ? "关闭刷新" : "开启刷新"
      }}</el-button>
      <!-- <el-button type="primary">查询</el-button> -->
      <!-- <span>{{ timerActive }}</span> -->
    </div>

    <div style="margin: 10px 25px; text-align: left">[趋势图]</div>
    <div v-if="chartData.length > 0" ref="chartRef" style="width: 100%; height: 300px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="boxingtu">
import { watch, ref, onMounted, onUnmounted, toRefs, nextTick, onBeforeUnmount, onActivated } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import { Diagram_trendChart } from "@/api/online/comprehensiveAnalysis";
import dayjs from "dayjs";
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
let timeScreen: any = ref([]);
// 时间筛选
let timeSelect = ref("1");
const timeOPtions = [
  { value: "1", label: "实时数据" },
  { value: "2", label: "最近三天" },
  { value: "3", label: "最近一月" },
  { value: "4", label: "最近三月" },
  { value: "5", label: "最近半年" },
  { value: "6", label: "最近一年" },
  { value: "0", label: "自定义" }
];
const timerActive = ref(false);
// 自定义时间
let customValue = ref();
const handleSelect = (val: any) => {
  switch (val) {
    case "1": //实时数据（10s刷新一次）
      getTrendChart(1);
      // timerActive.value = true;
      break;
    case "2": //最近三天
      timerActive.value = false;
      getTrendChart(2);
      break;
    case "3": //最近一月
      timerActive.value = false;
      getTrendChart(3);
      break;
    case "4": //最近三月
      timerActive.value = false;
      getTrendChart(4);
      break;
    case "5": //最近半年
      timerActive.value = false;
      getTrendChart(5);
      break;
    case "6": // 最近一年
      timerActive.value = false;
      getTrendChart(6);
      break;

    default:
      break;
  }
};
// 自定义时间
const changeVal = (val: any) => {
  timeScreen.value[0] = val[0];
  timeScreen.value[1] = val[1];
  getTrendChart(0);
};
const setBarChart2 = () => {
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
          type: "inside", // 表示有一个滑动条形的缩放组件
          start: 0, // 滑动条的起始位置，表示数据窗口包含数据系列的前10%
          end: 100 // 滑动条的结束位置，表示数据窗口包含数据系列的后20%
        },
        {
          start: 0,
          end: 100
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
        max: function (extent) {
          return extent.max > dangerValue.value ? extent.max : dangerValue.value;
        },
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
        splitNumber: 10
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
            symbol: ["none", "none"],
            data: [
              {
                name: "预警值",
                yAxis: waringValue?.value ? waringValue.value : "", // 预警值
                label: {
                  formatter: "{b}: {c}"
                },
                lineStyle: {
                  type: "solid", // 基准线样式为虚线
                  color: "yellow",
                  width: 3
                }
              },
              {
                name: "危险值",
                yAxis: dangerValue?.value ? dangerValue.value : "", // 危险值
                label: {
                  formatter: "{b}: {c}"
                  // 不显示基准线名称
                  // show: true
                },
                lineStyle: {
                  type: "solid", // 基准线样式为虚线
                  color: "red",
                  width: 3
                }
              }
            ]
          }
        }
      ]
    });
    // 点击事件
    chartInstance.on("click", (params: any) => {
      let parameter = {
        tableName: tableName.value,
        id: params?.data["id"]
      };
      emit("searchResult", parameter);
    });
    // 使用配置项和数据显示图表
    chartInstance.setOption(option.value);
  }
};
let dangerValue = ref();
let waringValue = ref();
onMounted(async () => {
  // debugger;
  timeScreen.value[0] = dayjs().subtract(5, "minute").format("YYYY-MM-DD HH:mm:ss");
  timeScreen.value[1] = dayjs().format("YYYY-MM-DD HH:mm:ss");
  if (stationId.value) {
    await getTrendChart(1);
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
            type: "inside", // 表示有一个滑动条形的缩放组件
            start: 0, // 滑动条的起始位置，表示数据窗口包含数据系列的前10%
            end: 100 // 滑动条的结束位置，表示数据窗口包含数据系列的后20%
          },
          {
            start: 0,
            end: 100
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
          max: function (extent) {
            return extent.max > dangerValue.value ? extent.max : dangerValue.value;
          },
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
          splitNumber: 10
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
      chartInstance.on("click", (params: any) => {
        let parameter = {
          tableName: tableName.value,
          id: params?.data["id"]
        };
        emit("searchResult", parameter);
      });
      // 使用配置项和数据显示图表
      chartInstance.setOption(option.value);
    }
  }
});
// 获取数据
const getTrendChart = async val => {
  // debugger;
  let params;
  if (timeSelect.value == "0") {
    params = {
      pointId: stationId.value,
      startTime: timeScreen.value[0],
      endTime: timeScreen.value[1],
      type: val
    };
  } else {
    params = {
      pointId: stationId.value,
      type: val
    };
  }
  let res: any = await Diagram_trendChart(params);
  if (res.code == "200" && res.data.realData) {
    chartData.value = res.data.realData;
    tableName.value = res.data.tableName;
    dangerValue.value = res.data.dangerValue;
    waringValue.value = res.data.waringValue;
    nextTick(() => {
      setBarChart2();
    });

    let parameter = {
      tableName: res.data.tableName,
      id: chartData.value.length > 0 ? chartData.value[0]["id"] : ""
    };
    emit("searchResult", parameter);
  } else {
    ElMessage.error(res?.message);
  }
};

// 创建定时器
let timerId: any = null;
const toggleTimer = () => {
  timerActive.value = !timerActive.value;
  if (timerActive.value) {
    getTrendChart(1);
  }
};
// 开启定时器
const startTimer = () => {
  timerId = setInterval(() => {
    // 定时器的逻辑
    getTrendChart(1);
  }, 10000);
};
// 关闭定时器
const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};
onUnmounted(() => {
  // 组件卸载时清理 ECharts 实例
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  timerActive.value = false;
});
onBeforeUnmount(() => {
  // debugger;
});
onActivated(() => {
  // alert("进入页面了");
  console.log("生命周期-onActivated");

  // startTimer();
});
import { onBeforeRouteLeave } from "vue-router";
// 在路由离开前调用
onBeforeRouteLeave((to, from, next) => {
  console.log(to, from);
  timerActive.value = false;
  next();
});
watch(
  () => timerActive.value,
  newValue => {
    if (newValue) {
      startTimer();
    } else {
      stopTimer();
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.screenBox div {
  margin-right: 10px;
}
</style>
