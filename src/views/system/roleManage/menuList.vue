<template>
  <div>
    <div style="font-size: smaller; color: #e6a23c">提示：首页 必须勾选</div>
    <el-tree
      ref="treeRef"
      node-key="id"
      :data="menuTree"
      :props="defaultProps"
      @check="handleSelectionChange"
      :check-strictly="true"
      show-checkbox
    />
  </div>
</template>

<script setup lang="ts" name="userlist">
import { ref, toRefs } from "vue";
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
function mergeButtonsToChildren(items) {
  items.forEach(item => {
    if (item.buttons && item.buttons.length) {
      // 如果存在buttons数组，则将其合并到children数组
      if (!item.children) {
        item.children = []; // 确保children属性存在
      }
      // 将buttons数组中的元素添加到children数组
      item.children.push(...item.buttons);
      delete item.buttons; // 删除buttons属性
    }

    // 如果当前对象有children属性，则递归合并其子对象的buttons到children
    if (item.children && item.children.length) {
      mergeButtonsToChildren(item.children);
    }
  });
  return items;
}

// 获取菜单列表
const getMenuListFun = async () => {
  let res: any = await getMenuList();
  if (res.code == "200") {
    let datasArray = res.data;
    let datas = mergeButtonsToChildren(datasArray);
    menuTree.value = datas as any;
  } else {
    ElMessage.error(res?.message);
  }
};
// 查询角色已关联的菜单
const getCheckedMenus = async () => {
  let res: any = await role_roleMenuList({ roleId: roleId.value });
  if (res.code == "200") {
    let dataArray = res.data as any;
    let objectsArray = dataArray.length > 0 ? dataArray : [];
    checkedArrIds.value = await objectsArray.map(obj => obj.id);
    currentIds.value = [];
    handleObj(dataArray);
  } else {
    ElMessage.error(res?.message);
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
  setTimeout(() => {
    currentIds.value.forEach(async (item: any) => {
      // 选中树，获取到树的节点，如果存在isLeaf，则设置回显
      const node = await treeRef.value.getNode(item);
      // node !== null && node.isLeaf
      if (node !== null) {
        treeRef.value.setChecked(node, true);
      }
    });
  }, 100);
};
let checkedArrIds = ref();
const handleSelectionChange = (a, b) => {
  checkedArrIds.value = [...b["checkedKeys"], ...b["halfCheckedKeys"]];
};
getMenuListFun();
getCheckedMenus();
defineExpose({ checkedArrIds });
</script>

<style scoped></style>
