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
      <el-aside width="240px" style="height: calc(100vh - 210px); background-color: var(--el-bg-color)">
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
          <template #default="{ node }">
            <span class="custom-tree-node" :title="node.label">{{ node.label }}</span>
          </template>
        </el-tree>
      </el-aside>
      <el-main style="position: relative; height: calc(100vh - 210px); margin-left: 10px; background-color: var(--el-bg-color)">
        <!-- 细化普专用 -->
        <div style="margin-top: -15px; margin-bottom: 10px" v-if="activeName === 'fifth'">
          <span>中心频率：</span>
          <el-input v-model.number="fe" style="width: 200px; margin-right: 10px" placeholder="请输入" />
          <span>细化FFT的长度：</span>
          <el-input v-model.number="nfft" style="width: 200px; margin-right: 10px" placeholder="256~8192之间的2的幂次" />
          <span>细化倍数：</span>
          <el-input v-model.number="D" style="width: 200px; margin-right: 10px" placeholder="2~10之间" />
          <el-button type="primary" @click="xihuapuSearch">查询</el-button>
        </div>
        <div
          style="
            height: 400px;
            margin-bottom: 10px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #dddddd;
            border-radius: 15px;
          "
        >
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
            :fe="fe"
            :nfft="nfft"
            :d="D"
            :data-obj="dataObj"
          />
          <zixiangguan
            v-if="activeName === 'sixth'"
            :key="boxingKey"
            ref="trendChart"
            :station-id="stationId"
            :data-obj="dataObj"
          />
          <!-- 短时FFT分析 -->
          <fft v-if="activeName === 'seventh'" :key="boxingKey" ref="trendChart" :station-id="stationId" :data-obj="dataObj" />
          <gongLvPu
            v-if="activeName === 'eighth'"
            :key="boxingKey"
            ref="trendChart"
            :station-id="stationId"
            :data-obj="dataObj"
          />
          <jieCiFenXi
            v-if="activeName === 'ninth'"
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
import zixiangguan from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/zixiangguan.vue";
import gongLvPu from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/gongLvPu.vue";
import jieCiFenXi from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/jieCiFenXi.vue";
import fft from "@/views/online/expertAnalysis/comprehensiveAnalysis/components/fft.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { useRoute } from "vue-router";
const route = useRoute();
import { onDeactivated } from "vue";
// onActivated(() => {
//   console.log("onActivated: 组件被激活");
// });
onDeactivated(() => {
  sessionStorage.setItem("checkedItemId", "");
  // sessionStorage.clear('checkedItemId'); // 删除多个
  console.log("onDeactivated: 组件被停用");
});
let tplKey = ref(0);
let boxingKey = ref(1);
// tabs 切换
const activeName = ref("first");
const handleClick = (tab: any, event: Event) => {
  console.log(tab, event);
  activeName.value = tab.props.name;
};
const trendChart = ref();
// 细化谱参数
const fe = ref<number>();
const nfft = ref<number>();
const D = ref<number>();
const xihuapuSearch = () => {
  boxingKey.value += 1;
};

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
  sessionStorage.setItem("checkedItemId", checkedId.value);
  tplKey.value += 1;
};
// 点击节点
const handleNodeClick = item => {
  // type==4 测点
  if (item && item.type == 4 && checkedId.value !== item.id) {
    checkedId.value = item.id;
    stationId.value = item.id;
    sessionStorage.setItem("checkedItemId", item.id);
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
  dataObj.value = val;
  boxingKey.value += 1;
  // tplKey.value += 1;
};

// 获取左侧菜单树
const getLocationTreeFun = async () => {
  let res: any = await getLocationTree({ type: 4, range: 1, isFiltration: true });
  if (res.code == "200") {
    treeData.value = res.data as any;
    setDisabled(treeData.value); //处理数据
  } else {
    ElMessage.error(res?.message);
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
    let id = sessionStorage.getItem("checkedItemId") ? sessionStorage.getItem("checkedItemId") : route.query.pointId;
    nextTick(() => {
      stationId.value = id;
      checkedId.value = id;
      // treeRef.value.setCheckedKeys([route.query.pointId]);
      expandData.value.push(id);
      showTRee.value = true;
      tplKey.value += 1;
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
  height: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  :deep(.el-tree-node__content .is-disabled) {
    display: none;
  }
}
:deep(.el-tree) {
  padding-left: 20px;
}
.custom-tree-node {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
