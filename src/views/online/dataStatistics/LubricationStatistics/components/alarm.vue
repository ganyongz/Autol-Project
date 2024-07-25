<template>
  <div class="box">
    <p>近30日趋势统计</p>
    <div id="main2" ref="chartContainer" style="width: 100vw; height: 300px"></div>
    <!-- 表格条件搜索 -->
    <div class="flex flex-wrap gap-4 items-center">
      <el-select v-model="conditionVal" placeholder="报警状态" style="width: 240px" clearable>
        <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="timeSearch"
        type="daterange"
        range-separator="至"
        start-placeholder="Start date"
        end-placeholder="End date"
        clearable
      />
      <el-button type="primary">查询</el-button>
      <el-button type="success">导出表格</el-button>
      <el-button type="danger">删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" height="500px">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="开泵时间" />
      <el-table-column prop="state" label="关泵时间" />
      <el-table-column prop="time" label="润滑点" />
      <el-table-column prop="time" label="润滑时常(s)" />
      <el-table-column prop="time" label="润滑油量(ml)" />
      <el-table-column prop="time" label="润滑状态" />
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts" name="alarm">
// 报警记录
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
const chartContainer = ref();
// 表格条件搜索
const conditionVal = ref();
const conditionOptions = [
  { value: 1, label: "恢复" },
  { value: 2, label: "报警" }
];
const timeSearch = ref("");

onMounted(() => {
  let chartContainer = echarts.init(document.getElementById("main2"));
  option && chartContainer.setOption(option);
});

// 准备日期数据
let dates = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04"];

// 准备报警次数数据
let warningCounts = [5, 10, 15, 20];

// 准备修复次数数据
let repairCounts = [8, 7, 6, 5];

// 指定图表的配置项和数据
let option = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {
    data: ["报警次数", "修复次数"]
  },
  xAxis: {
    type: "category",
    data: dates
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "报警次数",
      type: "line",
      data: warningCounts
    },
    {
      name: "修复次数",
      type: "line",
      data: repairCounts
    }
  ]
};
// table 列表
let tableData = ref([]);
// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
}
</style>
