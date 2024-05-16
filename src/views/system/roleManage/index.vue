<template>
  <div class="card content-box">
    <!-- 角色管理 -->
    <el-container>
      <el-aside width="240px">
        <div class="container">
          <p class="pLeft">角色管理</p>
          <p class="pRight">
            <el-icon @click="addRole" size="25px" style="cursor: pointer"><CirclePlus /></el-icon>
          </p>
        </div>
        <el-tree
          style="max-width: 240px"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          highlight-current
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span style="display: inline-block; width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{
                node.label
              }}</span>
              <span>
                <el-icon @click="editRole(data)"><EditPen /></el-icon>
                <el-icon @click="deleteRole(node, data)"><Delete /></el-icon>
              </span>
            </span>
          </template>
        </el-tree>
      </el-aside>
      <el-container>
        <el-header>
          <el-button style="margin-left: 10px" type="primary" @click="bindUsers">绑定用户</el-button>
        </el-header>
        <el-main>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="userName" label="用户名称" />
            <el-table-column prop="realName" label="真实名" />
            <el-table-column prop="sex" label="性别">
              <template #default="scope">
                <span v-if="scope.row.sex == '1'">男</span>
                <span v-else>女</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话" />
            <el-table-column prop="isDisabled" label="状态">
              <template #default="scope">
                <span v-if="scope.row.isDisabled == '1'">禁用</span>
                <span v-else>正常</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <el-button link type="danger" @click="deleteFun([scope.row.id])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
    <!-- 新增角色弹框 -->
    <myDialog :title="title1" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <addEditRole
          v-if="IsShowAdd"
          ref="addEditRoleRef"
          :row-data="rowData"
          :title="title1"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
    <!-- 添加用户弹框 -->
    <myDialog :title="title2" ref="myDialog2" draggable width="900px" :before-close="beforeClose2">
      <template #content>
        <addUsers ref="addUsersRef" :key="bindKey" :role-id="roleId"></addUsers>
      </template>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" size="default" @click="submitUsers">保存</el-button>
          <el-button size="default" @click="beforeClose2">取消</el-button>
        </div>
      </template>
    </myDialog>
  </div>
</template>

<script setup lang="ts" name="roleManage">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getRoleList, deleteRoleByIds, getUserList, addRoleUser, deleteRoleUser } from "@/api/system/roleManage";
import { useHandleData } from "@/hooks/useHandleData";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import myDialog from "@/components/dialog/myDialog.vue";
import addEditRole from "@/views/system/roleManage/addEditRole.vue";
import addUsers from "@/views/system/roleManage/userList.vue";
let tableData = ref();
interface Tree {
  label: string;
  children?: Tree[];
}
const roleId = ref("");
const handleNodeClick = (data: Tree) => {
  console.log(data);
  roleId.value = data["id"];
  getUserListFun(data["id"]);
};

const treeData = ref([]);

const defaultProps = {
  children: "children",
  label: "name"
};
// 新增角色 start
const IsShowAdd = ref(false);
let title1 = ref("新增");
const myDialog1 = ref();
const addEditRoleRef = ref();
const addRole = () => {
  IsShowAdd.value = true;
  myDialog1.value.open();
};
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const submitForm = () => {
  // 保存
  myDialog1.value.close();
  getRoleListFun();
  IsShowAdd.value = false;
};
const closeDialog = () => {
  // 取消
  myDialog1.value.close();
  IsShowAdd.value = false;
};
// 删除角色
const deleteRole = async (node: any, data: any) => {
  await useHandleData(deleteRoleByIds, [data.id], `删除角色`);
  getRoleListFun();
};
// 新增角色 end
// 获取角色列表
const getRoleListFun = async () => {
  let res: any = await getRoleList();
  if (res.code == "200") {
    treeData.value = res.data as any;
    console.log(treeData.value, "获取角色列表");
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 获取角色下的用户
const getUserListFun = async (id: any) => {
  let res: any = await getUserList({ roleId: id });
  if (res.code == "200") {
    tableData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};

// 编辑角色
let rowData = ref();
const editRole = (val: any) => {
  console.log(val, "编辑参数");
  title1.value = "编辑";
  rowData.value = val;
  IsShowAdd.value = true;
  myDialog1.value.open();
};
// 绑定用户
const addUsersRef = ref();
const title2 = ref("新增角色用户");
const myDialog2 = ref();
const beforeClose2 = () => {
  myDialog2.value.close();
};
let bindKey = ref(0);
const bindUsers = () => {
  if (!!roleId.value) {
    bindKey.value++;
    myDialog2.value.open();
  } else {
    ElMessage.warning("请选择一个角色分组");
  }
};
const submitUsers = async () => {
  //绑定用户
  console.log(addUsersRef.value.multipleSelection);
  const objectsArray = addUsersRef.value.multipleSelection.length > 0 ? addUsersRef.value.multipleSelection : [];
  const idsArray = objectsArray.map(obj => obj.id);
  console.log("ids", idsArray);
  let res: any = await addRoleUser({ roleId: roleId.value, userIdList: idsArray });
  if (res.code == "200") {
    ElMessage.success("绑定成功");
    getUserListFun(roleId.value); //刷新列表
    myDialog2.value.close();
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除
const deleteFun = async (ids: any) => {
  await useHandleData(deleteRoleUser, { roleId: roleId.value, userIdList: ids }, `删除`);
  getUserListFun(roleId.value); //刷新列表
};
getRoleListFun();
</script>
<style scoped>
.content-box {
  align-items: normal;
}
.el-aside {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%) !important;
}

/* aside */
.container {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e1e1e1;
}
.pLeft {
  margin-left: 10px;
}
.pRight {
  margin-right: 10px;
  margin-left: auto;
}
</style>
