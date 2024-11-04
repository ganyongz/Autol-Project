<template>
  <div>
    <!-- 点检人绑定 -->
    <el-table :data="tableData" ref="multipleTableRef" height="500" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column prop="phone" label="手机号" />
      <!-- <el-table-column prop="email" label="邮箱" /> -->
      <el-table-column prop="registerTime" label="注册时间" />
      <!-- <el-table-column prop="" label="看板" /> -->
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
import { getUserListByPage } from "@/api/system/user";
const props = defineProps({
  userIds: {
    type: Array,
    default: () => []
  }
});
let { userIds } = toRefs(props);
const multipleTableRef = ref();
let multipleSelection = ref();
// tableData
let tableData = ref([]);
onMounted(async () => {
  await getUserList(params);
  // 初始化时设置默认选中的行
  if (multipleTableRef.value) {
    userIds.value.forEach(id => {
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
  const res: any = await getUserListByPage(params);
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
