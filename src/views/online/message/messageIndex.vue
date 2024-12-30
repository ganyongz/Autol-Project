<template>
  <div class="table-box">
    <el-tabs v-model="activeName" @tab-change="tabChange">
      <el-tab-pane label="振动报警" name="1"> </el-tab-pane>
      <el-tab-pane label="润滑报警" name="2"> </el-tab-pane>
      <!-- <el-tab-pane label="油液" name="third"> </el-tab-pane> -->
    </el-tabs>
    <ProTable
      ref="proTable"
      :key="keyTable"
      :request-api="getTableList"
      :init-param="initParam"
      :columns="columns"
      :pagination="pagination"
      @darg-sort="sortTable"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="Operation" @click="lookFun(scope.row)"></el-button>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="ts" name="messageIndex">
import { ref, reactive } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ProTableInstance } from "@/components/ProTable/interface";
import { message_getRealTimeAlarm, message_setIsDispose1 } from "@/api/online/message";
import { useRoute, useRouter } from "vue-router";
import { Operation } from "@element-plus/icons-vue";
const router = useRouter();
const route = useRoute();
console.log(router, "router内容");
console.log(route, "route内容");
const activeName = ref("1");
let keyTable = ref(1);
// ProTable 实例
const proTable = ref<ProTableInstance>();
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
let initParam = reactive({ type: 1 });
const pagination = false;
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
// const dataCallback = (data: any) => {
//   return {
//     list: data
//   };
// };
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getThresholdList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return message_getRealTimeAlarm(newParams);
};
const eventTypeOptions = [
  {
    value: 1,
    label: "预警"
  },
  {
    value: 2,
    label: "危险"
  }
];
const lookFun = val => {
  ElMessageBox.confirm("是否标记为已读？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      let result: any = await message_setIsDispose1({ type: initParam.type, id: val.id });
      console.log(result);
      if (result.code == 200) {
        ElMessage({
          type: "success",
          message: "标记成功"
        });
        getTableList(initParam);
        keyTable.value += 1;
      } else {
        ElMessage({
          type: "error",
          message: "标记失败"
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      });
    });
};
// 表格配置项
let columns: any = reactive([
  { prop: "locationName", label: "报警位置" },
  { prop: "name", label: "报警名称" },
  { prop: "alarmStandard", label: "报警范围" },
  {
    prop: "level",
    label: "报警等级",
    tag: true,
    enum: eventTypeOptions,
    fieldNames: { label: "label", value: "value" }
  },
  { prop: "value", label: "报警值" },
  { prop: "unit", label: "报警单位" },
  { prop: "startTime", label: "报警开始时间" },
  { prop: "alarmDuration", label: "报警持续时间（分钟）" },
  { prop: "operation", label: "操作", fixed: "right", width: 120 }
]);
// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};
const tabChange = (val: any) => {
  console.log(val);
  if (val == 1) {
    columns = [
      { prop: "locationName", label: "报警位置" },
      { prop: "name", label: "报警名称" },
      { prop: "alarmStandard", label: "报警范围" },
      {
        prop: "level",
        label: "报警等级",
        tag: true,
        enum: eventTypeOptions,
        fieldNames: { label: "label", value: "value" }
      },
      { prop: "value", label: "报警值" },
      { prop: "unit", label: "报警单位" },
      { prop: "startTime", label: "报警开始时间" },
      { prop: "alarmDuration", label: "报警持续时间（分钟）" },
      { prop: "operation", label: "操作", fixed: "right", width: 120 }
    ];

    initParam.type = 1;
  } else {
    columns = [
      { prop: "locationName", label: "报警位置" },
      { prop: "alarmMsg", label: "报警信息" },
      { prop: "startTime", label: "报警开始时间" },
      { prop: "alarmDuration", label: "报警持续时间（分钟）" },
      { prop: "operation", label: "操作", fixed: "right", width: 120 }
    ];
    initParam.type = 2;
  }
  keyTable.value += 1;
};
</script>
<style scoped lang="scss"></style>
