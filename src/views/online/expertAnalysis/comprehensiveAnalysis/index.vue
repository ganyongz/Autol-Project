<template>
  <div class="contentBox">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="波形图" name="first"></el-tab-pane>
      <el-tab-pane label="频谱图" name="second"></el-tab-pane>
      <el-tab-pane label="包络谱" name="third"></el-tab-pane>
      <el-tab-pane label="倒频谱" name="fourth"></el-tab-pane>
      <el-tab-pane label="细化谱" name="fifth"></el-tab-pane>
      <el-tab-pane label="自相关分析" name="sixth"></el-tab-pane>
      <el-tab-pane label="短时FFT分析" name="seventh"></el-tab-pane>
      <el-tab-pane label="功率谱" name="eighth"></el-tab-pane>
      <el-tab-pane label="阶次分析" name="ninth"></el-tab-pane>
      <!-- 1波形 2频谱 3包络图 4倒频谱 5细化谱 6自相关 7短时FFT分析 8功率谱 9阶次分析 -->
    </el-tabs>
    <el-container>
      <!-- 树选择器 -->
      <el-aside width="240px">
        <el-input v-model="filterText" style="width: 240px" placeholder="关键字搜索" />
        <el-tree
          v-if="showTRee"
          ref="treeRef"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          :filter-node-method="filterNode"
          :default-checked-keys="[stationId]"
          @check="checkClick"
          @node-click="handleNodeClick"
          @node-expand="handleNodeExpand"
          :check-strictly="true"
          node-key="id"
          show-checkbox
          :default-expanded-keys="expandData"
        >
        </el-tree>
      </el-aside>
      <el-main style="position: relative; overflow: hidden">
        <div style="height: 400px; text-align: center; vertical-align: middle; border: 1px solid #dddddd; border-radius: 15px">
          <boxingtu v-if="activeName === 'first'" :key="boxingKey" ref="trendChart" :station-id="stationId" :data-obj="dataObj" />
          <spectrogram
            v-if="activeName === 'second'"
            :key="boxingKey"
            ref="trendChart"
            :station-id="stationId"
            :data-obj="dataObj"
          />
          <envelopeSpectrum
            v-if="activeName === 'third'"
            :key="boxingKey"
            ref="trendChart"
            :station-id="stationId"
            :data-obj="dataObj"
          />
          <cepstrum
            v-if="activeName === 'fourth'"
            :key="boxingKey"
            ref="trendChart"
            :station-id="stationId"
            :data-obj="dataObj"
          />
          <xihuaSpectrum
            v-if="activeName === 'fifth'"
            :key="boxingKey"
            ref="trendChart"
            :station-id="stationId"
            :data-obj="dataObj"
          />
        </div>

        <div
          :key="tplKey"
          style="height: 400px; text-align: center; vertical-align: middle; border: 1px solid #dddddd; border-radius: 15px"
        >
          <!-- 趋势图 -->
          <tendencyChart @search-result="searchResult" :station-id="stationId" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="comprehensiveAnalysis">
