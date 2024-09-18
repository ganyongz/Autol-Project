<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="SystemLog_logPage"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-select v-model="initParam.eventType" placeholder="检索" style="width: 240px" clearable>
          <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="systemLog">
// 系统日志
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { SystemLog_logPage } from "@/api/system/systemLog"; //系统日志

onMounted(() => {
  // proTable.value?.getTableList(); //估计没有也行
});
// ProTable 实例
const proTable = ref<ProTableInstance>();
const eventTypeOptions = [
  {
    value: "INFO",
    label: "信息"
  },
  {
    value: "SystemError",
    label: "系统错误日志"
  },
  {
    value: "LOGIN",
    label: "登录日志"
  },
  {
    value: "LOGOUT",
    label: "登出日志"
  },
  {
    value: "SystemUpdate",
    label: "系统数据修改记录日志"
  },
  {
    value: "LubTcp",
    label: "润滑泵Tcp通讯日志"
  }
];
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ eventType: "" });
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
// const getTableList = (params: any) => {
//   // let newParams = JSON.parse(JSON.stringify(params));
//   return SystemLog_logPage(params);
// };

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
  { prop: "clientIp", label: "ip" },
  // { prop: "platformName", label: "用户" },
  { prop: "userName", label: "姓名" },
  { prop: "timestamp", label: "时间" },
  { prop: "message", label: "信息" },
  {
    prop: "eventType",
    label: "日志类型",
    tag: true,
    enum: eventTypeOptions,
    fieldNames: { label: "label", value: "value" }
  }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};
</script>
