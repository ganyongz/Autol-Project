<template>
  <div class="table-box bg-color">
    <!-- 部件详情 - 部件级 -->
    <el-container style="background-color: var(--el-fill-color-blank)">
      <el-aside :class="['c_card-gray', 'left-card', 'h-100', 'mr-16', zoomIcon ? 'takeBack' : 'unfold']">
        <el-tree
          v-if="caidan"
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
        </div>
        <equipmentDetail v-if="partId" :key="publicKey1" :part-id="partId" />
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="partDetail">
import { ref, onActivated, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import equipmentDetail from "@/views/online/dataStatistics/LubricationStatistics/components/equipmentDetail.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { useRoute } from "vue-router";
const route = useRoute();
let equipId = ref(); //设备id
equipId.value = route.query?.id;
console.log(route.query);
let partId = ref<any>();
let defaultCheckedKeys = ref();
let treeRef = ref();
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
  // console.log(data, "节点数据");
  // 1功能位置，2设备，3部件，4测点;只有当type为3时才查询
  if (data?.type == 3) {
    sessionStorage.setItem("deviceID", data.id as any);
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
let caidan = ref(true);
// 获取菜单列表
const getEquipTreeList = async () => {
  caidan.value = false;
  // 1功能位置，2设备，3部件，4测点
  let res: any = await getLocationTree({ type: 3, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
    if (sessionStorage.getItem("deviceID")) {
      partId.value = sessionStorage.getItem("deviceID");
      defaultCheckedKeys.value = sessionStorage.getItem("deviceID");
    } else if (route.query?.id) {
      const objectId1_2 = findObjectById(route.query?.id, res.data); //找到该对象
      partId.value = objectId1_2.children.length > 0 ? objectId1_2.children[0].id : "";
      defaultCheckedKeys.value = objectId1_2.children.length > 0 ? objectId1_2.children[0].id : "";
    } else {
      partId.value = "";
      defaultCheckedKeys.value = "";
    }
    caidan.value = true;
  } else {
    ElMessage.error(res?.message);
  }
};
function findObjectById(id, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return array[i]; // 找到匹配的 id，返回对象
    }
    if (array[i].children && array[i].children.length) {
      const found = findObjectById(id, array[i].children); // 递归查找
      if (found) {
        return found; // 如果在子数组中找到，返回找到的对象
      }
    }
  }
  return null; // 如果没有找到，返回 null
}
// region TODO clickToZoom 点击缩放
const zoomIcon = ref(true);
onActivated(() => {
  if (sessionStorage.getItem("deviceID")) {
    partId.value = sessionStorage.getItem("deviceID");
    defaultCheckedKeys.value = sessionStorage.getItem("deviceID");
  }
});
onUnmounted(() => {
  // 组件销毁时,销毁缓存
  sessionStorage.removeItem("deviceID");
});
// 调用
getEquipTreeList();
</script>
<style scoped lang="scss">
.bg-color {
  // 注意 （hidden 是否可用？）
  // overflow: hidden;
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
