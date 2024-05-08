/* stylelint-disable scss/double-slash-comment-whitespace-inside */
<template>
  <el-container class="layout-container-demo" style="height: auto">
    <!-- 部门管理 -->
    <el-aside width="240px" style="margin-right: 10px; border-radius: 10px">
      <el-input v-model="filterText" style="width: 216px; margin: 8px" placeholder="部门搜索" :suffix-icon="Search" />
      <el-scrollbar>
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          :filter-node-method="filterNode"
          :current-node-key="currentKey"
          :default-expanded-keys="defaultExpanded"
          highlight-current
          @node-click="handleNode"
        />
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="departHeader" style="margin-bottom: 10px; font-size: 12px; border-radius: 10px">
        <div style="padding: 8px 0">
          <el-button type="primary" @click="addRootDepart">添加顶级</el-button>
          <el-button type="primary" @click="addLevelDepart">添加子级</el-button>
          <el-button type="primary" @click="submitFun">保存</el-button>
          <el-button type="danger" @click="deleteDepart">删除</el-button>
        </div>
        <!-- 添加 -->
        <div style="justify-content: left">
          <el-form :model="formData" label-width="auto" style="max-width: 600px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="部门名称" required>
                  <el-input v-model="formData.deptName" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="部门类型" required>
                  <el-select v-model="formData.deptType" placeholder="请选择部门类型">
                    <el-option label="集团" :value="0" />
                    <el-option label="厂房" :value="1" />
                    <el-option label="集团" :value="2" />
                    <el-option label="厂房" :value="3" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="排序" required>
                  <el-input v-model="formData.displayOrder" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="地址">
                  <el-input v-model="formData.address" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-header>

      <el-main style="border-radius: 10px">
        <el-scrollbar>
          <el-table :data="tableData" height="800px">
            <el-table-column prop="date" label="部门名称" width="140" />
            <el-table-column prop="name" label="部门编号" width="120" />
            <el-table-column prop="address" label="部门简称" />
            <el-table-column prop="address" label="部门类型" />
            <el-table-column prop="address" label="排序" />
            <el-table-column prop="address" label="地址" />
          </el-table>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup name="departmentManage">
import { nextTick, ref } from "vue";
// import { ElTree } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getDepartTree, addOrUpdateUser, deleteDepartById } from "@/api/system/departmentManage";
import { ElMessage } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles"
};
const tableData = ref(Array.from({ length: 20 }).fill(item));
const filterText = ref(""); //部门筛选
let treeData = ref();
const defaultProps = {
  children: "children",
  label: "name"
};
interface Tree {
  [key: string]: any;
}
const filterNode = (value: string, treeData: Tree) => {
  if (!value) return true;
  return treeData.label.includes(value);
};
// 获取部门树
const departTreeFun = async () => {
  let res: any = await getDepartTree();
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
    // nextTick(() => {
    //   treeRef.value &&
    //     treeRef.value.forEach(element => {
    //       element.setCurrentKey(id); // 因为我的node-key="code" 所以我的是code
    //     });
    // });
  } else {
    ElMessage.error(res?.mssage);
  }
  console.log(res, "获取部门树");
};
departTreeFun();
// 默认展开
const defaultExpanded = ref();
// 默认选中
const currentKey = ref();
// 添加或更新
const formData = ref({
  id: "",
  deptName: "",
  deptType: null,
  displayOrder: null,
  parentId: "",
  address: ""
});
const submitFun = async () => {
  console.log("提交");
  let res: any = await addOrUpdateUser(formData.value);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    departTreeFun();
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 点击部门
const setParentId = ref();
const handleNode = (val: any) => {
  console.log("节点数据", val);
  formData.value.id = val.id;
  formData.value.address = val?.address; //字段里没有
  formData.value.deptType = val?.deptType;
  formData.value.displayOrder = val.displayOrder;
  formData.value.deptName = val.name;
  setParentId.value = val.id;
};
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
// 删除部门
const deleteDepart = async () => {
  await useHandleData(deleteDepartById, { id: formData.value?.id }, `删除【${formData.value.deptName}】部门`);
  departTreeFun();
};
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
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  right: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 自定义 */
::v-deep .tree-line {
  .el-tree-node {
    position: relative;
    padding-left: 16px; // 缩进量
  }
  .el-tree-node__children {
    padding-left: 16px; // 缩进量 ： 使引导线达到居中效果
  }

  // 竖线
  .el-tree-node::before {
    position: absolute;
    top: -26px;
    left: -3px;
    width: 1px;
    height: 100%;
    content: "";
    border-width: 1px;
    border-left: 1px dashed #52627c;
  }

  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    position: absolute;
    top: 12px;
    left: -3px;
    width: 24px;
    height: 20px;
    content: "";
    border-width: 1px;
    border-top: 1px dashed #52627c;
  }

  // 去掉最顶层的虚线，主要是不注释 位置不对等 丑
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  .el-tree-node__expand-icon {
    font-size: 16px;

    // 叶子节点（无子节点）
    &.is-leaf {
      display: none; //默认注释掉 会有一点空白，丑
      /* stylelint-disable-next-line scss/double-slash-comment-whitespace-inside */
      color: black;
    }
  }
}
</style>
