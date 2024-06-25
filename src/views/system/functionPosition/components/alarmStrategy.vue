<template>
  <div>
    <el-button type="primary" @click="openDialog">快捷新增阈值报警</el-button>
    <el-button type="warning" @click="addFun">新增阈值报警</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="thresholdType" label="阈值报警类型">
        <template #default="scope">
          <el-select v-model="scope.row.thresholdType" placeholder="请选择" style="width: 100%" v-if="scope.row.seen">
            <el-option v-for="item in thresholdTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-else>{{ scope.row.thresholdType }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="lowValue" label="低报">
        <template #default="scope">
          <el-input v-model="scope.row.lowValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.lowValue }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="lowerValue" label="低低报">
        <template #default="scope">
          <el-input v-model="scope.row.lowerValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.lowerValue }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="highValue" label="高报">
        <template #default="scope">
          <el-input v-model="scope.row.highValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.highValue }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="higherValue" label="高高报">
        <template #default="scope">
          <el-input v-model="scope.row.higherValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.higherValue }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="warning" @click="saveRow(scope.row)" v-if="scope.row.seen">保存</el-button>
          <el-button link type="primary" @click="editRow(scope.row)" v-else> 编辑 </el-button>
          <el-button link type="danger" @click="deleteRow(scope.row)" v-if="scope.row.id"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <myDialog :title="title" ref="myDialog1" draggable width="80%" :before-close="beforeClose1">
      <template #content>
        <Threshold
          v-if="IsShowAdd"
          ref="addEditRoleRef"
          :row-data="rowData"
          :title="title"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import Threshold from "@/views/system/Threshold/index.vue";
import { useHandleData } from "@/hooks/useHandleData";
import myDialog from "@/components/dialog/myDialog.vue";
import {
  equipPoint_pointThresholdTactics,
  equipPoint_updateThresholdTactics,
  equipPoint_bindThresholdTacticsByCustomize,
  equipPoint_deleteThresholdTactics,
  equipPoint_bindThresholdTacticsByTemplate
} from "@/api/system/functionPosition";
import { ElMessage } from "element-plus";
const props = defineProps({
  nodeData: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const thresholdTypeOptions = [
  { value: 1, label: "超上限" },
  { value: 2, label: "超下限" },
  { value: 3, label: "区间内" },
  { value: 4, label: "区间外" }
];
const { nodeData } = toRefs(props);
let newData = ref({
  // id: "",
  pointId: "",
  thresholdType: null,
  lowValue: "",
  lowerValue: "",
  highValue: "",
  higherValue: "",
  seen: true
});
const tableData = ref([{ seen: false }]);
const addFun = () => {
  if (tableData.value.some(obj => obj.seen == true)) {
    ElMessage.warning("请保存后再新增");
    return;
  } else {
    newData.value.seen = true;
    tableData.value.push(newData.value);
  }
};
const editRow = (val: any) => {
  // 遍历数组并修改属性值
  tableData.value.forEach(obj => {
    if (obj["id"] == val.id) {
      obj["seen"] = true;
    }
  });
};
const saveRow = async (val: any) => {
  let apiUrl = val.id ? equipPoint_updateThresholdTactics : equipPoint_bindThresholdTacticsByCustomize;
  let params = val;
  if (!val?.pointId) {
    params.pointId = nodeData.value["id"];
  }
  delete params.seen;
  let res: any = await apiUrl(val);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    getPointThresholdTacticsList();
    for (let key in newData.value) {
      if (newData.value.hasOwnProperty(key)) {
        newData.value[key] = "";
      }
    }
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 测点下阈值报警策略列表
const getPointThresholdTacticsList = async () => {
  let res: any = await equipPoint_pointThresholdTactics({ pointId: nodeData.value["id"] });
  if (res.code == "200") {
    tableData.value = res.data;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除
const deleteRow = async (val: any) => {
  await useHandleData(equipPoint_deleteThresholdTactics, { pointThresholdId: val.id }, `删除`);
  getPointThresholdTacticsList();
};
// 通过模板绑定阈值报警策略
const myDialog1 = ref();
const openDialog = (row: any) => {
  IsShowAdd.value = true;
  rowData.value = row;
  myDialog1.value.open();
};
let addEditRoleRef = ref();
let rowData = ref();
let title = ref("绑定阈值报警策略");

const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const closeDialog = () => {
  // 取消
  myDialog1.value.close();
  IsShowAdd.value = false;
};
const submitForm = async (val: any) => {
  let res: any = await equipPoint_bindThresholdTacticsByTemplate({ pointId: nodeData.value["id"], thresholdTemplateId: val[0] });
  if (res.code == "200") {
    ElMessage.success("保存成功");
    getPointThresholdTacticsList();
  } else {
    ElMessage.error(res?.mssage);
  }
  myDialog1.value.close();
  IsShowAdd.value = false;
};
getPointThresholdTacticsList();
</script>

<style scoped lang="scss"></style>
