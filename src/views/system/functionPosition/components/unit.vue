<template>
  <div style="width: 100%">
    <!-- 部件详情 -->
    <el-card>
      <el-button type="primary" @click="saveUnit">保存</el-button>
      <el-button type="danger" @click="deleteFun">删除</el-button>

      <el-form :inline="true" ref="ruleFormRef" :model="formInline" :rules="rules" class="demo-form-inline" label-width="240">
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
        <el-form-item label="振动系统" prop="useVib">
          <el-radio-group v-model="formInline.useVib">
            <el-radio :value="0" size="large">不使用</el-radio>
            <el-radio :value="1" size="large">使用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="润滑系统" prop="useLub">
          <el-radio-group v-model="formInline.useLub">
            <el-radio :value="0" size="large">不使用</el-radio>
            <el-radio :value="1" size="large">使用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="油液系统" prop="useOil">
          <el-radio-group v-model="formInline.useOil">
            <el-radio :value="0" size="large">不使用</el-radio>
            <el-radio :value="1" size="large">使用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="通讯方式" prop="messageType" :required="TXRequired">
          <el-select v-model="formInline.messageType" class="m-2" placeholder="请选择">
            <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="润滑泵类型" prop="pumpStationType" :required="TXRequired">
          <el-select v-model="formInline.pumpStationType" class="m-2" placeholder="请选择">
            <el-option v-for="item in pumpStationTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div v-if="formInline.pumpStationType == 3">
            <el-button type="primary" @click="configur">配置</el-button>
            <el-tooltip placement="bottom">
              <template #content>泵类型为ATL3000时，<br />请配置相关项</template>
              <el-badge class="item" value="?" :offset="[10, 5]"> </el-badge>
            </el-tooltip>
          </div>
        </el-form-item>

        <el-form-item label="舍弗勒的设备字符" :required="SFLRequired">
          <el-input v-model="formInline.schaefflerDeviceId" placeholder="舍弗勒的设备字符" clearable />
        </el-form-item>

        <el-form-item label="网关sn号" :required="snPlcRequired">
          <el-input v-model="formInline.gatewaySn" placeholder="网关sn号" clearable />
        </el-form-item>

        <el-form-item label="plc地址" :required="snPlcRequired">
          <el-input v-model="formInline.plcAddress" placeholder="plc地址" clearable />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabHandleClick">
        <el-tab-pane label="测点" name="first">
          <!-- 部件id -> formInline.id -->
          <el-button type="primary" @click="openEquipPoint('新增测点', { id: formInline.id })">新增测点</el-button>
          <el-button>删除</el-button>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="测点名称" />
            <el-table-column prop="code" label="测点编码" />
            <el-table-column prop="pointUnit" label="测点单位" />
            <el-table-column prop="vibType" label="振动类型">
              <template #default="scoped">
                <p v-for="item in typeOptions" :key="item.value">
                  <span v-if="item.value == scoped.row['vibType']">{{ item.label }}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="pointType" label="测点类型">
              <template #default="scoped">
                <p v-for="item in pointTypeOptions" :key="item.value">
                  <span v-if="item.value == scoped.row['pointType']">{{ item.label }}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="bindServerPointName" label="绑定数据测点名称" />
            <el-table-column prop="serverPointType" label="绑定数据测点类型" />

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
    <!-- ATL3000 配置 -->
    <myDialog title="ATL3000配置" ref="ATLDialog" draggable width="65%" :before-close="closeDialog2">
      <template #content>
        <ATL3k
          v-if="IsShowATL3k"
          ref="ATL3kRef"
          :part-id="formInline.id"
          title="ATL3000配置"
          @close-dialog="closeDialog2"
          @submit-form="saveEquipPoint"
        />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, watchEffect } from "vue";
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
import ATL3k from "@/views/system/functionPosition/components/ATL3k.vue";
import mittBus from "@/utils/mittBus";
let props = defineProps({
  nodeData: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const { nodeData } = toRefs(props);
const pumpStationTypeOptions = [
  { value: 1, label: "递进单线" },
  { value: 2, label: "递进双线" },
  { value: 3, label: "ATL3000" }
];
const messageTypeOptions = [
  { value: 1, label: "MQTT" },
  { value: 2, label: "TCP" },
  { value: 3, label: "舍弗勒接口 " }
];
const pointTypeOptions = [
  { value: "Vib", label: "振动" },
  { value: "StartStop", label: "启停" },
  { value: "Temperature", label: "温度" },
  { value: "RotateSpeed", label: "转速" }
]; //测点类型
const typeOptions = [
  { value: "Acceleration", label: "加速度" },
  { value: "Speed", label: "速度" },
  { value: "Displacement", label: "位移" }
]; //振动类型
const formInline = reactive({
  equipId: nodeData.value.id, //所属设备id
  name: "",
  description: "",
  remark: "",
  code: "",
  sort: null,
  id: undefined,
  useVib: null,
  useLub: null,
  useOil: null,
  messageType: null,
  schaefflerDeviceId: "",
  pumpStationType: null,
  gatewaySn: "",
  plcAddress: ""
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
    formInline.useVib = data.useVib;
    formInline.useLub = data.useLub;
    formInline.useOil = data.useOil;
    formInline.messageType = data.messageType;
    formInline.schaefflerDeviceId = data.schaefflerDeviceId;
    formInline.pumpStationType = data.pumpStationType;
    formInline.gatewaySn = data.gatewaySn;
    formInline.plcAddress = data.plcAddress;
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
    mittBus.emit("refreshLocationTree");
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
    mittBus.emit("refreshLocationTree");
    closeDialog();
    getEquipPointList();
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除测点
const deleteEquipPoint = async (rowData: Object) => {
  await useHandleData(equipPoint_deleteById, { id: rowData["id"] }, `删除【${nodeData.value.name}】测点`);
  getEquipPointList();
};
// 数据监听
let TXRequired = ref(false);
let SFLRequired = ref(false);
let snPlcRequired = ref(false); //网关sn号，plc地址 必填
watchEffect(() => {
  if (formInline.useLub == 1) {
    TXRequired.value = true;
  } else {
    TXRequired.value = false;
  }
  if (formInline.messageType == 3) {
    SFLRequired.value = true;
  } else {
    SFLRequired.value = false;
  }
  if (formInline.messageType == 2) {
    snPlcRequired.value = true;
  } else {
    snPlcRequired.value = false;
  }
});
const rules = reactive<any>({
  TXRequired: [
    {
      message: "请选择通讯方式",
      trigger: "change"
    }
  ]
});

//  ATL3000配置
const ATLDialog = ref();
const IsShowATL3k = ref(false);
// 配置
const configur = () => {
  IsShowATL3k.value = true;
  ATLDialog.value.open();
};
const closeDialog2 = () => {
  ATLDialog.value.close();
  IsShowATL3k.value = false;
};

getEquipPartDetailFun();
</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
:deep(.el-radio-group) {
  width: 220px;
}
</style>
