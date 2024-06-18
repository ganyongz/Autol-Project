<template>
  <div>
    <span>MQTT管理 </span>
    <el-divider />
    <div>
      <el-button type="primary" @click="addCollectorFun('新增MQTT', {})">新增MQTT</el-button>
    </div>
    <el-table
      :data="tableData"
      :default-sort="{ prop: 'date', order: 'descending' }"
      height="400px"
      style="width: 100%"
      @row-click="handleRow"
    >
      <el-table-column prop="userName" label="用户名" sortable />
      <!-- <el-table-column prop="password" label="密码" sortable /> -->
      <el-table-column prop="ip" label="ip地址" sortable />
      <el-table-column prop="ip" label="采集器ip" sortable />
      <el-table-column prop="prot" label="端口" sortable />
      <el-table-column prop="source" label="数据来源" sortable />
      <el-table-column prop="remark" label="数据来源" sortable />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="addCollectorFun('编辑MQTT', scope.row)"> 编辑 </el-button>
          <el-button link type="primary" @click="addSensorFun('新增', scope.row)">新增Topic</el-button>
          <el-button link type="danger" @click="deleteFun(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <fieldset>
      <legend>Topic信息</legend>
      <el-table :data="topic_tableData" :default-sort="{ prop: 'date', order: 'descending' }" height="400px" style="width: 100%">
        <el-table-column prop="topic" label="订阅主题" sortable />
        <el-table-column prop="mqttServerId" label="mqtt服务id" sortable />
        <el-table-column prop="topicType" label="主题类型" sortable />
        <el-table-column prop="qos" label="QoS等级" sortable />
        <el-table-column prop="remark" label="备注" sortable />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="addSensorFun('编辑', scope.row)"> 编辑 </el-button>
            <el-button link type="danger" @click="deleteSensorFun(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </fieldset>
    <!-- 新增、编辑采集器 -->
    <myDialog :title="Ttitle" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <addMqtt
          v-if="IsShowAdd"
          ref="addEditCollectorRef"
          :row-data="rowData"
          :title="Ttitle"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
    <!-- 新增、编辑topic -->
    <myDialog :title="Ttitle" ref="myDialog2" draggable width="700px" :before-close="beforeClose2">
      <template #content>
        <addTopic
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
import addMqtt from "@/views/system/onlineSetup/instrumentMaintain/components/addMqtt.vue";
import addTopic from "@/views/system/onlineSetup/instrumentMaintain/components/addTopic.vue";
import {
  MqttServer_List,
  MqttServer_addOrUpdate,
  MqttServer_deleteById,
  MqttServer_TopicList,
  MqttServer_addOrUpdateTopic,
  MqttServer_deleteTopicIds
} from "@/api/system/mqtt";

let tableData = ref([]);
let topic_tableData = ref([]);
// 方法区
//获取MQTT列表
const getCollectorList = async () => {
  const res: any = await MqttServer_List({});
  if (res.code == "200") {
    tableData.value = res.data;
  } else {
    ElMessage.error(res?.mssage);
  }
};

// 新增、编辑（MQTT）
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
//保存MQTT
const submitForm = async () => {
  let res: any = await MqttServer_addOrUpdate(addEditCollectorRef.value.ruleForm);
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

// 删除MQTT
const deleteFun = async (rowData: any) => {
  await useHandleData(MqttServer_deleteById, { id: rowData.id }, `删除【${rowData.userName}】`);
  getCollectorList();
};
//点击行
const handleRow = (row: any) => {
  getSensorList(row);
};
// topic相关
//获取topic列表
const getSensorList = async (rowData: any) => {
  const res: any = await MqttServer_TopicList({ mqttServerId: rowData.id });
  if (res.code == "200") {
    topic_tableData.value = res.data;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除topic
const deleteSensorFun = async (rowData: any) => {
  await useHandleData(MqttServer_deleteTopicIds, [rowData.id], `删除【${rowData.topic}】`);
  getSensorList({ id: rowData.collectorId });
};
// 新增、编辑（topic）
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
  let res: any = await MqttServer_addOrUpdateTopic(addEditSensorRef.value.ruleForm);
  if (res.code == "200") {
    getCollectorList();
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

getCollectorList(); //获取MQTT
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
