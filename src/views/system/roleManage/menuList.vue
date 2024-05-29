<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="id"
      :default-checked-keys="defaultCheckedIds"
      :props="defaultProps"
      @check="handleCheck"
    ></el-tree>
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
let checkedArrIds = ref();
let treeData = ref();
console.log(roleId.value);
// 处理勾选事件
const handleCheck = (data: any, checked: boolean, indeterminate: boolean) => {
  console.log(data, checked, indeterminate);
  checkedArrIds.value = [...checked["checkedKeys"], ...checked["halfCheckedKeys"]];
};

// const handleCheck = (checkedNodes: any, checkedKeys: any) => {
//   console.log(checkedNodes, checkedKeys, "数据来了-----");

//   treeData.value = treeData.value.map((node: any) => {
//     const found = checkedKeys && checkedKeys.includes(node.id);
//     const indeterminate = found ? false : checkedKeys && checkedKeys.some(key => node.id === key);
//     return {
//       ...node,
//       checked: found,
//       indeterminate: indeterminate
//     };
//   });
// };

// 获取菜单列表
const getMenuListFun = async () => {
  let res: any = await getMenuList();
  if (res.code == "200") {
    treeData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 查询角色已关联的菜单
let defaultCheckedIds = ref([]);
const getCheckedMenus = async () => {
  let res: any = await role_roleMenuList({ roleId: roleId.value });
  if (res.code == "200") {
    let dataArray = res.data as any;
    let objectsArray = dataArray.length > 0 ? dataArray : [];
    defaultCheckedIds.value = objectsArray.map(obj => obj.id);
    checkedArrIds.value = defaultCheckedIds.value;
    console.log(defaultCheckedIds.value, "菜单list");
  } else {
    ElMessage.error(res?.mssage);
  }
};

getCheckedMenus();
getMenuListFun();
defineExpose({ checkedArrIds });
</script>

<style scoped></style>
