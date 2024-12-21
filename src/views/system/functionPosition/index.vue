<template>
  <div>
    <!-- 功能配置 -->
    <el-container class="layout-container-demo">
      <el-aside style="width: 200px; padding: 10px; margin-right: 10px; border-radius: 10px">
        <el-tree
          :key="treeKey"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="[currentNodeId]"
          :current-node-key="currentNodeId"
          :highlight-current="true"
          @node-click="handleNodeClick"
        >
          <template #default="{ node }">
            <span class="custom-tree-node" :title="node.label">{{ node.label }}</span>
          </template>
        </el-tree>
      </el-aside>
      <el-container style="height: calc(100vh - 155px); overflow: auto">
        <el-main
          class="departHeader"
          style="padding: 10px; margin-bottom: 10px; font-size: 12px; border-radius: 10px"
          v-if="formData.type == '1' || formData.type === undefined"
        >
          <div style="margin: 10px">
            <el-button type="primary" @click="addRootDepart">添加顶级</el-button>
            <el-button type="primary" @click="addLevelDepart">添加下级</el-button>
            <el-button type="primary" @click="submitFun">保存</el-button>
            <el-button type="danger" @click="deleteFun">删除</el-button>
            <el-button type="success" @click="addEquipmentFun(formData)">添加设备</el-button>
          </div>
          <!-- 添加 -->
          <div style="justify-content: left">
            <el-form :model="formData" label-width="auto" style="max-width: 600px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="名称" required>
                    <el-input v-model="formData.name" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序" required>
                    <el-input v-model="formData.sort" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-main>
        <!-- 设备 -->
        <equipDetail :node-data="nodeData" :key="keyNum" v-if="formData.type == '2'" />
        <!-- 部件 -->
        <unit :current-node-id="currentNodeId" :key="keyNum" v-if="formData.type == '3'" />
        <!-- 测点 -->
        <detailPoint :node-data="nodeData" :key="keyNum" v-if="formData.type == '4'" />
      </el-container>
    </el-container>
    <myDialog :title="detailParams.title" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <add-equipment
          v-if="IsShowAdd"
          ref="addEditRoleRef"
          :row-data="rowData"
          :title="detailParams.title"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup name="functionPosition">
