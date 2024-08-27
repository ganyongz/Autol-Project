<template>
  <div>
    <el-tree ref="treeRef" node-key="id" :data="treeData" :props="defaultProps" @check="handleSelectionChange" show-checkbox />
    <div></div>
  </div>
</template>

<script setup lang="ts" name="equipmentList">
import { ref, toRefs } from "vue";
import { getLocationTree } from "@/api/system/functionPosition";
import { Tenant_getLocationListByTenantId } from "@/api/system/TenantManagement";
import { ElMessage } from "element-plus";
const props = defineProps({
  tenantId: {
    type: String,
    default: ""
  }
});
const { tenantId } = toRefs(props);
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
// 权限Tree
let treeData = ref([]);
const treeRef = ref();
const currentIds = ref();

// 获取全部设备列表
const getMenuListFun = async () => {
  let res: any = await getLocationTree({ type: 3, range: 9 });
  if (res.code == "200") {
    treeData.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
};
// 查询已关联的数据
const getCheckedMenus = async () => {
  let res: any = await Tenant_getLocationListByTenantId({ tenantId: tenantId.value });
  if (res.code == "200") {
    let dataArray = res.data as any;
    checkedArrIds.value = res.data;
    currentIds.value = [];
    handleObj(dataArray);
  } else {
    ElMessage.error(res?.message);
  }
};
// 递归处理勾选tree节点
const handleObj = (data: any) => {
  currentIds.value = data;
  setTimeout(() => {
    currentIds.value.forEach(async (item: any) => {
      // 选中树，获取到树的节点，如果存在isLeaf，则设置回显
      const node = await treeRef.value.getNode(item);
      if (node !== null && node.isLeaf) {
        treeRef.value.setChecked(node, true);
      }
    });
  }, 100);
};
let checkedArrIds = ref();
let checkedObjs = ref();
const handleSelectionChange = (a, b) => {
  let allArray = [...b["checkedNodes"], ...b["halfCheckedNodes"]];
  if (allArray.length > 0) {
    // 使用 map 方法遍历数组，并使用解构赋值来重命名键
    const updatedObjects = allArray.map(obj => ({
      id: obj.id,
      type: obj.type,
      tenantId: tenantId.value
    }));
    checkedObjs.value = updatedObjects;
  } else {
    checkedObjs.value = [{ tenantId: tenantId.value }];
  }
  checkedArrIds.value = [...b["checkedKeys"], ...b["halfCheckedKeys"]];
};

getMenuListFun();
getCheckedMenus();
defineExpose({ checkedObjs });
</script>

<style scoped></style>
