<template>
  <div>
    <span>仪器管理 </span>
    <el-divider />
    <div>
      <el-button type="primary" @click="addCollectorFun('新增采集器', {})">新增仪器</el-button>
      <!-- <el-button type="danger">删除仪器</el-button> -->
    </div>
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'date', order: 'descending' }"
      height="400px"
      style="width: 100%"
      @row-click="handleRow"
    >
      <el-table-column prop="name" label="采集器名称" sortable />
      <el-table-column prop="code" label="采集器编码" sortable />
      <el-table-column prop="collectorModel" label="采集器型号" sortable />
      <el-table-column prop="ip" label="采集器ip" sortable />
      <el-table-column prop="configJson" label="采集器配置字符串" sortable />
      <el-table-column prop="description" label="采集器描述" sortable />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="addCollectorFun('编辑采集器', scope.row)"> 编辑 </el-button>
          <el-button link type="primary" @click="addSensorFun('新增传感器', scope.row)">新增传感器</el-button>
          <el-button link type="danger" @click="deleteFun(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <fieldset>
      <legend>传感器信息</legend>
      <el-table :data="cgq_tableData" :default-sort="{ prop: 'date', order: 'descending' }" height="400px" style="width: 100%">
        <el-table-column prop="name" label="传感器名称" sortable />
        <el-table-column prop="code" label="传感器编码" sortable />
        <el-table-column prop="collectorChannelNum" label="对应采集器通道号" sortable />
        <el-table-column prop="vibAxis" label="振动采集方向" sortable />
        <el-table-column prop="sensitivity" label="灵敏度" sortable />
        <el-table-column prop="description" label="传感器描述" sortable />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="addSensorFun('编辑传感器', scope.row)"> 编辑 </el-button>
            <el-button link type="danger" @click="deleteSensorFun(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </fieldset>
    <!-- 新增、编辑采集器 -->
    <myDialog :title="Ttitle" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <addCollector
          v-if="IsShowAdd"
          ref="addEditCollectorRef"
          :row-data="rowData"
          :title="Ttitle"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
    <!-- 新增、编辑传感器 -->
    <myDialog :title="Ttitle" ref="myDialog2" draggable width="700px" :before-close="beforeClose2">
      <template #content>
        <addSensor
          v-if="IsShowSensor"
          ref="addEditSensorRef"
          :row-data="rowData"
          :title="Ttitle"
          @close-dialog="closeDialog2"
          @submit-form="submitForm2"
        />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup name="collector">
import { ref } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import addCollector from "@/views/system/onlineSetup/instrumentMaintain/components/addCollector.vue";
import addSensor from "@/views/system/onlineSetup/instrumentMaintain/components/addSensor.vue";
import {
  collector_List,
  collector_deleteById,
  collector_addOrUpdate,
  sensor_sensorList,
  sensor_addOrUpdate,
  sensor_deleteBySensorIds
} from "@/api/system/instrumentMaintain";

let tableData = ref([]);
let cgq_tableData = ref([]);
// 方法区
//获取采集器列表
const getCollectorList = async () => {
  const res: any = await collector_List({});
  if (res.code == "200") {
    tableData.value = res.data;
  } else {
    ElMessage.error(res?.mssage);
  }
};

// 新增、编辑（采集器）
let addEditCollectorRef = ref();
let rowData = ref();
let Ttitle = ref();
import myDialog from "@/components/dialog/myDialog.vue";
const myDialog1 = ref();
const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const addCollectorFun = (title: string, row: any) => {
  IsShowAdd.value = true;
  Ttitle.value = title;
  rowData.value = row;
  myDialog1.value.open();
};
//保存采集器
const submitForm = async () => {
  let res: any = await collector_addOrUpdate(addEditCollectorRef.value.ruleForm);
  if (res.code == "200") {
    getCollectorList();
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

// 删除采集器
const deleteFun = async (rowData: any) => {
  await useHandleData(collector_deleteById, { id: rowData.id }, `删除【${rowData.name}】`);
  getCollectorList();
};
//点击行
const handleRow = (row: any) => {
  getSensorList(row);
};
// 传感器相关
//获取传感器列表
const getSensorList = async (rowData: any) => {
  const res: any = await sensor_sensorList({ collectorId: rowData.id });
  if (res.code == "200") {
    cgq_tableData.value = res.data;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除传感器
const deleteSensorFun = async (rowData: any) => {
  await useHandleData(sensor_deleteBySensorIds, { sensorIds: rowData.id }, `删除【${rowData.name}】`);
  getSensorList({ id: rowData.collectorId });
};
// 新增、编辑（传感器）
let addEditSensorRef = ref();
const myDialog2 = ref();
const IsShowSensor = ref(false);
const beforeClose2 = () => {
  IsShowSensor.value = false;
  myDialog2.value.close();
};
const addSensorFun = (title: string, row: any) => {
  IsShowSensor.value = true;
  Ttitle.value = title;
  rowData.value = row;
  myDialog2.value.open();
};
const submitForm2 = async () => {
  let res: any = await sensor_addOrUpdate(addEditSensorRef.value.ruleForm);
  if (res.code == "200") {
    getSensorList({ id: rowData.value.id });
    ElMessage.success("保存成功");
  } else {
    ElMessage.error(res?.mssage);
  }
  myDialog2.value.close();
  IsShowSensor.value = false;
};
const closeDialog2 = () => {
  myDialog2.value.close();
  IsShowSensor.value = false;
};

getCollectorList(); //获取采集器
</script>
<style scoped lang="scss">
fieldset {
  color: #01649e;
  border-radius: 10px;
}
fieldset legend {
  padding: 0 20px; /**  文字与线之间的缝隙大小 */
  margin: 0 20px; /**  文字距离左右边框的距离 */
  color: #01649e;
}
</style>
