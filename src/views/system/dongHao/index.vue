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
        <el-button type="primary" @click="synchronousData">同步数据</el-button>
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
    <!-- 同步数据 -->
    <el-dialog v-model="dialogFormVisible" title="配置项" width="500">
      <el-form ref="ruleFormRef" :model="form" :rules="rules">
        <el-form-item label="IP地址" prop="ip" :label-width="formLabelWidth">
          <el-input v-model="form.ip" autocomplete="off" />
        </el-form-item>
        <el-form-item label="端口号" prop="port" :label-width="formLabelWidth">
          <el-input v-model="form.port" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="saveForm(ruleFormRef)"> 保存 </el-button>
        <el-button @click="closeForm(ruleFormRef)">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="dataDongHao">
// 东昊数据
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { EditPen } from "@element-plus/icons-vue";
import { move_Page, move_syncInstrumentList } from "@/api/system/dongHao";
import addEdit from "@/views/system/dongHao/components/edit.vue";
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
const MyProps = [
  { label: "是", value: true },
  { label: "否", value: false }
];
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getThresholdList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return move_Page(newParams);
};

// 表格配置项
const columns: any = reactive([
  { prop: "serial", label: "仪器序列号" },
  { prop: "name", label: "仪器名称" },
  { prop: "type", label: "仪器类型" },
  { prop: "ip", label: "仪器IP" },
  { prop: "battery", label: "电池电量" },
  {
    prop: "canNtp",
    label: "是否支持NTP",
    enum: MyProps,
    fieldNames: { label: "label", value: "value" }
  },
  {
    prop: "joinNtp",
    label: "是否参与NTP",
    enum: MyProps,
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "serviceSource", label: "数据源" },
  { prop: "samplingTime", label: "采样工作时长（分钟）" },
  { prop: "stopTime", label: "停止时长（分钟）" },
  { prop: "operation", label: "操作", fixed: "right", width: 150 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
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
// 同步数据
const ruleFormRef = ref();
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";

const form = reactive({
  ip: "",
  port: ""
});
const rules = reactive({
  ip: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
  port: [{ required: true, message: "请输入端口号", trigger: "blur" }]
});
// 同步数据
const synchronousData = () => {
  dialogFormVisible.value = true;
};
const saveForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await move_syncInstrumentList(form);
      if (res.code == "200") {
        ElMessage.success("保存成功");
        dialogFormVisible.value = false;
      } else {
        ElMessage.error(res?.message);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const closeForm = (formEl: any) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogFormVisible.value = false;
};
</script>
