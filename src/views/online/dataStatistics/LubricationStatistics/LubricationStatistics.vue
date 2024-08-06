<template>
  <div class="table-box bg-color">
    <!-- 润滑、报警记录 -->
    <el-container>
      <el-aside width="200px">
        <el-tree style="max-width: 600px" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="润滑记录" name="first">
            <lubrication :part-id="partId" />
          </el-tab-pane>
          <el-tab-pane label="报警记录" name="second">
            <alarm v-if="activeName == 'second'" :part-id="partId" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="LubricationStatistics">
import { ref, onMounted } from "vue";
import { type TabsPaneContext, ElMessage } from "element-plus";
import lubrication from "@/views/online/dataStatistics/LubricationStatistics/components/lubrication.vue";
import alarm from "@/views/online/dataStatistics/LubricationStatistics/components/alarm.vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route.query.partId);
let partId = ref();
onMounted(() => {
  partId.value = route.query.partId;
});

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
// 树结构
interface Tree {
  label: string;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
  console.log(data);
};
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
let treeData = ref();
// 获取菜单列表
const getEquipTreeList = async () => {
  let res: any = await getLocationTree({ type: 2, range: 9 });
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
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
</style>
