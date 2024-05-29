<template>
  <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#bed6fb' }">
    <el-table-column v-for="item in tableHeader" :prop="item.prop" :label="item.label" :key="item.prop" />
  </el-table>
</template>

<script lang="ts" setup>
// 报警列表
const tableData = [];
const tableHeader = [
  { prop: "station", label: "测量位置/点" },
  { prop: "general", label: "报警概况" },
  { prop: "value", label: "报警值" },
  { prop: "type", label: "信号类型" },
  { prop: "standard", label: "报警策略标准" },
  { prop: "information", label: "报警信息" },
  { prop: "grade", label: "报警等级" },
  { prop: "startTime", label: "开始报警时间" },
  { prop: "endTime", label: "结束报警时间" },
  { prop: "state", label: "缺陷处理状态" },
  { prop: "time", label: "缺陷处理时间" }
];
</script>
<style scoped lang=""></style>