// 功能配置
import mittBus from "@/utils/mittBus";
import { ref, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { getLocationTree, locationAddOrUpdate, deleteById, equip_addOrUpdate } from "@/api/system/functionPosition";
import { useHandleData } from "@/hooks/useHandleData";
import addEquipment from "@/views/system/functionPosition/components/addEquipment.vue";
import equipDetail from "@/views/system/functionPosition/components/equipDetail.vue";
import unit from "@/views/system/functionPosition/components/unit.vue";
import detailPoint from "@/views/system/functionPosition/components/detailPoint.vue";
let currentNodeId = ref(""); //当前节点
const setParentId = ref();
const nodeData = ref();
let keyNum = ref(1);
// 点击节点
const handleNodeClick = (val: any) => {
  sessionStorage.setItem("nodeDatas", JSON.stringify(val));
  nodeData.value = val;
  formData.value.id = val.id;
  formData.value.sort = val?.displayOrder;
  formData.value.name = val?.name;
  formData.value.type = val?.type;
  formData.value.parentId = val?.parentId;
  setParentId.value = val.id;
  currentNodeId.value = val.id;
  keyNum.value += 1;
};

const treeData = ref([]);
const defaultProps = {
  children: "children",
  label: "name",
  id: "id"
};
// 表格相关
// const tableData = ref([])
const formData = ref({
  id: "",
  parentId: "-1",
  sort: null, //层级 从1 开始
  name: "",
  type: "1" //类型
});
// 添加顶级部门
const addRootDepart = () => {
  Object.keys(formData.value).forEach(key => {
    if (key !== "type") {
      formData.value[key] = "";
    }
  });
  formData.value.parentId = "-1";
};
// 添加下级部门
const addLevelDepart = () => {
  Object.keys(formData.value).forEach(key => {
    if (key !== "type") {
      formData.value[key] = "";
    }
  });
  formData.value.parentId = setParentId.value;
};
// 新增或编辑
const submitFun = async () => {
  let res: any = await locationAddOrUpdate(formData.value);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    editOrDelete.value = "edit";
    getLocationTreeFun();
  } else {
    ElMessage.error(res?.message);
  }
};
// 数组扁平化
let flatData = ref();
let assembleTreeData = datas => {
  let newMenuList = JSON.parse(JSON.stringify(datas));
  return newMenuList.flatMap(item => [item, ...(item.children ? assembleTreeData(item.children) : [])]);
};
// 获取位置安装树
let treeKey = ref(1);
const getLocationTreeFun = async () => {
  let res: any = await getLocationTree({ type: 4, range: 9, isFiltration: false });
  if (res.code == "200") {
    treeData.value = res.data as any;
    flatData.value = assembleTreeData(treeData.value);
    if (sessionStorage.getItem("nodeDatas")) {
      let nodeDatas = JSON.parse(sessionStorage.getItem("nodeDatas") as any);
      if (editOrDelete.value == "delete") {
        // 如果是删除
        const targetId = nodeDatas ? nodeDatas["parentId"] : ""; // 要查找的目标 ID
        let findObject = flatData.value.find(item => item.id === targetId);
        currentNodeId.value = findObject ? findObject["id"] : "";
        formData.value.type = findObject ? findObject["type"] : "";
        formData.value.id = findObject ? findObject["id"] : "";
        formData.value.parentId = findObject ? findObject["parentId"] : "";
        nodeData.value = findObject;
        formData.value.sort = findObject ? findObject["displayOrder"] : "";
        formData.value.name = findObject ? findObject["name"] : "";
        setParentId.value = findObject ? findObject["id"] : "";
      } else {
        // 其他 (新建，编辑)
        const targetId = nodeDatas ? nodeDatas["id"] : ""; // 要查找的目标 ID
        let findObject = flatData.value.find(item => item.id === targetId);
        currentNodeId.value = findObject ? findObject["id"] : "";
        formData.value.type = findObject ? findObject["type"] : "";
        formData.value.id = findObject ? findObject["id"] : "";
        formData.value.parentId = findObject ? findObject["parentId"] : "";
        nodeData.value = findObject;

        formData.value.sort = findObject ? findObject["displayOrder"] : "";
        formData.value.name = findObject ? findObject["name"] : "";
        setParentId.value = findObject ? findObject["id"] : ""; //区分新建  和 编辑 ??
      }
    }
    treeKey.value += 1;
    handleNodeClick(nodeData.value);
  } else {
    ElMessage.error(res?.message);
  }
};
// 删除
const deleteFun = async () => {
  await useHandleData(deleteById, { id: formData.value?.id, type: formData.value.type }, `删除【${formData.value.name}】节点`);
  editOrDelete.value = "delete";
  getLocationTreeFun();
};
// 新增、编辑（设备）
let addEditRoleRef = ref();
let rowData = ref();
import myDialog from "@/components/dialog/myDialog.vue";
const myDialog1 = ref();
const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const detailParams = ref({
  title: "新增"
});
const addEquipmentFun = (row: any) => {
  if (row.id) {
    IsShowAdd.value = true;
    rowData.value = row;
    myDialog1.value.open();
  } else {
    ElMessage.error("请选择一个功能位置");
  }
};
const submitForm = async () => {
  // 添加设备
  let res: any = await equip_addOrUpdate(addEditRoleRef.value.ruleForm);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    editOrDelete.value = "edit";
    getLocationTreeFun();
  } else {
    ElMessage.error(res?.message);
  }
  myDialog1.value.close();
  IsShowAdd.value = false;
};
const closeDialog = () => {
  // 取消
  myDialog1.value.close();
  IsShowAdd.value = false;
};
let editOrDelete = ref("edit");
mittBus.on("refreshLocationTree", (type: any) => {
  editOrDelete.value = type;
  getLocationTreeFun();
});
onUnmounted(() => {
  mittBus.all.clear();
});
// 调用
getLocationTreeFun();
</script>
<style scoped lang="scss">
.layout-container-demo {
  height: calc(100vh - 150px);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .el-container {
  background-color: var(--el-bg-color);
}
.custom-tree-node {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
