<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="repairRecord">
// 维修记录
import { ref, reactive } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { repair_listPage } from "@/api/repairRecord";
// import { ElMessage } from "element-plus";
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
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="repair_listPage"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return repair_listPage(newParams);
};
// 枚举值
const options = reactive([
  { value: 0, label: "是" },
  { value: 1, label: "否" }
]);

// 表格配置项
const columns: any = reactive([
  { type: "index", label: "#", fixed: "left", width: 70 },
  { prop: "groupName", label: "班组名称", search: { el: "input" } },
  {
    prop: "isReplace",
    label: "激振器是否更换",
    enum: options,
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "number", label: "激振器编号", search: { el: "input" } },
  {
    prop: "replaceTime",
    label: "更换时间",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ""
    }
  },
  { prop: "replaceNumber", label: "更换编号", search: { el: "input" } },
  { prop: "replaceUser", label: "更换人", search: { el: "input" } },
  {
    prop: "startDateTime",
    label: "开始录入时间",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ""
    }
  },
  {
    prop: "endDateTime",
    label: "结束录入时间",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ""
    }
  },
  {
    prop: "startReplaceTime",
    label: "更换开始时间",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ""
    }
  },
  {
    prop: "endReplaceTime",
    label: "更换结束时间",
    search: {
      el: "date-picker",
      span: 1,
      props: { type: "datetime", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ""
    }
  }
]);
</script>
