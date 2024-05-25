<template>
  <div>
    <el-container class="layout-container-demo">
      <el-aside width="240px" style="margin-right: 10px; border-radius: 10px">
        <el-tree
          style="max-width: 240px"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-container>
        <el-main
          class="departHeader"
          style="margin-bottom: 10px; font-size: 12px; border-radius: 10px"
          v-if="formData.type == '1'"
        >
          <div style="margin: 10px">
            <el-button type="primary" @click="addRootDepart">添加顶级</el-button>
            <el-button type="primary" @click="addLevelDepart">添加下级</el-button>
            <el-button type="primary" @click="submitFun">保存</el-button>
            <el-button type="danger" @click="deleteFun">删除</el-button>

            <el-button type="success" @click="addEquipmentFun('添加设备', formData)">添加设备</el-button>
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
                  <el-form-item label="类型" required>
                    <el-select v-model="formData.type" placeholder="请选择类型">
                      <el-option label="功能位置" :value="1" />
                      <el-option label="设备" :value="2" />
                      <el-option label="部件" :value="3" />
                      <el-option label="检测点" :value="4" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="层级" required>
                    <el-input v-model="formData.level" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="使用范围" required>
                    <el-select v-model="formData.locationPurpose" placeholder="请选择范围">
                      <el-option label="范围1" :value="0" />
                      <el-option label="范围2" :value="1" />
                      <el-option label="范围3" :value="2" />
                      <el-option label="范围4" :value="3" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <myDialog :title="detailParams.title" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <addEquipment
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
import { ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getLocationTree, locationAddOrUpdate, deleteById, equip_addOrUpdate } from "@/api/system/functionPosition";
import { useHandleData } from "@/hooks/useHandleData";
import addEquipment from "@/views/system/functionPosition/components/addEquipment.vue";
// 点击节点
const setParentId = ref();
const handleNodeClick = (val: any) => {
  formData.value.id = val.id;
  formData.value.level = val?.displayOrder;
  formData.value.name = val?.name;
  formData.value.type = val.type;
  formData.value.locationPurpose = val?.locationPurpose; //字段里没有
  setParentId.value = val.id;
};

const treeData = ref([
  {
    label: "Level one 1",
    children: [
      {
        label: "Level two 1-1",
        children: [
          {
            label: "Level three 1-1-1"
          }
        ]
      }
    ]
  },
  {
    label: "Level one 2",
    children: [
      {
        label: "Level two 2-1",
        children: [
          {
            label: "Level three 2-1-1"
          }
        ]
      },
      {
        label: "Level two 2-2",
        children: [
          {
            label: "Level three 2-2-1"
          }
        ]
      }
    ]
  },
  {
    label: "Level one 3",
    children: [
      {
        label: "Level two 3-1",
        children: [
          {
            label: "Level three 3-1-1"
          }
        ]
      },
      {
        label: "Level two 3-2",
        children: [
          {
            label: "Level three 3-2-1"
          }
        ]
      }
    ]
  }
]);

const defaultProps = {
  children: "children",
  label: "name"
};
// 表格相关
// const tableData = ref([])
const formData = ref({
  id: "",
  parentId: "-1",
  level: null, //层级 从1 开始
  name: "",
  type: undefined, //类型
  locationPurpose: "" //使用范围区分系统使用
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
    getLocationTreeFun();
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 获取位置安装树
const getLocationTreeFun = async () => {
  let res: any = await getLocationTree({ type: 4, range: 9 });
  if (res.code == "200") {
    treeData.value = res.data as any;
    if (res.data.length > 0) {
      //'nextTick()' 下次dom更新时触发回调函数
      //默认点击
      nextTick(() => {
        const firstNode: any = document.querySelector(".el-tree-node");
        firstNode.click();
      });
    }
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除
const deleteFun = async () => {
  await useHandleData(deleteById, { id: formData.value?.id }, `删除【${formData.value.name}】节点`);
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
const addEquipmentFun = (title: string, row: any) => {
  if (row.id) {
    IsShowAdd.value = true;
    console.log(title, row);
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
  } else {
    ElMessage.error(res?.mssage);
  }
  myDialog1.value.close();
  IsShowAdd.value = false;
};
const closeDialog = () => {
  // 取消
  myDialog1.value.close();
  IsShowAdd.value = false;
};

// 调用
getLocationTreeFun();
</script>
<style scoped lang="scss">
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
}
.layout-container-demo .el-main {
  height: 1000px;
  padding: 0;
}
.layout-container-demo .el-container {
  background-color: var(--el-bg-color);
}
</style>
