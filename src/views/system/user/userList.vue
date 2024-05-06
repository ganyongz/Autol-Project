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
      <el-button type="primary" round @click="addUser">新增</el-button>
    </div>

    <el-table :data="tableData" height="500" style="width: 100%">
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
      <el-table-column fixed="right" label="操作" width="220">
        <template #default="scope">
          <el-button link type="primary" @click="handleClick(scope.row)"> 编辑 </el-button>
          <el-button link type="primary">重置密码</el-button>
          <el-button link type="danger" @click="deleteFun([scope.row.id])">删除</el-button>
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
    <addEdit
      :visible="dialogVisible"
      :dynamic-title="title"
      :row-data="rowData"
      @close-dialog="handleDialogClose"
      @submit-form="submitEvent"
      v-if="dialogVisible"
    />
  </div>
</template>

<script setup lang="ts" name="userlist">
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getUserListByPage, deleteUserByIds } from "@/api/system/user";
import addEdit from "@/views/system/user/addEdit.vue";
// 新增
const dialogVisible = ref(false);
const title = ref("新增");
const addUser = () => {
  dialogVisible.value = true; //打开
  title.value = "新增";
};
const handleDialogClose = () => {
  dialogVisible.value = false; //关闭
};
// 保存
const submitEvent = () => {
  dialogVisible.value = false;
  search();
};

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
  pageSize: 10
});
const getUserList = async (params: any) => {
  const res: any = await getUserListByPage(params);
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
// 操作
const rowData = ref();
const handleClick = (row: any) => {
  rowData.value = row;
  console.log(rowData.value, "看看数据", row);
  dialogVisible.value = true;
  title.value = "编辑";
};
// 删除
const deleteFun = (ids: any) => {
  ElMessageBox.confirm("是否确认删除?", "提示", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning"
  }).then(async () => {
    const res: any = await deleteUserByIds(ids);
    if (res.code == "200") {
      ElMessage.success("删除成功");
      params.pageNum = 1;
      getUserList(params);
    } else {
      ElMessage.error(res?.mssage);
    }
  });
};
// 分页
const total = ref(0);
const handleSizeChange = (val: number) => {
  //每页数量
  // console.log(`${val} items per page`);
  params.pageNum = 1;
  params.pageSize = val;
  getUserList(params);
};
const handleCurrentChange = (val: number) => {
  // 页码
  params.pageNum = val;
  getUserList(params);
};
</script>

<style scoped>
.screenAdd {
  height: 60px;
  margin-bottom: 20px;
  line-height: 60px;
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
