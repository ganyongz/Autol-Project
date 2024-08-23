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

      <el-form-item label="通讯方式" prop="messageType" :required="TXRequired" v-if="TXRequired">
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

      <el-form-item label="网关sn号" :required="snPlcRequired && TXRequired" v-if="snPlcRequired && TXRequired">
        <el-input v-model="ruleForm.gatewaySn" placeholder="网关sn号" clearable />
      </el-form-item>

      <el-form-item label="plc地址" :required="snPlcRequired && TXRequired" v-if="snPlcRequired && TXRequired">
        <el-input v-model="ruleForm.plcAddress" placeholder="plc地址" clearable />
      </el-form-item>

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
  messageType: number | null;
  pumpStationType: number | null;
  schaefflerDeviceId: string;
  gatewaySn: string;
  plcAddress: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  equipId: "",
  name: "",
  description: "",
  remark: "",
  code: "",
  sort: undefined,
  useVib: null,
  useLub: null,
  useOil: null,
  messageType: null,
  pumpStationType: null,
  schaefflerDeviceId: "",
  gatewaySn: "",
  plcAddress: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
});
// 方法区
// 数据监听
let TXRequired = ref(false);
let SFLRequired = ref(false);
let snPlcRequired = ref(false); //网关sn号，plc地址 必填
watchEffect(() => {
  if (ruleForm.useLub == 1) {
    TXRequired.value = true;
  } else {
    TXRequired.value = false;
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
