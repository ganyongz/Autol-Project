<template>
  <div class="table-box bg-color">
    <!-- 润滑、报警记录 -->
    <el-container>
      <el-aside style="margin-right: 10px; background-color: var(--el-fill-color-blank)">
        <el-tree
          ref="treeRef"
          style="width: 200px; max-width: 600px"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="defaultCheckedKeys"
          :current-node-key="partId"
          :highlight-current="true"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main style="background-color: var(--el-fill-color-blank)">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="润滑记录" name="first">
            <lubrication :key="publicKey" :part-id="partId" />
          </el-tab-pane>
          <el-tab-pane label="报警记录" name="second">
            <alarm :key="publicKey" v-if="activeName == 'second'" :part-id="partId" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="LubricationStatistics">
import { ref, onMounted, onActivated } from "vue";
import { type TabsPaneContext, ElMessage } from "element-plus";
import lubrication from "@/views/online/dataStatistics/LubricationStatistics/components/lubrication.vue";
import alarm from "@/views/online/dataStatistics/LubricationStatistics/components/alarm.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { useRoute } from "vue-router";
const route = useRoute();
let partId = ref();
let defaultCheckedKeys = ref();
partId.value = route.query?.partId ? route.query?.partId : localStorage.getItem("partID");
defaultCheckedKeys.value = partId?.value ? [partId?.value] : [];
let treeRef = ref();
let activeName = ref("first");
onMounted(() => {
  treeRef.value.setCurrentKey = partId.value;
  if (route.query?.type && route.query?.type === "alarm") {
    activeName.value = "second";
  } else {
    activeName.value = "first";
  }
});
onActivated(() => {
  if (route.query?.partId) {
    localStorage.setItem("partID", route.query?.partId as string);
    partId.value = route.query?.partId;
    defaultCheckedKeys.value = [route.query?.partId];
  }
  if (localStorage.getItem("partID") && !route.query?.partId) {
    partId.value = localStorage.getItem("partID");
    defaultCheckedKeys.value = [localStorage.getItem("partID")];
  }
});
let publicKey = ref(1);
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
// 树结构
interface Tree {
  label: string;
  type: Number;
  id: String;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
  // console.log(data, "节点数据");
  // 只有当type为3时才查询
  if (data?.type == 3) {
    partId.value = data.id;
    publicKey.value += 1;
  }
};
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
let treeData = ref();
// 获取菜单列表
const getEquipTreeList = async () => {
  let res: any = await getLocationTree({ type: 3, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.message);
  }
};
getEquipTreeList();
</script>
<style scoped lang="scss">
.bg-color {
  .el-main {
    // background-color: var(--el-fill-color-blank);
  }
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
:deep(.el-tree-node .el-tree-node__content:hover) {
  color: #409eff;
  background-color: #f0f7ff !important;
}

/*  颜色高亮 */
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  color: #409eff;
}
</style>
