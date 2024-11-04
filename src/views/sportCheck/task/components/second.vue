<template>
  <div>
    <!-- 点检周期绑定 -->
    <el-table :data="tableData" ref="multipleTableRef" height="500" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="周期名称" />
      <el-table-column prop="regulation" label="规则">
        <template #default="scope">
          <span v-if="scope.row.regulation == 0">跳过周六周日</span>
          <span v-if="scope.row.regulation == 1">本地节假日配置 + 自动跳过周六日</span>
          <span v-if="scope.row.regulation == 2">全年推送</span>
        </template>
      </el-table-column>
      <el-table-column prop="timeSpan" label="任务时间间隔（分）" />
      <el-table-column prop="startTime" label="周期开始时间" />
      <el-table-column prop="endTime" label="周期结束时间" />
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <span v-if="scope.row.type == '0'">普通用户</span>
          <span v-else>系统用户</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from "vue";
import { ElMessage, ElTable } from "element-plus";
import { spotCheckCycle_List } from "@/api/sportCheck/spotCheckCycle";
const props = defineProps({
  spotCheckCycleId: {
    type: String,
    default: ""
  }
});
let { spotCheckCycleId } = toRefs(props);
console.log(spotCheckCycleId.value);

const multipleTableRef = ref();
let multipleSelection = ref();
let tableData = ref([]);

// 组件挂载后设置默认勾选
onMounted(async () => {
  await getUserList(params);
  // 初始化时设置默认选中的行
  if (multipleTableRef.value) {
    // multipleTableRef.value.toggleAllSelection();
    // spotCheckCycleId.value.forEach(id => {
    const row = tableData.value.find((row: any) => row.id === spotCheckCycleId.value);
    if (row) {
      multipleTableRef.value!.toggleRowSelection(row, true);
    }
    // });
  }
});
let params = reactive({
  pageNum: 1,
  pageSize: 1000
});
const getUserList = async (params: any) => {
  const res: any = await spotCheckCycle_List(params);
  if (res.code == "200") {
    tableData.value = res.data.records;
    total.value = res.data.total;
  } else {
    ElMessage.error(res?.message);
  }
};
// 分页
const total = ref(0);
const handleSelectionChange = (selection: any) => {
  if (selection.length > 1) {
    let del_row = selection.shift();
    multipleTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
  }
  multipleSelection.value = selection;
};
defineExpose({ multipleSelection });
</script>
<style scoped lang="scss">
/* 隐藏全选按钮 */
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
