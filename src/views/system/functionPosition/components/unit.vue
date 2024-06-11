<template>
  <div style="width: 100%">
    <!-- 部件详情信息 -->
    <el-card>
      <el-button type="primary" @click="saveUnit">保存</el-button>
      <el-button type="danger" @click="deleteFun">删除</el-button>

      <el-form :inline="true" ref="ruleFormRef" :model="formInline" class="demo-form-inline" label-width="240">
        <el-form-item label="部件名称">
          <el-input v-model="formInline.name" placeholder="部件名称" clearable />
        </el-form-item>
        <el-form-item label="部件编码">
          <el-input v-model="formInline.code" placeholder="部件编码" clearable />
        </el-form-item>
        <el-form-item label="排序字段">
          <el-input v-model="formInline.sort" placeholder="排序字段" clearable />
        </el-form-item>
        <el-form-item label="部件描述">
          <el-input v-model="formInline.description" placeholder="部件描述" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabHandleClick">
        <el-tab-pane label="离线测点" name="first">
          <!-- 部件id -> formInline.id -->
          <el-button type="primary" @click="openEquipPoint('新增测点', { id: formInline.id })">新增测点</el-button>
          <el-button ty>删除</el-button>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="测点名称" />
            <el-table-column prop="vibType" label="测量类型" />
            <el-table-column prop="pointType" label="报告类型" />
            <el-table-column prop="pointUnit" label="单位" />
            <el-table-column fixed="right" label="操作">
              <template #default="scoped">
                <el-button link type="primary" @click="openEquipPoint('编辑测点', scoped.row)">编辑</el-button>
                <el-button link type="danger" @click="deleteEquipPoint(scoped.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 新增测点 -->
    <myDialog :title="Ttitle" ref="myDialog1" draggable width="700px" :before-close="closeDialog">
      <template #content>
        <add-point
          v-if="IsShowAdd"
          ref="addEditPointRef"
          :row-data="rowData"
          :title="Ttitle"
          @close-dialog="closeDialog"
          @submit-form="saveEquipPoint"
        />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import {
  equipPart_findById,
  equipPart_addOrUpdate,
  equipPart_deleteById,
  equipPart_findPointList,
  equipPoint_addOrUpdate,
  equipPoint_deleteById
} from "@/api/system/functionPosition";
import { ElMessage } from "element-plus";
import myDialog from "@/components/dialog/myDialog.vue";
import addPoint from "@/views/system/functionPosition/components/addPoint.vue";
let props = defineProps({
  nodeData: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const { nodeData } = toRefs(props);
console.log(nodeData.value, "父亲传来的数据");

const formInline = reactive({
  equipId: nodeData.value.id, //所属设备id
  name: "",
  description: "",
  remark: "",
  code: "",
  sort: undefined,
  id: ""
});
// 获取详情
const getEquipPartDetailFun = async () => {
  let res: any = await equipPart_findById({ id: nodeData.value["id"] });
  if (res.code == "200") {
    let data = res.data as any;
    formInline.equipId = data.equipId;
    formInline.name = data.name;
    formInline.description = data.description;
    formInline.code = data.code;
    formInline.sort = data.sort;
    formInline.id = data.id;
    getEquipPointList();
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除部件
const deleteFun = async () => {
  await useHandleData(equipPart_deleteById, { id: formInline?.id }, `删除【${formInline.name}】`);
};
const saveUnit = async () => {
  let res: any = await equipPart_addOrUpdate(formInline);
  if (res.code == "200") {
    ElMessage.success("保存成功");
  } else {
    ElMessage.error(res?.mssage);
  }
}; //编辑部件
// 部件下的点位列表
const activeName = ref("first");
let tableData = ref();
// 获取测点列表 (传部件id)
const getEquipPointList = async () => {
  let res: any = await equipPart_findPointList({ partId: formInline.id });
  if (res.code == "200") {
    tableData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
const tabHandleClick = (tab: any, event: Event) => {
  console.log(tab, event);
};
// 新增测点
const Ttitle = ref("新增测点");
let addEditPointRef = ref();
let rowData = ref();
const myDialog1 = ref();
const IsShowAdd = ref(false);
const openEquipPoint = (title: string, row: any) => {
  IsShowAdd.value = true;
  rowData.value = row;
  Ttitle.value = title;
  myDialog1.value.open();
};
const closeDialog = () => {
  myDialog1.value.close();
  IsShowAdd.value = false;
};
const saveEquipPoint = async () => {
  let res: any = await equipPoint_addOrUpdate(addEditPointRef.value.ruleForm);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    closeDialog();
    getEquipPointList();
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除离线测点
const deleteEquipPoint = async (rowData: Object) => {
  await useHandleData(equipPoint_deleteById, { id: rowData["id"] }, `删除【${nodeData.value.name}】测点`);
  getEquipPointList();
};

getEquipPartDetailFun();
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
