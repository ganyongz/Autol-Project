<template>
  <div>
    <div class="screenBox" style="margin: 10px; text-align: left">
      <el-select v-model="timeSelect" class="m-2" placeholder="时间筛选" style="width: 200px" @change="handleSelect">
        <el-option v-for="item in timeOPtions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-if="timeSelect == '7'"
        v-model="customValue"
        type="datetimerange"
        range-separator="To"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        style="width: 300px"
      />
      <!-- <el-button type="primary">查询</el-button> -->
    </div>

    <div style="margin: 10px 25px; text-align: left">[趋势图]</div>
    <div v-if="chartData.length > 0" ref="chartRef" style="width: 100%; height: 400px"></div>
    <el-empty v-else description="暂无分析数据" />
  </div>
</template>

<script setup lang="ts" name="boxingtu">
import { ref, onMounted, onUnmounted, toRefs } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import { Diagram_trendChart } from "@/api/online/comprehensiveAnalysis";
import dayjs from "dayjs";
import { nextTick } from "vue";
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
  { value: "2", label: "最近一天" },
  { value: "3", label: "最近一周" },
  { value: "4", label: "最近一月" },
  { value: "5", label: "最近三月" },
  { value: "6", label: "最近半年" },
  { value: "7", label: "自定义" }
];
// 自定义时间
let customValue = ref();
const handleSelect = (val: any) => {
  switch (val) {
    case "1": //实时数据（最近5分钟）
      timeScreen.value[0] = dayjs().subtract(5, "minute").format("YYYY-MM-DD HH:mm:ss");
      timeScreen.value[1] = dayjs().format("YYYY-MM-DD HH:mm:ss");
      getTrendChart();
      break;
    case "2": //最近一天
      timeScreen.value[0] = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
      timeScreen.value[1] = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");
      getTrendChart();
      break;
    case "3": //最近一周
      timeScreen.value[0] = dayjs().startOf("week").format("YYYY-MM-DD HH:mm:ss");
      timeScreen.value[1] = dayjs().endOf("week").format("YYYY-MM-DD HH:mm:ss");
      getTrendChart();
      break;
    case "4": //最近一月
      timeScreen.value[0] = dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss");
      timeScreen.value[1] = dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss");
      getTrendChart();
      break;
    case "5": //最近三月
      timeScreen.value[0] = dayjs().subtract(90, "day").format("YYYY-MM-DD HH:mm:ss");
      timeScreen.value[1] = dayjs().format("YYYY-MM-DD HH:mm:ss");
      getTrendChart();
      break;
    case "6": // 最近半年
      timeScreen.value[0] = dayjs().subtract(180, "day").format("YYYY-MM-DD HH:mm:ss");
      timeScreen.value[1] = dayjs().format("YYYY-MM-DD HH:mm:ss");
      getTrendChart();
      break;

    default:
      break;
  }
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
            symbol: ["none", "none"],
            data: [
              {
                name: "预警值",
                yAxis: waringValue.value, // 预警值
                label: {
                  formatter: "{b}: {c}"
                },
                lineStyle: {
                  type: "solid", // 基准线样式为虚线
                  color: "yellow"
                }
              },
              {
                name: "危险值",
                yAxis: dangerValue.value, // 危险值
                label: {
                  formatter: "{b}: {c}"
                  // 不显示基准线名称
                  // show: true
                },
                lineStyle: {
                  type: "solid", // 基准线样式为虚线
                  color: "red"
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
const getTrendChart = async () => {
  let params = {
    pointId: stationId.value,
    startTime: timeScreen.value[0],
    endTime: timeScreen.value[1]
  };
  let res: any = await Diagram_trendChart(params);
  if (res.code == "200") {
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
onUnmounted(() => {
  if (chartInstance) {
    // 组件卸载时清理 ECharts 实例
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
.screenBox div {
  margin-right: 10px;
}
</style>
