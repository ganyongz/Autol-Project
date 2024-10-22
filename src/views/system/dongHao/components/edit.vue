<template>
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
    <el-form-item label="仪器序列号" prop="serial">
      <el-input v-model="ruleForm.serial" disabled />
    </el-form-item>
    <el-form-item label="仪器名称" prop="name">
      <el-input v-model="ruleForm.name" disabled />
    </el-form-item>
    <el-form-item label="仪器类型" prop="type">
      <el-input v-model="ruleForm.type" disabled />
    </el-form-item>
    <el-form-item label="仪器IP" prop="ip">
      <el-input v-model="ruleForm.ip" disabled />
    </el-form-item>
    <el-form-item label="电池电量" prop="battery">
      <el-input v-model="ruleForm.battery" disabled />
    </el-form-item>
    <el-form-item label="是否支持NTP" prop="canNtp">
      <el-input v-model="ruleForm.canNtp" disabled />
    </el-form-item>
    <el-form-item label="是否参与NTP" prop="joinNtp">
      <el-input v-model="ruleForm.joinNtp" disabled />
    </el-form-item>
    <el-form-item label="数据源" prop="serviceSource">
      <el-input v-model="ruleForm.serviceSource" disabled />
    </el-form-item>
    <el-form-item label="采样工作时长（分钟）" prop="samplingTime">
      <el-input v-model.number="ruleForm.samplingTime" />
    </el-form-item>
    <el-form-item label="停止时长（分钟）" prop="stopTime">
      <el-input v-model.number="ruleForm.stopTime" />
    </el-form-item>

    <div style="text-align: center">
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
      <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onBeforeMount } from "vue";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import { move_updateCycleById } from "@/api/system/dongHao";
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
interface RuleForm {
  id: string;
  serial: string;
  name: string;
  type: string;
  ip: string;
  battery: string;
  canNtp: string;
  joinNtp: string;
  serviceSource: string;
  samplingTime: string;
  stopTime: string;
  operation: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  id: "",
  serial: "",
  name: "",
  type: "",
  ip: "",
  battery: "",
  canNtp: "",
  joinNtp: "",
  serviceSource: "",
  samplingTime: "",
  stopTime: "",
  operation: ""
});

const rules = reactive<FormRules<RuleForm>>({
  samplingTime: [{ required: true, message: "请输入采样工作时长（分钟）", trigger: "blur" }],
  stopTime: [{ required: true, message: "请输入采样工作时长（分钟）", trigger: "blur" }]
});
// 方法区
onBeforeMount(() => {
  if (rowData?.value && title.value == "编辑") {
    ruleForm = rowData.value as any;
  } else {
  }
});
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await move_updateCycleById(ruleForm);
      if (res.code == "200") {
        ElMessage.success("保存成功");
        emit("submitForm");
      } else {
        ElMessage.error(res?.message);
      }
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

// 暴露
defineExpose({ ruleForm });
</script>
