<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="240px" style="height: 1000px; margin-right: 10px; background-color: var(--el-bg-color)">
        <el-input v-model="filterText" style="width: 240px" placeholder="关键字搜索" />
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
        />
      </el-aside>
      <el-main style="height: 1000px; background-color: var(--el-bg-color)">
        <div style="margin-bottom: 10px">
          开始时间: <el-date-picker v-model="startTime" type="date" placeholder="请选择" /> 结束时间:
          <el-date-picker v-model="endTime" type="date" placeholder="请选择" />
          <el-button type="primary" round style="margin-left: 10px">查询</el-button>
        </div>
        <!-- 报警及危险总数 -->
        <div class="outDiv">
          <alarmPie />
          <!-- <div class="first">
            <alarmPie />
          </div>
          <div class="second">
            <dangerPie />
          </div> -->
        </div>
        <!-- 报警列表 -->
        <div>
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabs" :label="item.label" :name="item.name" :key="item.label"></el-tab-pane>
          </el-tabs>
          <tableList />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="alarmStatistics">
// 历史报警统计
import alarmPie from "@/views/online/dataStatistics/alarmStatistics/components/alarmPie.vue";
// import dangerPie from "@/views/online/dataStatistics/alarmStatistics/components/dangerPie.vue";
import tableList from "@/views/online/dataStatistics/alarmStatistics/components/tableList.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { ref, watch } from "vue";
import { ElTree, ElMessage } from "element-plus";

interface Tree {
  [key: string]: any;
}

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
let treeData = ref();
const getTreeList = async () => {
  let res: any = await getLocationTree({ type: 4, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// main 时间查询
const startTime = ref("");
const endTime = ref("");
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
// 调用
getTreeList();
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
