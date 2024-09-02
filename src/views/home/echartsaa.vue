<template>
  <div class="table-box bg-color">
    <!-- 润滑、报警记录 -->
    <el-container>
      <el-aside :class="['c_card-gray', 'left-card', 'h-100', 'mr-16', zoomIcon ? 'takeBack' : 'unfold']">
        <el-tree
          ref="treeRef"
          style="width: 240px; max-width: 600px"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="[defaultCheckedKeys]"
          :current-node-key="partId"
          :highlight-current="true"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <div style="display: flex">
          <div
            class="mt-16 mr-24 cursor-pointer"
            @click="zoomIcon = !zoomIcon"
            style="align-content: center; padding-right: 10px"
          >
            <el-icon v-if="zoomIcon" size="25px"><Fold /></el-icon>
            <el-icon v-else size="25px"><Expand /></el-icon>
          </div>
          <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabChangeFun">
            <el-tab-pane label="站点详情" name="first"> </el-tab-pane>
            <el-tab-pane label="润滑记录" name="second"> </el-tab-pane>
            <el-tab-pane label="报警记录" name="third"> </el-tab-pane>
          </el-tabs> -->
        </div>

        <equipmentDetail v-if="partId" :key="publicKey1" :part-id="partId" />
        <!-- <lubrication v-if="activeName == 'second'" :key="publicKey2" :part-id="partId" />
        <alarm v-if="activeName == 'third'" :key="publicKey3" :part-id="partId" /> -->
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="LubricationStatistics">
import { ref, onMounted, onActivated } from "vue";
import { ElMessage } from "element-plus";
// import lubrication from "@/views/online/dataStatistics/LubricationStatistics/components/lubrication.vue";
// import alarm from "@/views/online/dataStatistics/LubricationStatistics/components/alarm.vue";
import equipmentDetail from "@/views/online/dataStatistics/LubricationStatistics/components/equipmentDetail.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { useRoute } from "vue-router";
const route = useRoute();
let partId = ref();
let defaultCheckedKeys = ref();
partId.value = route.query?.partId ? route.query?.partId : localStorage.getItem("deviceID");
defaultCheckedKeys.value = partId?.value ? partId?.value : null;
let treeRef = ref();
onMounted(() => {
  treeRef.value.setCurrentKey = partId.value;
});
// const activeName = ref("first");
let publicKey1 = ref(1);
let publicKey2 = ref(1);
let publicKey3 = ref(1);
// 树结构
interface Tree {
  label: string;
  type: Number;
  id: String;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
  console.log(data, "节点数据");
  // 只有当type为3时才查询
  if (data?.type == 3) {
    localStorage.setItem("deviceID", data.id as any);
    partId.value = data.id;
    publicKey1.value += 1;
    publicKey2.value += 1;
    publicKey3.value += 1;
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
  // 1功能位置，2设备，3部件，4测点
  let res: any = await getLocationTree({ type: 3, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.message);
  }
};
// function tabChangeFun(e) {
//   activeName.value = e;
// }
// region TODO clickToZoom 点击缩放
const zoomIcon = ref(true);
// const treeDivRef = ref<HTMLDivElement>();
// endregion
onActivated(() => {
  if (route.query?.partId) {
    localStorage.setItem("deviceID", route.query?.partId as string);
    partId.value = route.query?.partId;
    defaultCheckedKeys.value = route.query?.partId;
  }
  if (localStorage.getItem("deviceID") && !route.query?.partId) {
    partId.value = localStorage.getItem("deviceID");
    defaultCheckedKeys.value = localStorage.getItem("deviceID");
  }
});

// 调用
getEquipTreeList();
</script>
<style scoped lang="scss">
.bg-color {
  background-color: var(--el-fill-color-blank);
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
.takeBack {
  width: 240px !important;
  margin-right: 16px;
  transition: all 0.3s;
}
.unfold {
  width: 0 !important;
  margin-right: 0 !important;
  transition: all 0.3s;
}
</style>
