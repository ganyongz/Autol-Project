<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="240px" style="height: 1000px; margin-right: 10px; background-color: var(--el-bg-color)">
        <el-input v-model="filterText" style="width: 240px" placeholder="关键字搜索" />
        <el-tree
          :key="rushKey"
          ref="treeRef"
          style="max-width: 600px"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          node-key="id"
          :default-expanded-keys="[nodeId]"
          :current-node-key="nodeId"
          :highlight-current="true"
          @node-click="nodeClick"
        />
      </el-aside>
      <el-main style="height: 1000px; background-color: var(--el-bg-color)">
        <div style="margin-bottom: 10px">
          开始时间:
          <el-date-picker v-model="startTime" type="date" placeholder="请选择" value-format="YYYY-MM-DD HH:mm:ss" />
          结束时间:
          <el-date-picker v-model="endTime" type="date" placeholder="请选择" value-format="YYYY-MM-DD 23:59:59" />
          <el-button type="primary" round style="margin-left: 10px" @click="searchByTime">查询</el-button>
        </div>
        <!-- 报警及危险总数 -->
        <div id="main2" ref="chartContainer" style="width: 80vw; height: 300px"></div>
        <!-- <div class="outDiv"></div> -->
        <!-- 报警列表 -->
        <div>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.label"></el-tab-pane>
          </el-tabs>
          <tableList :key="rushKey" :node-type="nodeType" :node-id="nodeId" :start-time="startTime" :end-time="endTime" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="alarmStatistics">
// 振动报警统计
import * as echarts from "echarts";
// import alarmPie from "@/views/online/dataStatistics/alarmStatistics/components/alarmPie.vue";
// import dangerPie from "@/views/online/dataStatistics/alarmStatistics/components/dangerPie.vue";
import tableList from "@/views/online/dataStatistics/alarmStatistics/components/tableList.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { alarm_Trend } from "@/api/online/alarmStatistics";
import { ref, watch, onMounted, onUnmounted, onDeactivated, onBeforeMount } from "vue";
import { ElTree, ElMessage } from "element-plus";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route, "来自父级的参数(振动报警)");
interface Tree {
  [key: string]: any;
}
let treeData = ref();
let nodeType = ref();
let nodeId = ref("");
onUnmounted(() => {
  sessionStorage.removeItem("nodeData"); //销毁缓存
});
onDeactivated(() => {
  sessionStorage.removeItem("nodeData"); //销毁缓存
});
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};

watch(filterText, val => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
// 左侧树
const getTreeList = async () => {
  let res: any = await getLocationTree({ type: 4, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
    if (treeData.value && treeData.value.length > 0 && !sessionStorage.getItem("nodeData")) {
      nodeType.value = treeData.value[0].type;
      nodeId.value = treeData.value[0].id;
    }
    await getTrend();
    rushKey.value += 1;
  } else {
    ElMessage.error(res?.message);
  }
};
// main 时间查询
let startTime = ref("");
let endTime = ref("");
// 报警列表
const activeName = ref("1");
const tabs = [
  { label: "阈值报警", name: "1" }
  // { label: "窄带报警", name: "2" },
  // { label: "频段报警", name: "3" },
  // { label: "包络值报警", name: "4" },
  // { label: "无量纲报警", name: "5" },
  // { label: "统计量报警", name: "6" },
  // { label: "变化率报警", name: "7" }
];
const handleClick = () => {
  console.log("12345");
};
// 树节点点击事件
let rushKey = ref(1);
const nodeClick = (nodeData: any) => {
  sessionStorage.setItem("nodeData", JSON.stringify(nodeData));
  nodeType.value = nodeData?.type;
  nodeId.value = nodeData?.id;
  getTrend();
  rushKey.value += 1;
};
// 时间查询
const searchByTime = () => {
  if (startTime.value && endTime.value) {
    getTrend();
    rushKey.value += 1;
  } else {
    ElMessage.warning("请选择开始时间、结束时间");
  }
};
// 开始11
// let trendKey = ref(1);
let dangerNums: any = ref([]);
let times: any = ref([]);
let waringNums: any = ref([]);
onBeforeMount(async () => {
  if (sessionStorage.getItem("nodeData")) {
    nodeId.value = JSON.parse(sessionStorage.getItem("nodeData") as any).id;
    nodeType.value = JSON.parse(sessionStorage.getItem("nodeData") as any).type;
  } else if (route.query?.partId && !sessionStorage.getItem("nodeData")) {
    nodeId.value = route.query ? (route.query?.partId as string) : "";
    nodeType.value = route.query ? route.query?.nodeType : null;
  }
  await getTreeList();
});
onMounted(async () => {
  let chartContainer = echarts.init(document.getElementById("main2"));
  option && chartContainer.setOption(option);
});
// 准备日期数据
// let dates = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04"];

// 报警次数数据
// let warningCounts = [5, 10, 15, 20];

// 修复次数数据
// let repairCounts = [8, 7, 6, 5];

// 指定图表的配置项和数据
let option = {
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 50
    },
    {
      start: 0,
      end: 100
    }
  ],
  tooltip: {
    trigger: "axis"
    // axisPointer: {
    //   type: "shadow"
    // }
  },
  legend: {
    data: ["报警", "预警"]
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "报警",
      type: "line",
      data: []
    },
    {
      name: "预警",
      type: "line",
      data: []
    }
  ]
};
// 获取报警趋势记录
const getTrend = async () => {
  let res: any = await alarm_Trend({
    id: nodeId?.value,
    idType: nodeType?.value
  });
  dangerNums.value = [];
  times.value = [];
  waringNums.value = [];
  if (res.code == "200") {
    if (res.data.length > 0) {
      let arrs: any = [];
      arrs = res.data;
      // 遍历 objects 数组
      arrs.forEach(obj => {
        dangerNums.value.push(obj?.dangerNum);
        times.value.push(obj?.time);
        waringNums.value.push(obj?.waringNum);
      });
      option.xAxis.data = times.value;
      option.series[0].data = dangerNums.value;
      option.series[1].data = waringNums.value;
    } else {
      option.xAxis.data = [];
      option.series[0].data = [];
      option.series[1].data = [];
    }
  } else {
    ElMessage.error(res?.message);
  }
  // let chartContainer = echarts.init(document.getElementById("main2"));
  // option && chartContainer.setOption(option);
};
// 结束22
</script>
<style scoped lang="scss">
.outDiv {
  display: flex;
  .first {
    flex: 1;
    width: 48%;
    height: 500px;
    margin-right: 10px;
    border: 1px solid #c7c7c7;
  }
  .second {
    flex: 1;
    width: 48%;
    height: 500px;
    border: 1px solid #c7c7c7;
  }
}
</style>
