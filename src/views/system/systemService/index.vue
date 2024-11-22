<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :radios="radioId"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增', {})">新增</el-button>
        <!-- <el-button type="danger" :icon="Delete" plain @click="batchDelete(scope.selectedListIds)"> 批量删除 </el-button> -->
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link @click="opened(scope.row)">开启服务</el-button>
        <el-button type="danger" link @click="stoped(scope.row)">停止服务</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <myDialog :title="title" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <add-edit
          v-if="IsShowAdd"
          ref="addEditRoleRef"
          :row-data="rowData"
          :title="title"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
  </div>
</template>

<script setup lang="tsx" name="Service">
// 服务监控
import { ref, reactive, watch, toRefs } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import myDialog from "@/components/dialog/myDialog.vue";
import addEdit from "@/views/system/systemService/components/addEdit.vue";
import {
  service_serviceList,
  service_deleteServiceById,
  service_stopService,
  service_startService
} from "@/api/system/systemService";
const props = defineProps({
  pointDetail: {
    type: Object,
    default: null
  }
});
const { pointDetail } = toRefs(props);
// 新增和编辑 字段
let title = ref("新增");
let rowData = ref();
const myDialog1 = ref();
const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const openDrawer = (title1: string, row: any) => {
  IsShowAdd.value = true;
  title.value = title1;
  if (title1 == "新增") {
    rowData.value = {};
  } else {
    rowData.value = row;
  }

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
// ProTable 实例
const proTable = ref<ProTableInstance>();
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data,
    total: data.total,
    pageNum: data.current,
    pageSize: data.size
  };
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="service_serviceList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return service_serviceList(newParams);
};
const MyProps = [
  { label: "自动", value: 1 },
  { label: "手动", value: 2 }
];
const monitorModelProps = [
  { label: "windows命令", value: 1 },
  { label: "http", value: 2 }
];
const statusProps = [
  { label: "正常", value: 0 },
  { label: "异常", value: 1 }
];
// 表格配置项
const columns: any = reactive([
  { type: "index", label: "#", width: 80 },
  { prop: "serviceName", label: "服务名" },
  {
    prop: "runModel",
    label: "运行模式",
    enum: MyProps,
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "monitorModel",
    label: "监控模式",
    enum: monitorModelProps,
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "monitorUrl", label: "http监控地址" },
  {
    prop: "status",
    label: "状态",
    enum: statusProps,
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "description", label: "备注信息" },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);
// 批量删除
// const batchDelete = async (id: string[]) => {
//   console.log(id);
//   // await useHandleData(Tenant_delete, id, "删除所选租户信息");
//   proTable.value?.clearSelection();
//   proTable.value?.getTableList();
// };
// 删除
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage, ElMessageBox } from "element-plus";
const deleteAccount = async (params: any) => {
  await useHandleData(service_deleteServiceById, { id: params.id }, `删除【${params.serviceName}】`);
  proTable.value?.getTableList();
};
const opened = val => {
  ElMessageBox.confirm("开启服务?", "提示", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning"
  }).then(async () => {
    let res: any = await service_startService({ serviceName: val.serviceName });
    if (res.code == 200) {
      proTable.value?.getTableList();
      ElMessage({
        type: "success",
        message: "已开启"
      });
    } else {
      ElMessage.error(res?.message);
    }
  });
};
const stoped = async val => {
  ElMessageBox.confirm("关闭服务?", "提示", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning"
  }).then(async () => {
    let res: any = await service_stopService({ serviceName: val.serviceName });
    if (res.code == 200) {
      proTable.value?.getTableList();
      ElMessage({
        type: "success",
        message: "已关闭"
      });
    } else {
      ElMessage.error(res?.message);
    }
  });
};
let radioId = ref("");
watch(
  () => proTable.value?.radio,
  () => {
    radioId.value = proTable.value?.radio ? proTable.value.radio : pointDetail?.value.bindServerPointId;
  },
  { deep: true, immediate: true }
);
// 暴露
defineExpose({ radioId });
</script>
