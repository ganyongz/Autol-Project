<template>
  <div class="contentBox">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="波形图" name="first"></el-tab-pane>
      <el-tab-pane label="频谱图" name="second"></el-tab-pane>
    </el-tabs>
    <el-container>
      <!-- 树选择器 -->
      <el-aside width="240px">
        <el-input v-model="filterText" style="width: 240px" placeholder="关键字搜索" />
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="defaultProps"
          highlight-current
          :filter-node-method="filterNode"
          @node-click="nodeClick"
          :check-strictly="true"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
        >
          <template #default="{ node, data }">
            <span>
              <span @click="toggleChild(node)">
                {{ data.type }}
                <!-- 没有子级所展示的图标 -->
                <i v-if="!data.children.length && data.type == 4">
                  <el-icon><Star /></el-icon>
                </i>
                <!-- 展开后的图标 -->
                <i v-else-if="node.expanded" class="el-icon-minus">
                  <el-icon><FolderRemove /></el-icon>
                </i>
                <!-- 未展开的图标 -->
                <i v-else class="el-icon-plus">
                  <el-icon><FolderAdd /></el-icon>
                </i>
              </span>
              <span class="custom-tree-node">{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </el-aside>
      <el-main style="position: relative; overflow: hidden">
        <div style="height: 400px; text-align: center; vertical-align: middle; border: 1px solid #dddddd; border-radius: 15px">
          <boxingtu :key="boxingKey" ref="trendChart" :station-id="stationId" :data-obj="dataObj" />
        </div>

        <div style="height: 400px; text-align: center; vertical-align: middle; border: 1px solid #dddddd; border-radius: 15px">
          <tendencyChart @searchResult="searchResult" :key="tplKey" :station-id="stationId" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="comprehensiveAnalysis">
// 综合分析
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import boxingtu from "@/views/online/expertAnalysis/comprehensiveAnalysis/boxingtu.vue";
import tendencyChart from "@/views/online/expertAnalysis/comprehensiveAnalysis/tendencyChart.vue";
import { getLocationTree } from "@/api/system/functionPosition";
let tplKey = ref(1);
let boxingKey = ref(1);
// tabs 切换
const activeName = ref("first");
const handleClick = (tab: any, event: Event) => {
  console.log(tab, event);
};
const trendChart = ref();
// 左侧树
const treeData = ref([]);
const filterText = ref("");
const treeRef = ref();
watch(filterText, val => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.name.includes(value);
};
const defaultProps = {
  children: "children",
  label: "name",
  type: "type"
};
let stationId = ref("");
// 点击节点
const nodeClick = treeNode => {
  console.log(treeNode, "节点数据");
  if (treeNode.type == 4) {
    stationId.value = treeNode.id;
    tplKey.value += 1;
  }
};
// 获取子组件的传值
let dataObj = ref();
const searchResult = val => {
  dataObj.value = val;
  boxingKey.value += 1;
};

// 获取左侧菜单树
const getLocationTreeFun = async () => {
  let res: any = await getLocationTree({ type: 4, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
const toggleChild = node => {
  node.expanded = !node.expanded;
};

// 调用
getLocationTreeFun();
</script>
<style scoped lang="scss">
.contentBox {
  // box-sizing: border-box;
  width: 100%;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
:deep(.el-tree) {
  padding-left: 20px;
}
:deep(.custom-tree-node) {
  padding: 0 10px 0 8px;
}

// 自定义图标中隐藏自带箭头
:deep(.el-tree-node__content) {
  position: relative;
}
:deep(.el-tree-node__content > .el-tree-node__expand-icon) {
  position: absolute;
  opacity: 0;
}
</style>
