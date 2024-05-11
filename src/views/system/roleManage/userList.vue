<template>
  <div>
    <div class="screenAdd">
      <el-select v-model="params.type" placeholder="请选择用户类型" style="width: 240px; margin-left: 20px" class="mRight">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="params.userName" style="width: 240px" class="mRight" placeholder="请输入用户名" />
      <el-input v-model="params.realName" style="width: 240px" class="mRight" placeholder="请输入真实姓名" />
      <el-input v-model="params.phone" style="width: 240px" class="mRight" placeholder="请输入电话号" />
      <el-button type="primary" round @click="search">查询</el-button>
    </div>

    <el-table :data="tableData" ref="multipleTableRef" height="500" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="registerTime" label="注册时间" />
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <span v-if="scope.row.type == '0'">普通用户</span>
          <span v-else>系统用户</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts" name="userlist">
import { ref, reactive, onBeforeMount, toRefs } from "vue";
import { ElMessage, ElTable } from "element-plus";
// import { getUserListByPage } from "@/api/system/user";
import { noBindRoleUserPage } from "@/api/system/roleManage";
const props = defineProps({
  roleId: {
    type: String,
    default: ""
  }
});
const { roleId } = toRefs(props);
const multipleTableRef = ref();
let multipleSelection = ref();
const options = [
  { label: "普通用户", value: 0 },
  { label: "系统用户", value: 1 }
];
// tableData
let tableData = ref([]);
onBeforeMount(() => {
  getUserList(params);
});
let params = reactive({
  type: 0,
  userName: "",
  realName: "",
  phone: "",
  pageNum: 1,
  pageSize: 10,
  roleId: roleId.value
});
const getUserList = async (params: any) => {
  const res: any = await noBindRoleUserPage(params);
  if (res.code == "200") {
    tableData.value = res.data.records;
    total.value = res.data.total;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 查询
const search = () => {
  params.pageNum = 1;
  params.pageSize = 10;
  getUserList(params);
};
// 分页
const total = ref(0);
const handleSizeChange = (val: number) => {
  //每页数量
  params.pageNum = 1;
  params.pageSize = val;
  getUserList(params);
};
const handleCurrentChange = (val: number) => {
  // 页码
  params.pageNum = val;
  getUserList(params);
};
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
defineExpose({ multipleSelection });
</script>

<style scoped>
.screenAdd {
  height: auto;
  margin-bottom: 20px;
  line-height: auto;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
.mRight {
  margin-right: 20px;
  border-radius: 50%;
}
</style>
