<template>
  <div>
    <!-- 新增部件  -->
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="部件名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="部件编码" prop="code">
        <el-input v-model="ruleForm.code" />
      </el-form-item>
      <el-form-item label="排序字段" prop="sort">
        <el-input v-model="ruleForm.sort" />
      </el-form-item>
      <el-form-item label="部件描述" prop="description">
        <el-input v-model.number="ruleForm.description" />
      </el-form-item>

      <el-form-item label="振动系统" prop="useVib">
        <el-radio-group v-model="ruleForm.useVib">
          <el-radio :value="0" size="large">不使用</el-radio>
          <el-radio :value="1" size="large">使用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="润滑系统" prop="useLub">
        <el-radio-group v-model="ruleForm.useLub">
          <el-radio :value="0" size="large">不使用</el-radio>
          <el-radio :value="1" size="large">使用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="油液系统" prop="useOil">
        <el-radio-group v-model="ruleForm.useOil">
          <el-radio :value="0" size="large">不使用</el-radio>
          <el-radio :value="1" size="large">使用</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 油液相关 start -->
      <el-form-item label="油液系统型号" prop="oilDeviceType" v-if="ruleForm.useOil == 1">
        <el-input v-model="ruleForm.oilDeviceType" placeholder="请输入油液系统型号" clearable />
      </el-form-item>
      <el-form-item label="油液系统通信方式" prop="oilMessageType" v-if="ruleForm.useOil == 1">
        <el-select v-model="ruleForm.oilMessageType" class="m-2" placeholder="请选择">
          <el-option v-for="item in oilMessageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="油液tcp通信唯一标识" prop="oilTcpSn" v-if="ruleForm.useOil == 1">
        <el-input v-model="ruleForm.oilTcpSn" placeholder="请输入唯一标识" clearable />
      </el-form-item>
      <el-form-item label="油液 plc" prop="oilTcpAddress" v-if="ruleForm.useOil == 1">
        <el-input v-model="ruleForm.oilTcpAddress" placeholder="请输入油液plc地址" clearable />
      </el-form-item>
      <!-- 油液相关 end -->
      <!-- 润滑相关 -->
      <el-form-item label="润滑系统物联网卡号" prop="lubSim" v-if="TXRequired">
        <el-input v-model="ruleForm.lubSim"></el-input>
      </el-form-item>
      <el-form-item label="润滑系统通讯方式" prop="messageType" :required="TXRequired" v-if="TXRequired">
        <el-select v-model="ruleForm.messageType" class="m-2" placeholder="请选择">
          <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="润滑泵类型" prop="pumpStationType" :required="TXRequired" v-if="TXRequired">
        <el-select v-model="ruleForm.pumpStationType" class="m-2" placeholder="请选择">
          <el-option v-for="item in pumpStationTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="舍弗勒的设备字符" prop="schaefflerDeviceId" :required="SFLRequired" v-if="SFLRequired">
        <el-input v-model="ruleForm.schaefflerDeviceId" placeholder="舍弗勒的设备字符" clearable />
      </el-form-item>

      <el-form-item
        label="网关sn号"
        :required="(snPlcRequired || MQTTRequired) && TXRequired"
        v-if="(snPlcRequired || MQTTRequired) && TXRequired"
      >
        <el-input v-model="ruleForm.gatewaySn" placeholder="网关sn号" clearable />
      </el-form-item>
      <!-- MQTT时必填 -->
      <el-form-item label="地址" prop="siteId" :required="MQTTRequired" v-if="MQTTRequired && TXRequired">
        <el-input v-model="ruleForm.siteId" placeholder="地址" clearable />
      </el-form-item>

      <el-form-item label="plc地址" :required="snPlcRequired && TXRequired" v-if="snPlcRequired && TXRequired">
        <el-input v-model="ruleForm.plcAddress" placeholder="plc地址" clearable />
      </el-form-item>

      <el-form-item
        label="版本"
        prop="communicationVersion"
        :required="snPlcRequired && TXRequired"
        v-if="snPlcRequired && TXRequired"
      >
        <el-select v-model="ruleForm.communicationVersion" class="m-2" placeholder="请选择版本">
          <el-option v-for="item in communicationVersionOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 单线和递进特有 start -->
      <div v-if="ruleForm.pumpStationType == 1 || ruleForm.pumpStationType == 4">
        <el-form-item label="时间单位" prop="timeUnit">
          <el-select v-model="ruleForm.timeUnit" class="m-2" placeholder="请选择单位" clearable>
            <el-option v-for="item in timeUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="分配器数量" prop="distributorsNumber">
          <el-select v-model="ruleForm.distributorsNumber" class="m-2" placeholder="请选择分配器数量" clearable>
            <el-option v-for="item in distributorsNumberOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="1#分配器脉冲系数" v-if="Number(ruleForm.distributorsNumber) >= 1">
          <el-input v-model="ruleForm.coefficient" placeholder="请输入分配器脉冲系数" clearable />
        </el-form-item>
        <el-form-item label="2#分配器脉冲系数" v-if="Number(ruleForm.distributorsNumber) >= 2">
          <el-input v-model="ruleForm.coefficient2" placeholder="请输入分配器脉冲系数" clearable />
        </el-form-item>
        <el-form-item label="3#分配器脉冲系数" v-if="Number(ruleForm.distributorsNumber) >= 3">
          <el-input v-model="ruleForm.coefficient3" placeholder="请输入分配器脉冲系数" clearable />
        </el-form-item>
      </div>
      <!-- 单线和递进特有 end -->

      <div style="text-align: center">
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
        <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onBeforeMount, watchEffect } from "vue";
