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
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('添加巡检项')">添加巡检项</el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('详情', scope.row)">详情</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <myDialog :title="detailParams.title" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <addEdit
          v-if="IsShowAdd"
          ref="addEditRef"
          :row-id="rowId"
          :title="detailParams.title"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
  </div>
</template>

<script setup lang="tsx" name="configurationIndex">
// 巡检项配置
import { ref, reactive, watch } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { configuration_List, configuration_deleteById } from "@/api/sportCheck/configuration";
import addEdit from "@/views/sportCheck/configuration/components/addEdit.vue";
import myDialog from "@/components/dialog/myDialog.vue";
// ProTable 实例
const proTable = ref<ProTableInstance>();
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});
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
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="configuration_List"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return configuration_List(newParams);
};
// 枚举值
const options = reactive([
  { value: 0, label: "不需要" },
  { value: 1, label: "需要" }
]);

// 表格配置项
const columns: any = reactive([
  { type: "index", label: "#", fixed: "left", width: 70 },
  { prop: "content", label: "巡检内容" },
  {
    prop: "needPhoto",
    label: "是否需要上传照片",
    enum: options,
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "needText",
    label: "是否需要上传文本",
    enum: options,
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "needValue",
    label: "是否需要上传输入值",
    enum: options,
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "valueUnit", label: "数值单位" },
  { prop: "remark", label: "备注" },
  { prop: "operation", label: "操作", fixed: "right", width: 240 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除
const deleteAccount = async (params: any) => {
  await useHandleData(configuration_deleteById, { id: params.id }, `删除【${params.content}】`);
  proTable.value?.getTableList();
};

// 打开(新增、查看、编辑)
const openDrawer = (title: string, row: any) => {
  detailParams.value.title = title;
  rowId.value = row?.id;
  IsShowAdd.value = true;
  console.log(title, row);
  myDialog1.value.open();
};
// 新增、编辑
let rowId = ref("");
const myDialog1 = ref();
const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const detailParams = ref({
  title: "新增"
});
const openDialog = (title: string) => {
  IsShowAdd.value = true;
  detailParams.value.title = title;
  rowId.value = "";
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
let multipleSelection = ref();
watch(
  () => proTable.value?.radio,
  newVal => {
    multipleSelection.value = newVal;
  }
);
defineExpose({ multipleSelection });
</script>
