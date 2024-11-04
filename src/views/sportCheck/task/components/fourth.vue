<template>
  <div>
    <!-- 巡检项绑定 -->
    <el-table :data="tableData" ref="multipleTableRef" height="500" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="content" label="巡检内容" />
      <el-table-column prop="needPhoto" label="是否需要上传照片">
        <template #default="scope">
          <span v-if="scope.row.needPhoto == 0">不需要</span>
          <span v-if="scope.row.needPhoto == 1">需要</span>
        </template>
      </el-table-column>
      <el-table-column prop="needText" label="是否需要上传文本">
        <template #default="scope">
          <span v-if="scope.row.needText == 0">不需要</span>
          <span v-if="scope.row.needText == 1">需要</span>
        </template>
      </el-table-column>
      <el-table-column prop="needValue" label="是否需要上传输入值">
        <template #default="scope">
          <span v-if="scope.row.needValue == 0">不需要</span>
          <span v-if="scope.row.needValue == 1">需要</span>
        </template>
      </el-table-column>
      <el-table-column prop="valueUnit" label="数值单位" />
      <el-table-column prop="remark" label="备注" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from "vue";
import { ElMessage, ElTable } from "element-plus";
import { configuration_List } from "@/api/sportCheck/configuration";
const props = defineProps({
  spotCheckItemIds: {
    type: Array,
    default: () => []
  }
});
let { spotCheckItemIds } = toRefs(props);
const multipleTableRef = ref();
let multipleSelection = ref();
// tableData
let tableData = ref([]);
onMounted(async () => {
  await getUserList(params);
  // 初始化时设置默认选中的行
  if (multipleTableRef.value) {
    spotCheckItemIds.value.forEach(id => {
      const row = tableData.value.find((row: any) => row.id === id);
      if (row) {
        multipleTableRef.value!.toggleRowSelection(row, true);
      }
    });
  }
});
let params = reactive({
  pageNum: 1,
  pageSize: 1000
});
const getUserList = async (params: any) => {
  const res: any = await configuration_List(params);
  if (res.code == "200") {
    tableData.value = res.data.records;
    total.value = res.data.total;
  } else {
    ElMessage.error(res?.message);
  }
};
// 分页
const total = ref(0);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
defineExpose({ multipleSelection });
</script>
<style scoped></style>
