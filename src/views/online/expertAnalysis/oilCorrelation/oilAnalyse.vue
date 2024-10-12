<template>
  <div class="main-box">
    <el-tree
      ref="treeRef"
      style="width: 240px; margin-right: 10px"
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      :default-expanded-keys="defaultCheckedKeys"
      :current-node-key="partId"
      :highlight-current="true"
      @node-click="handleNodeClick"
    />
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <div style="margin: 5px 0">
          日期：<el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-value="defaultDateRange"
            @change="changeDate"
          />
        </div>

        <div style="display: flex; height: 350px">
          <div style="flex: 1; margin-right: 10px">
            <qualityChart
              :chart-data="chartData"
              :part-id="partId"
              :start-time="initParam.startTime"
              :end-time="initParam.endTime"
              :key="show1"
            />
          </div>
          <div style="flex: 1">
            <granularityChart
              :chart-data="chartData"
              :part-id="partId"
              :start-time="initParam.startTime"
              :end-time="initParam.endTime"
              :key="show1"
            />
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <ProTable
        :key="keyTable"
        ref="proTable"
        highlight-current-row
        :init-param="initParam"
        :request-api="getTableList"
        :columns="columns"
        :data-callback="dataCallback"
      >
      </ProTable>
      <UserDrawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>
<script setup lang="tsx" name="oilAnalyse">
// 油液分析
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { oil_pageList } from "@/api/online/oilAnalyse";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance } from "@/components/ProTable/interface";
import qualityChart from "@/views/online/expertAnalysis/oilCorrelation/qualityChart.vue";
import granularityChart from "@/views/online/expertAnalysis/oilCorrelation/granularityChart.vue";
import dayjs from "dayjs";
import { oil_hisData } from "@/api/online/oilAnalyse";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route, "参数来了");
let defaultCheckedKeys = ref();
let partId = ref();
partId.value = route.query?.partId ? route.query?.partId : sessionStorage.getItem("partID");
defaultCheckedKeys.value = partId?.value ? [partId?.value] : [];

// ProTable 实例
const proTable = ref<ProTableInstance>();
// 初始化的请求参数
let initParam = ref({ partId: "134", startTime: "", endTime: "" });
initParam.value.startTime = dayjs().subtract(1, "day").format("YYYY-MM-DD");
initParam.value.endTime = dayjs().format("YYYY-MM-DD");
let keyTable = ref(1);
// 设置默认日期段为昨天到今天
const defaultDateRange = ref([dayjs().subtract(1, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")]);
// 绑定的日期范围模型
const dateRange = ref(defaultDateRange.value);
// 改变日期
const changeDate = (val: any) => {
  initParam.value.startTime = dayjs(val[0]).format("YYYY-MM-DD");
  initParam.value.endTime = dayjs(val[1]).format("YYYY-MM-DD");
  chartData.value = {};
  keyTable.value += 1;
};
// 表格配置项
const columns: any = reactive([
  { type: "index", label: "#", width: 80 },
  { prop: "dataTime", label: "时间", width: 220 },
  { prop: "oilTemperature", label: "油液温度" },
  { prop: "waterActivity", label: "水活性" },
  { prop: "moistureContent", label: "含水量" },
  { prop: "viscosity", label: "动力粘度", width: 180 },
  { prop: "density", label: "密度" },
  { prop: "dielectricConstant", label: "介电常数" },
  { prop: "contaminationStandard", label: "污染等级" },
  { prop: "ironParticlesConcentration", label: "铁磁浓度" },
  { prop: "notIronParticlesConcentration", label: "非铁磁浓度" }
]);
// 获取用户角色字典
onMounted(() => {
  // proTable.value?.getTableList(); //估计没有也行
  // getUserRoleDict()
});
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
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="oil_pageList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return oil_pageList(newParams);
};
watch(
  () => proTable.value?.radio,
  () => proTable.value?.radio && ElMessage.success(`选中 id 为【${proTable.value?.radio}】的数据`)
);
// 树结构
import { getLocationTree } from "@/api/system/functionPosition";
interface Tree {
  label: string;
  type: Number;
  id: String;
  children?: Tree[];
}
const handleNodeClick = (data: Tree) => {
  // 1功能位置，2设备，3部件，4测点;只有当type为3时才查询
  if (data?.type == 3) {
    sessionStorage.setItem("deviceID", data.id as any);
    partId.value = data.id;
    initParam.value.partId = data.id as any;
    chartData.value = {};
    getTrendChart(); //获取趋势图
    keyTable.value += 1;
  }
};
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
let treeData = ref();
let caidan = ref(true);
// 获取菜单列表
const getEquipTreeList = async () => {
  caidan.value = false;
  // 1功能位置，2设备，3部件，4测点
  let res: any = await getLocationTree({ type: 3, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.message);
  }
};
// 获取趋势图
let show1 = ref(1);
let chartData = ref();
const getTrendChart = async () => {
  let params = {
    partId: partId?.value,
    startTime: initParam.value.startTime,
    endTime: initParam.value.endTime
  };
  chartData.value = null;
  show1.value += 1; //待优化 （公共拦截导致 进不到 else）
  let res: any = await oil_hisData(params);
  if (res.code == "200") {
    chartData.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
  show1.value += 1;
};
// 调用
getTrendChart(); //获取趋势图
getEquipTreeList();
</script>
<style scoped>
.custom-tree-node {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
