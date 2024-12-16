<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
      <!-- 表格 header 按钮 -->
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="sportCheckLog">
// 维修记录
import { ref, reactive } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import { spotCheckLog_List } from "@/api/sportCheck/sportCheckLog";
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
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="spotCheckLog_List"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return spotCheckLog_List(newParams);
};
// 枚举值
const options = reactive([
  { value: 1, label: "风电设备" },
  { value: 2, label: "港口设备" },
  { value: 3, label: "食品设备" },
  { value: 4, label: "工程机械" },
  { value: 5, label: "矿山" },
  { value: 6, label: "水泥" }
]);
const equipStatusOptions = reactive([
  { value: 0, label: "未点检" },
  { value: 1, label: "异常" },
  { value: 2, label: "正常" },
  { value: 3, label: "上报维修" }
]);
const statusOptions = reactive([
  { value: 0, label: "未点检" },
  { value: 1, label: "已点检" },
  { value: 2, label: "超期未点检" },
  { value: 3, label: "已推送" }
]);

// 表格配置项
const columns: any = reactive([
  { type: "index", label: "#", fixed: "left", width: 70 },
  { prop: "equipRemark", label: "设备备注" },
  {
    prop: "classify",
    label: "设备分类",
    enum: options,
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "equipName", label: "设备名称", search: { el: "input" } },
  { prop: "code", label: "设备编码", search: { el: "input" } },
  { prop: "spotCheckItemRemark", label: "点检项备注" },
  { prop: "photo", label: "点检图" },
  { prop: "remark", label: "点检记录备注" },
  { prop: "spotCheckTime", label: "点检时间" },
  { prop: "timeOut", label: "超期时间/分" },
  { prop: "spotCheckPlanRemark", label: "点检任务备注" },
  { prop: "spotCheckPlanName", label: "点检任务名称", search: { el: "input" } },
  { prop: "createTime", label: "点检记录创建时间" },
  {
    prop: "equipStatus",
    label: "设备状态",
    enum: equipStatusOptions,
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "valueUnit", label: "点检项单位" },
  { prop: "text", label: "点检描述" },
  { prop: "value", label: "传感器数值" },
  {
    prop: "status",
    label: "点检状态",
    enum: statusOptions,
    fieldNames: { label: "label", value: "value" }
  }
]);
</script>
