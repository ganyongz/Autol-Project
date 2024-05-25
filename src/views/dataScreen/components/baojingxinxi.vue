<template>
  <div style="text-align: center">
    <el-row :gutter="20">
      <el-col :span="11"><div id="main" style="width: 200px; height: 200px" /></el-col>
      <el-col :span="11"><div id="main2" style="width: 200px; height: 200px" /></el-col>
    </el-row>

    <el-table :data="tableData" style="width: 90%" height="250">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="name" label="设备名称" />
      <el-table-column prop="state" label="状态" />
      <el-table-column prop="time" label="时间" />
    </el-table>
  </div>
</template>
<script lang="ts" setup name="baojingxinxi">
import { onMounted } from "vue";
import * as echarts from "echarts";

onMounted(() => {
  let chartDom = document.getElementById("main");
  let myChart = echarts.init(chartDom);
  let option: any;
  option = {
    tooltip: {
      trigger: "item",
      show: false
    },
    //标题
    title: {
      text: 1, //主标题文本
      subtext: "报警设备",
      left: "center",
      top: "43%",
      textStyle: {
        fontSize: 18,
        color: "yellow",
        align: "center"
      },
      subtextStyle: {
        fontFamily: "微软雅黑",
        fontSize: 12,
        color: "yellow"
      }
    },
    legend: {
      top: "5%",
      left: "center"
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: [{ value: 1048, itemStyle: { color: "#fac858" } }]
      }
    ]
  };
  option && myChart.setOption(option);
  // 饼图2
  let chartDom2 = document.getElementById("main2");
  let myChart2 = echarts.init(chartDom2);
  let option2: any;
  option2 = {
    tooltip: {
      trigger: "item",
      show: false
    },
    //标题
    title: {
      text: 0,
      subtext: "危险设备",
      left: "center",
      top: "43%",
      textStyle: {
        fontSize: 18,
        color: "#e0504b",
        align: "center"
      },
      subtextStyle: {
        fontFamily: "微软雅黑",
        fontSize: 12,
        color: "#e0504b"
      }
    },
    legend: {
      top: "5%",
      left: "center"
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: [{ value: 1048, itemStyle: { color: "#e0504b" } }]
      }
    ]
  };
  option2 && myChart2.setOption(option2);
});
// 表格
const tableData = [
  {
    name: "#1号泵",
    state: "正常",
    time: "2024-05--25 13:33"
  },
  {
    name: "#2号泵",
    state: "正常",
    time: "2024-05--25 13:22"
  },
  {
    name: "#3号泵",
    state: "关停",
    time: "2024-05--25 13:12"
  },
  {
    name: "#4号泵",
    state: "正常",
    time: "2024-05--25 13:24"
  },
  {
    name: "#5号泵",
    state: "正常",
    time: "2024-05--25 13:22"
  }
];
</script>
<style scoped lang="scss">
.el-table {
  --el-table-border-color: green;
  --el-table-border: none;
  --el-table-text-color: #bdbdbe;
  --el-table-header-text-color: #bdbdbe;
  --el-table-row-hover-bg-color: transparent;
  --el-table-current-row-bg-color: transparent;
  --el-table-header-bg-color: rgb(3 76 106 / 100%);
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
}
</style>
