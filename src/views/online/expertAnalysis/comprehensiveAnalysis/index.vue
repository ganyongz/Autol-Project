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
          style="max-width: 600px; height: 800px"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
        />
      </el-aside>
      <el-main style="position: relative; overflow: hidden">
        <boxingtu />
        <div style="height: 400px; text-align: center; vertical-align: middle; border: 1px solid #dddddd; border-radius: 15px">
          暂无数据
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="comprehensiveAnalysis">
// 综合分析
import { ref, watch } from "vue";
import { ElTree } from "element-plus";
import boxingtu from "@/views/online/expertAnalysis/comprehensiveAnalysis/boxingtu.vue";
// tabs 切换
const activeName = ref("first");
const handleClick = (tab: any, event: Event) => {
  console.log(tab, event);
};
// 左侧树
interface Tree {
  [key: string]: any;
}
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

const defaultProps = {
  children: "children",
  label: "label"
};

watch(filterText, val => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};

const data: Tree[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          {
            id: 9,
            label: "Level three 1-1-1"
          },
          {
            id: 10,
            label: "Level three 1-1-2"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      {
        id: 5,
        label: "Level two 2-1"
      },
      {
        id: 6,
        label: "Level two 2-2"
      }
    ]
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      {
        id: 7,
        label: "Level two 3-1"
      },
      {
        id: 8,
        label: "Level two 3-2"
      }
    ]
  }
];
</script>
<style scoped lang="scss">
.contentBox {
  // box-sizing: border-box;
  width: 100%;
  padding: 20px;
  overflow-x: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
</style>
