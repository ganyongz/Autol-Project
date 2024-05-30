<template>
  <div>
    <el-tree ref="treeRef" node-key="id" :data="menuTree" :props="defaultProps" @check="handleSelectionChange" show-checkbox />
  </div>
</template>

<script setup lang="ts" name="userlist">
import { ref, toRefs, nextTick } from "vue";
import { getMenuList } from "@/api/system/menuMange";
import { role_roleMenuList } from "@/api/system/roleManage";
import { ElMessage } from "element-plus";
const props = defineProps({
  roleId: {
    type: String,
    default: ""
  }
});
const { roleId } = toRefs(props);
const defaultProps = {
  children: "children",
  label: "title",
  id: "id"
};
// 权限Tree
let menuTree = ref([]);
const treeRef = ref();
const currentIds = ref();

// 获取菜单列表
const getMenuListFun = async () => {
  let res: any = await getMenuList();
  if (res.code == "200") {
    menuTree.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 查询角色已关联的菜单
const getCheckedMenus = async () => {
  let res: any = await role_roleMenuList({ roleId: roleId.value });
  if (res.code == "200") {
    let dataArray = res.data as any;
    let objectsArray = dataArray.length > 0 ? dataArray : [];
    checkedArrIds.value = objectsArray.map(obj => obj.id);
    currentIds.value = [];
    handleObj(dataArray);
    nextTick(() => {
      currentIds.value.forEach((item: any) => {
        // 选中树，获取到树的节点，如果存在isLeaf，则设置回显
        const node = treeRef.value.getNode(item);
        if (node.isLeaf) {
          treeRef.value.setChecked(node, true);
        }
      });
    });
  } else {
    ElMessage.error(res?.mssage);
  }
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

getCheckedMenus();
getMenuListFun();
defineExpose({ checkedArrIds });
</script>

<style scoped></style>
