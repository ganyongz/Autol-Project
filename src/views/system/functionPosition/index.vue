<template>
  <div>
    <el-container class="layout-container-demo" style="height: auto">
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
        <el-header class="departHeader" style="margin-bottom: 10px; font-size: 12px; border-radius: 10px">
          <div style="margin: 10px">
            <el-button type="primary" @click="addRootDepart">添加顶级</el-button>
            <el-button type="primary" @click="addLevelDepart">添加下级</el-button>
            <el-button type="primary" @click="submitFun">保存</el-button>
            <el-button type="danger" @click="deleteFun">删除</el-button>
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
                      <el-option label="类型1" :value="0" />
                      <el-option label="类型2" :value="1" />
                      <el-option label="类型3" :value="2" />
                      <el-option label="类型4" :value="3" />
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
        </el-header>
        <el-main>
          <el-table :data="tableData" style="width: 100%" height="800px">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-main>
        <!-- <el-footer style="border: 1px solid burlywood">footer</el-footer> -->
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="functionPosition">
import { ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { getLocationTree, locationAddOrUpdate, deleteById } from "@/api/system/functionPosition";
import { useHandleData } from "@/hooks/useHandleData";
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
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
];

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
  Object.keys(formData.value).forEach(key => (formData.value[key] = ""));
  formData.value.parentId = "-1";
};
// 添加下级部门
const addLevelDepart = () => {
  Object.keys(formData.value).forEach(key => (formData.value[key] = ""));
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
  let res: any = await getLocationTree();
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

// 调用
getLocationTreeFun();
</script>
<style scoped lang="scss">
.layout-container-demo .el-header {
  position: relative;
  display: block !important;
  justify-content: left !important;
  height: auto !important;
  color: var(--el-text-color-primary);

  /* background-color: var(--el-color-primary-light-7); */
  background: #ffffff;
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);

  /* background: var(--el-color-primary-light-8); */
  background-color: #ffffff;
}
.layout-container-demo .el-main {
  padding: 0;
}

// .layout-container-demo {
//   align-items: normal;
//   .departHeader {
//     margin-bottom: 10px;
//     font-size: 12px;
//     border-radius: 10px;
//   }
//   .el-container .el-header {
//     display: block;
//     height: auto;
//   }
// }
</style>
