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
          <span v-else>{{ scope.row.thresholdType == 1 ? "超上限" : "超下限" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="lowValue" label="下限报警值">
        <template #default="scope">
          <el-input v-model="scope.row.lowValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.lowValue }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="lowerValue" label="下限危险值">
        <template #default="scope">
          <el-input v-model="scope.row.lowerValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.lowerValue }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="highValue" label="上限报警值">
        <template #default="scope">
          <el-input v-model="scope.row.highValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.highValue }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="higherValue" label="上限危险值">
        <template #default="scope">
          <el-input v-model="scope.row.higherValue" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.higherValue }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="startPoint" label="ATL3000使用润滑起点">
        <template #default="scope">
          <el-input v-model="scope.row.startPoint" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.startPoint }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="endPoint" label="ATL3000使用润滑终点">
        <template #default="scope">
          <el-input v-model="scope.row.endPoint" v-if="scope.row.seen"></el-input>
          <span v-else>{{ scope.row.endPoint }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="relevancyLub" label="是否关联润滑">
        <template #default="scope">
          <el-select v-model="scope.row.relevancyLub" placeholder="请选择" style="width: 100%" v-if="scope.row.seen">
            <el-option v-for="item in relevancyLubOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-else>{{ scope.row.relevancyLub == 1 ? "是" : "否" }}</span>
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
        <Threshold v-if="IsShowAdd" ref="addEditRoleRef" :row-data="rowData" :title="title" />
      </template>
      <template #footer>
        <div style="text-align: center">
          <el-button type="primary" size="default" @click="submitForm">保存</el-button>
          <el-button size="default" @click="closeDialog">取消</el-button>
        </div>
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
  { value: 2, label: "超下限" }
];
// 是否关联润滑
const relevancyLubOptions = [
  { value: 1, label: "是" },
  { value: 0, label: "否" }
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
  } else if (tableData.value.length > 0) {
    ElMessage.warning("已存在阈值报警");
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
  if (!val.thresholdType) {
    ElMessage.warning("阈值报警类型不能为空");
    return;
  }
  if (val.thresholdType == 1) {
    //超上限校验
    if (!val.highValue) {
      ElMessage.warning("上限报警不能为空");
      return;
    }
    if (!val.higherValue) {
      ElMessage.warning("上限危险值不能为空");
      return;
    }
    if (parseFloat(val.higherValue) <= parseFloat(val.highValue)) {
      ElMessage.warning("上限危险值要大于上限报警");
      return;
    }
  }
  if (val.thresholdType == 2) {
    //超下限校验
    if (!val.lowValue) {
      ElMessage.warning("下限报警值不能为空");
      return;
    }
    if (!val.lowerValue) {
      ElMessage.warning("下限危险值不能为空");
      return;
    }
    if (parseFloat(val.lowValue) <= parseFloat(val.lowerValue)) {
      ElMessage.warning("下限危险值的值要小于下限报警值");
      return;
    }
  }
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
    ElMessage.error(res?.message);
  }
};
// 测点下阈值报警策略列表
const getPointThresholdTacticsList = async () => {
  let res: any = await equipPoint_pointThresholdTactics({ pointId: nodeData.value["id"] });
  if (res.code == "200") {
    tableData.value = res.data;
  } else {
    ElMessage.error(res?.message);
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
const submitForm = async () => {
  let res: any = await equipPoint_bindThresholdTacticsByTemplate({
    pointId: nodeData.value["id"],
    thresholdTemplateId: addEditRoleRef.value.multipleSelection
  });
  if (res.code == "200") {
    ElMessage.success("保存成功");
    getPointThresholdTacticsList();
  } else {
    ElMessage.error(res?.message);
  }
  myDialog1.value.close();
  IsShowAdd.value = false;
};
getPointThresholdTacticsList();
</script>

<style scoped lang="scss"></style>
