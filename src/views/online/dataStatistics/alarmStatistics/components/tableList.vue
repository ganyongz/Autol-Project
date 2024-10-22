<template>
  <el-table :data="tableData" style="width: 100%" :header-cell-style="{ backgroundColor: '#bed6fb' }">
    <el-table-column v-for="item in tableHeader" :prop="item.prop" :label="item.label" :key="item.prop" show-overflow-tooltip />
    <el-table-column prop="level" label="报警等级">
      <template #default="scope">
        <span>{{ scope.row.level == 1 ? "报警" : "危险" }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="alarmType" label="报警类型">
      <template #default="scope">
        <span>{{ scope.row.level == 1 ? "超上限" : "超下限" }}</span>
      </template>
    </el-table-column>
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

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { alarm_List } from "@/api/online/alarmStatistics";
import { ElMessage } from "element-plus";
const props = defineProps({
  nodeType: {
    type: Number
  },
  nodeId: {
    type: String
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  }
});
let { nodeType, nodeId, startTime, endTime } = toRefs(props);
console.log(startTime?.value, endTime?.value);

// 报警列表
const total = ref(0);
let tableData = ref();
const tableHeader = [
  { prop: "pointName", label: " 测点名称" },
  { prop: "name", label: "报警事件名称" },
  { prop: "value", label: "报警特征值" },
  /**
   * 信号类型 1 位移 2 速度 3 加速度 4 特征值
   */
  // { prop: "standardType ", label: "信号类型" },
  { prop: "alarmStandard", label: "报警范围" },
  { prop: "alarmInfo", label: "报警描述信息" },
  /**
   * 报警类型:1 超上限、2 超下限、
   */
  /**
   * 报警等级 1报警 2危险
   */
  { prop: "firstTime", label: "首次报警时间" },
  { prop: "latestTime", label: "结束报警时间" }
];
let params = ref({
  pageNum: 1,
  pageSize: 10,
  startTime: startTime?.value,
  endTime: endTime?.value,
  id: nodeId?.value,
  idType: nodeType?.value
});
const getTableList = async () => {
  if (nodeId?.value) {
    let res: any = await alarm_List(params.value);
    if (res.code == "200") {
      tableData.value = res.data.records;
      total.value = res.data.total;
    } else {
      ElMessage.error(res?.message);
    }
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
