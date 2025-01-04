<template>
  <div style="height: calc(100vh - 11rem); padding: 10px; overflow: auto; background-color: var(--el-bg-color)">
    <!-- 菜单管理 default-expand-all -->
    <el-button type="primary" @click="addRootMenu" style="margin-bottom: 5px">新增菜单</el-button>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="title" label="菜单名称" />
      <el-table-column prop="url" label="菜单路由" />
      <el-table-column prop="icon" label="图标" />
      <el-table-column prop="iconType" label="菜单/按钮">
        <template #default="scope">
          <span v-if="scope.row.iconType == '1'" style="color: #009688">按钮</span>
          <span v-else>菜单</span>
        </template>
      </el-table-column>
      <el-table-column prop="isHide" label="状态">
        <template #default="scope">
          <span v-if="scope.row.isHide == true"> 禁用 </span>
          <span v-else>启用</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="level" label="等级"></el-table-column> -->
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column fixed="right" label="操作" width="220">
        <template #default="scope">
          <el-button link type="primary" @click="edit(scope.row)"> 编辑 </el-button>
          <el-button link type="primary" @click="addLevel(scope.row)"> 新增下级 </el-button>
          <el-button link type="danger" @click="deleteFun([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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

<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import addEdit from "@/views/system/menuMange/addEdit.vue";
import { getMenuList, deleteByIds } from "@/api/system/menuMange";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";

let tableData = ref([]);
const addLevel = (row: any) => {
  rowData.value = row;
  dialogVisible.value = true;
  title.value = "新增下级";
};
onBeforeMount(() => {
  getMenuListFun();
});
// 新增
const dialogVisible = ref(false);
const title = ref("新增");
const addRootMenu = () => {
  rowData.value = {};
  dialogVisible.value = true; //打开
  title.value = "新增";
};
const handleDialogClose = () => {
  dialogVisible.value = false; //关闭
};
// 保存
const submitEvent = () => {
  dialogVisible.value = false;
  getMenuListFun();
};
// 编辑
const rowData = ref();
const edit = (row: any) => {
  rowData.value = row;
  dialogVisible.value = true;
  title.value = "编辑";
};
// 获取菜单列表
// const internalInstance = getCurrentInstance();
const getMenuListFun = async () => {
  let res: any = await getMenuList();
  if (res.code == "200") {
    let dataArr = res.data;
    if (dataArr.length > 0) {
      handleObj(dataArr);
    }
  } else {
    ElMessage.error(res?.message);
  }
};
// 递归处理节点
const handleObj = (data: any) => {
  tableData.value = data.map((item: any | never) => {
    if (item.buttons !== null && item.buttons.length) {
      item.children = [...item.children, ...item.buttons];
    }
    if (item.children !== null && item.children.length && !item?.children.some((item: any) => item.iconType == 1)) {
      handleObj(item.children);
    }
    return item;
  });
  // console.log(tableData.value, "菜单table");
};
// 删除
const deleteFun = async (id: any) => {
  await useHandleData(deleteByIds, id, `删除`);
  getMenuListFun();
};
</script>
<style scoped lang="scss">
:deep(.el-main) {
  background-color: var(--el-bg-color);
}
</style>