// 综合分析
import { ref, watch, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import tendencyChart from "@/views/online/expertAnalysis/comprehensiveAnalysis/tendencyChart.vue";
import boxingtu from "@/views/online/expertAnalysis/comprehensiveAnalysis/boxingtu.vue";
import spectrogram from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/spectrogram.vue";
import envelopeSpectrum from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/envelopeSpectrum.vue";
import cepstrum from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/cepstrum.vue";
import xihuaSpectrum from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/xihuaSpectrum.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { useRoute } from "vue-router";
const route = useRoute();
let tplKey = ref(0);
let boxingKey = ref(1);
// tabs 切换
const activeName = ref("first");
const handleClick = (tab: any, event: Event) => {
  console.log(tab, event);
  activeName.value = tab.props.name;
};
const trendChart = ref();
// 左侧树
const treeData = ref([]);
const filterText = ref("");
const treeRef = ref();
watch(filterText, val => {
  treeRef.value!.filter(val);
});
interface TreeNode {
  id: string;
  label: string;
  type: number;
  children?: TreeNode[];
}
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.name.includes(value);
};
const defaultProps = {
  children: "children",
  label: "name",
  type: "type"
};
let stationId = ref();
let checkedId = ref();
// 处理数据
const setDisabled = data => {
  data.forEach(item => {
    if (item && item.type !== 4) {
      item.disabled = true;
    } else {
      item.disabled = false;
    }
    if (item.children && item.children.length) {
      setDisabled(item.children);
    }
  });
};
// 点击选框
const checkClick = checkedNode => {
  const checkedKeys = treeRef.value.getCheckedKeys(); // 获取所有已选中的节点
  if (checkedKeys.length > 0 && checkedId.value !== checkedNode.id) {
    treeRef.value.setCheckedKeys([checkedNode.id]); //设置选中
    checkedId.value = checkedNode.id;
    // 取消之前选中节点的勾选状态
    const otherCheckedKeys = checkedKeys.filter(key => key !== checkedNode.id);
    otherCheckedKeys.forEach(key => {
      treeRef.value.setChecked(key, false);
    });
    // 把当前节点的id的checked属性设置为true,如果不设置，会在勾选第二个选项时点击两次。
    treeRef.value.setChecked(checkedNode.id, true);
  } else {
    //反选
    treeRef.value.setCheckedKeys([]);
    checkedId.value = "";
    treeRef.value.setChecked(checkedNode.id, false);
  }
  stationId.value = checkedId.value;
  tplKey.value += 1;
};
// 点击节点
const handleNodeClick = item => {
  // type==4 测点
  if (item && item.type == 4 && checkedId.value !== item.id) {
    checkedId.value = item.id;
    stationId.value = item.id;
    treeRef.value.setCheckedKeys([item.id]);
    tplKey.value += 1;
  } else if (item && item.type == 4 && checkedId.value === item.id) {
    //反勾选
    console.log("反勾选");
    checkedId.value = "";
    stationId.value = "";
    treeRef.value.setCheckedKeys([]);
    tplKey.value += 1;
  }
};

// 获取子组件的传值
let dataObj = ref();
const searchResult = val => {
  // debugger;
  dataObj.value = val;
  boxingKey.value += 1;
  // tplKey.value += 1;
};

// 获取左侧菜单树
const getLocationTreeFun = async () => {
  let res: any = await getLocationTree({ type: 4, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
    setDisabled(treeData.value); //处理数据
  } else {
    ElMessage.error(res?.mssage);
  }
};

const handleNodeExpand = (data: TreeNode, node: any, instance: any) => {
  if (data && data.type === 4) {
    instance.store.nodesMap[node.key].expanded = true;
  }
};
let expandData: any = ref([]);
onMounted(async () => {
  await getLocationTreeFun();
  if (route.query.pointId) {
    showTRee.value = false;
    nextTick(() => {
      stationId.value = route.query.pointId;
      checkedId.value = route.query.pointId;
      // treeRef.value.setCheckedKeys([route.query.pointId]);
      expandData.value.push(route.query.pointId);
      showTRee.value = true;
    });
  } else {
    const firstType4Node = getFirstType4Node(treeData.value);
    if (firstType4Node && treeRef.value) {
      treeRef.value.store.nodesMap[firstType4Node.key].expanded = true;
    }
  }
});
let showTRee = ref(true);
// 获取第一个type为4的节点
function getFirstType4Node(nodes: TreeNode[]): any {
  showTRee.value = false;
  for (const node of nodes) {
    if (node && node.type === 4) {
      stationId.value = node.id;
      checkedId.value = node.id;
      nextTick(() => {
        expandData.value.push(node.id);
        showTRee.value = true;
      });
      treeRef.value.setCheckedKeys([node.id]);
      tplKey.value += 1;
      return treeRef.value?.store.nodesMap[node.id];
    }
    if (node.children && node.children.length > 0) {
      const foundNode = getFirstType4Node(node.children);
      if (foundNode) return foundNode;
    }
  }
  return null;
}
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
  :deep(.el-tree-node__content .is-disabled) {
    display: none;
  }
}
:deep(.el-tree) {
  padding-left: 20px;
}
:deep(.custom-tree-node) {
  padding: 0 10px 0 8px;
}
</style>
