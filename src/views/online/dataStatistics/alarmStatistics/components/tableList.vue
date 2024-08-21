<template>
  <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#bed6fb' }">
    <el-table-column v-for="item in tableHeader" :prop="item.prop" :label="item.label" :key="item.prop" />
  </el-table>
  <el-pagination
    v-model:current-page="params.pageNum"
    v-model:page-size="params.pageSize"
    :page-sizes="[10, 20, 30, 50]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { alarm_List } from "@/api/online/alarmStatistics";
// 报警列表
const total = ref(0);
let tableData = ref();
const tableHeader = [
  { prop: "pointName", label: " 测点名称" },
  { prop: "dataSrc", label: "数据来源" },
  { prop: "unit", label: "单位" },
  { prop: "type", label: "信号类型" },
  { prop: "name", label: "报警事件名称" },
  { prop: "value", label: "报警特征值" },
  /**
   * 信号类型 1 位移 2 速度 3 加速度 4 特征值
   */
  { prop: "standardType ", label: "信号类型" },
  { prop: "alarmStandard", label: "报警范围" },
  { prop: "alarmInfo", label: "报警描述信息" },
  /**
   * 报警类型:1 超上限、2 超下限、
   */
  { prop: "alarmType", label: "报警类型" },
  /**
   * 报警等级 1报警 2危险
   */
  { prop: "level", label: "报警等级" },
  { prop: "firstTime", label: "首次报警时间" },
  { prop: "latestTime", label: "结束报警时间" },
  { prop: "policyType", label: "策略类型" },
  { prop: "remark", label: "报警备注" }
];
let params = ref({
  pageNum: 1,
  pageSize: 10,
  startTime: "",
  endTime: ""
});
const getTableList = async () => {
  let res: any = await alarm_List(params.value);
  if (res.code == "200") {
    console.log(res);
    tableData.value = res.data.records;
    total.value = res.data.total;
  } else {
    // ElMessage.error(res?.message);
  }
};
const handleSizeChange = (val: number) => {
  params.value.pageSize = val;
  getTableList();
};
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val;
  getTableList();
};
getTableList();
</script>
<style scoped lang=""></style>
