<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增', {})">新增</el-button>
        <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加</el-button>
        <el-button v-if="false" type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        <el-button v-if="false" type="primary" plain @click="toDetail">To 子集详情页面</el-button>
        <el-button v-if="false" type="danger" :icon="Delete" plain @click="batchDelete(scope.selectedListIds)">
          批量删除
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.selectedListIds }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        <!-- 关联设备(弃用) -->
        <el-button v-if="false" type="primary" link :icon="Plus" @click="relevanceEquipment(scope.row)">关联设备</el-button>
        <el-button type="primary" link :icon="Plus" @click="afterSalesFun(scope.row)">售后</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
    <myDialog :title="detailParams.title" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <addEdit
          v-if="IsShowAdd"
          ref="addEditRoleRef"
          :row-data="rowData"
          :title="detailParams.title"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
    <!-- 关联设备 -->
    <myDialog title="关联设备" ref="myDialog2" draggable width="900px" :before-close="beforeClose2">
      <template #content>
        <addEquipment :key="equipmentKey" ref="addEquipmentRef" :tenant-id="userId"></addEquipment>
      </template>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" size="default" @click="submitEquipment">保存</el-button>
          <el-button size="default" @click="beforeClose2">取消</el-button>
        </div>
      </template>
    </myDialog>
    <!-- 售后 -->
    <myDialog title="售后文件" ref="myDialog3" draggable width="500px" :before-close="beforeClose3">
      <template #content>
        <afterSales :key="afterSalesKey" ref="afterSalesRef" :tenant-id="userId" @close-dialog="beforeClose3"></afterSales>
      </template>
    </myDialog>
  </div>
</template>

<script setup lang="tsx" name="TenantManagement">
// 租户管理
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, Plus } from "@element-plus/icons-vue";
import { exportUserInfo, BatchAddUser } from "@/api/modules/user";
import { Tenant_List, Tenant_delete, Tenant_saveTenantLocation } from "@/api/system/TenantManagement";
import addEdit from "@/views/system/TenantManagement/components/addEdit.vue";
import addEquipment from "@/views/system/TenantManagement/components/addEquipment.vue";
import afterSales from "@/views/system/TenantManagement/components/afterSales.vue";
const router = useRouter();
// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
};
onMounted(() => {
  proTable.value?.getTableList(); //估计没有也行
});
// ProTable 实例
const proTable = ref<ProTableInstance>();
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.records,
    total: data.total,
    pageNum: data.current,
    pageSize: data.size
  };
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getThresholdList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return Tenant_List(newParams);
};

// 自定义渲染表头（使用tsx语法）
// const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
//   return (
//     <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
//       {scope.column.label}
//     </el-button>
//   );
// };

// 表格配置项
const columns: any = reactive([
  { prop: "name", label: "租户名" },
  { prop: "platformName", label: "平台名称" },
  { prop: "expirationTime", label: "租户授权过期时间" },
  { prop: "cockpitMenuUrl", label: "驾驶舱菜单路径" },
  { prop: "afterContacts", label: "售后联系人" },
  { prop: "contactsPhone", label: "售后联系电话" },
  { prop: "logoUrl", label: "Logo图片路径" },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: any) => {
  await useHandleData(Tenant_delete, { id: params.id }, `删除【${params.name}】`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(Tenant_delete, id, "删除所选租户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: any) => {
  detailParams.value.title = "编辑";
  rowData.value = row;
  IsShowAdd.value = true;
  console.log(title, row);
  myDialog1.value.open();
};
// 新增、编辑
let rowData = ref();
import myDialog from "@/components/dialog/myDialog.vue";
const myDialog1 = ref();
const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const detailParams = ref({
  title: "新增"
});
const openDialog = (title: string, row: any) => {
  IsShowAdd.value = true;
  console.log(title, row);
  rowData.value = {};
  myDialog1.value.open();
};
const submitForm = () => {
  // 保存
  proTable.value?.getTableList();
  myDialog1.value.close();
  IsShowAdd.value = false;
};
const closeDialog = () => {
  // 取消
  myDialog1.value.close();
  IsShowAdd.value = false;
};
// 关联设备数据
let equipmentKey = ref(1);
let userId = ref("");
const addEquipmentRef = ref();
const myDialog2 = ref();
const beforeClose2 = () => {
  myDialog2.value.close();
};
const submitEquipment = async () => {
  let res: any = await Tenant_saveTenantLocation(addEquipmentRef.value.checkedObjs);
  if (res.code == "200") {
    ElMessage.success("绑定成功");
    myDialog2.value.close();
  } else {
    ElMessage.error(res?.message);
  }
};
// open
const relevanceEquipment = (val: any) => {
  userId.value = val.id;
  myDialog2.value.open();
  equipmentKey.value++;
};
// 售后
let afterSalesKey = ref(1);
const afterSalesRef = ref();
const myDialog3 = ref();
const afterSalesFun = (val: any) => {
  userId.value = val.id;
  myDialog3.value.open();
  afterSalesKey.value++;
};
const beforeClose3 = () => {
  myDialog3.value.close();
};
</script>