import { type ComponentSize, type FormInstance, type FormRules } from "element-plus";
const props = defineProps({
  rowData: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: ""
  }
});
const { rowData, title } = toRefs(props);
// 版本字典
const communicationVersionOptions = [
  { value: 1, label: "v1" },
  { value: 2, label: "v2" },
  { value: 3, label: "v3 " }
];
const pumpStationTypeOptions = [
  { value: 4, label: "递进" },
  { value: 1, label: "单线" },
  { value: 2, label: "双线" },
  { value: 3, label: "ATL3000" },
  { value: 5, label: "单点泵" }
];
const messageTypeOptions = [
  { value: 1, label: "MQTT" },
  { value: 2, label: "TCP" },
  { value: 3, label: "舍弗勒接口 " }
];
// 油液系统通信方式 0：MQTT，1：TCP
const oilMessageTypeOptions = [
  { value: 0, label: "MQTT" },
  { value: 1, label: "TCP" }
];
// 分配器数量
const distributorsNumberOptions = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" }
];
// 时间单位
const timeUnitOptions = [
  { value: 1, label: "天-小时" },
  { value: 2, label: "小时-分钟" }
];
interface RuleForm {
  equipId: string; //所属设备id
  name: string;
  description: string;
  remark: string;
  code: string;
  sort: number | undefined;
  useVib: number | null;
  useLub: number | null;
  useOil: number | null;
  lubSim: string; //润滑系统使用的物联网卡号
  messageType: number | null;
  pumpStationType: number | null;
  schaefflerDeviceId: string;
  gatewaySn: string;
  siteId: string; //润滑地址
  plcAddress: string;
  oilDeviceType: string | null;
  oilMessageType: string | null;
  oilTcpSn: string | null;
  oilTcpAddress: string | null;
  communicationVersion: number | null;
  // 分配器相关字段
  distributorsNumber: string | number;
  coefficient: string | number;
  coefficient2: string | number;
  coefficient3: string | number;
  timeUnit: number | null;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  equipId: "",
  name: "",
  description: "",
  remark: "",
  code: "",
  sort: 1,
  useVib: 0,
  useLub: 0,
  useOil: 0,
  lubSim: "",
  messageType: null,
  pumpStationType: null,
  schaefflerDeviceId: "",
  siteId: "",
  gatewaySn: "",
  plcAddress: "",
  oilDeviceType: "",
  oilMessageType: "",
  oilTcpSn: "",
  oilTcpAddress: "",
  communicationVersion: null,
  // 分配器相关字段
  distributorsNumber: "", //分配器数量 下拉筛选 1,2,3
  coefficient: "", //分配器脉冲系数
  coefficient2: "",
  coefficient3: "",
  timeUnit: 2
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  sort: [{ required: true, message: "排序字段不能为空", trigger: "blur" }],
  oilDeviceType: [{ required: true, message: "请输入油液系统型号", trigger: "blur" }],
  oilMessageType: [{ required: true, message: "请选择油液系统通信方式", trigger: "change" }],
  oilTcpSn: [{ required: true, message: "请输入唯一标识", trigger: "blur" }],
  oilTcpAddress: [{ required: true, message: "请输入油液plc地址", trigger: "blur" }],
  communicationVersion: [{ required: true, message: "请选择版本", trigger: "change" }]
});
// 方法区
// 数据监听
let TXRequired = ref(false);
let SFLRequired = ref(false);
let snPlcRequired = ref(false); //网关sn号，plc地址 必填
let MQTTRequired = ref(false);
watchEffect(() => {
  if (ruleForm.useLub == 1) {
    //使用润滑系统
    TXRequired.value = true;
  } else {
    TXRequired.value = false;
    ruleForm.messageType = null;
    ruleForm.pumpStationType = null;
    ruleForm.lubSim = "";
  }
  if (ruleForm.messageType == 3) {
    SFLRequired.value = true;
  } else {
    SFLRequired.value = false;
  }
  if (ruleForm.messageType == 2) {
    snPlcRequired.value = true;
  } else {
    snPlcRequired.value = false;
  }
  // 如果使用了润滑系统 && 润滑泵类型是MQTT
  if (ruleForm.useLub == 1 && ruleForm.messageType == 1) {
    MQTTRequired.value = true;
  } else {
    MQTTRequired.value = false;
    ruleForm.siteId = "";
  }

  // 如果不是递进泵，单线，清空分配器数量
  if (ruleForm.pumpStationType != 1 && ruleForm.pumpStationType != 4) {
    ruleForm.distributorsNumber = "";
    ruleForm.timeUnit = null;
  }
  if (Number(ruleForm.distributorsNumber) < 1) {
    ruleForm.coefficient = "";
    ruleForm.coefficient2 = "";
    ruleForm.coefficient3 = "";
  }
  if (ruleForm.distributorsNumber == 1) {
    ruleForm.coefficient2 = "";
    ruleForm.coefficient3 = "";
  }
  if (ruleForm.distributorsNumber == 2) {
    ruleForm.coefficient3 = "";
  }
  // 如果不使用油液，以下字段要清空
  if (ruleForm.useOil == 1) {
    ruleForm.oilDeviceType = "";
    ruleForm.oilMessageType = "";
    ruleForm.oilTcpSn = "";
    ruleForm.oilTcpAddress = "";
  }
});
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      emit("submitForm");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  emit("closeDialog");
};
onBeforeMount(() => {
  ruleForm.equipId = rowData.value.id;
  if (rowData?.value && title.value == "编辑") {
    ruleForm = rowData.value as any;
  } else {
  }
});
// 暴露
defineExpose({ ruleForm });
</script>
<style scoped>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
