<template>
  <div>
    <!-- 部门下的设备列表 -->
    <el-tree ref="treeRef" node-key="id" :data="menuTree" :props="defaultProps" @check="handleSelectionChange" show-checkbox />
  </div>
</template>
<script setup lang="ts" name="equipList">
// 设备与点检任务绑定
import { ref, toRefs, nextTick } from "vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { ElMessage } from "element-plus";
const props = defineProps({
  deptId: {
    type: String,
    default: ""
  },
  bindEquipIds: {
    type: Array,
    default: () => []
  }
});
const { bindEquipIds } = toRefs(props);
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
// 权限Tree
let menuTree = ref([]);
const treeRef = ref();
const currentIds = ref();
// 获取菜单列表
const getEquipListFun = async () => {
  let res: any = await getLocationTree({ type: 2, range: 9 });
  if (res.code == "200") {
    menuTree.value = res.data as any;
    getCheckedEquips(menuTree.value);
  } else {
    ElMessage.error(res?.message);
  }
};
// 查询角色已关联的设备
const getCheckedEquips = async (dataArray: any) => {
  checkedArrIds.value = bindEquipIds?.value;
  currentIds.value = [];
  handleObj(dataArray);
  nextTick(() => {
    currentIds.value.forEach((item: any) => {
      const node = treeRef.value.getNode(item);
      if (node.isLeaf && checkedArrIds.value.includes(node.data.id)) {
        treeRef.value.setChecked(node, true);
      }
    });
  });
};
// 递归处理勾选tree节点
const handleObj = (data: any) => {
  data.forEach((item: any) => {
    currentIds.value.push(item.id);
    if (item.children && item.children.length) {
      handleObj(item.children);
    }
  });
};
let checkedArrIds = ref();
const handleSelectionChange = (a, b) => {
  checkedArrIds.value = [...b["checkedKeys"], ...b["halfCheckedKeys"]];
};
getEquipListFun();
defineExpose({ checkedArrIds });
</script>

<style scoped></style>
