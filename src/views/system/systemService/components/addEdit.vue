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
    <el-form-item label="服务名" prop="serviceName">
      <el-input v-model="ruleForm.serviceName" />
    </el-form-item>
    <el-form-item label="http监控地址" prop="monitorUrl">
      <el-input v-model="ruleForm.monitorUrl" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="ruleForm.status" placeholder="Select">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="运行模式" prop="runModel">
      <el-select v-model="ruleForm.runModel" placeholder="Select">
        <el-option v-for="item in runModelOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="监控模式" prop="monitorModel">
      <el-select v-model="ruleForm.monitorModel" placeholder="Select">
        <el-option v-for="item in monitorModelOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="备注" prop="description">
      <el-input v-model="ruleForm.description" />
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
import { service_addService, service_updateService } from "@/api/system/systemService";
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
  serviceName: string;
  monitorUrl: string;
  status: number | undefined;
  runModel: number | undefined;
  monitorModel: number | undefined;
  description: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  serviceName: "",
  monitorUrl: "",
  status: undefined,
  runModel: undefined,
  monitorModel: undefined,
  description: ""
});
// 状态
let statusOptions = [
  { value: 0, label: "正常" },
  { value: 1, label: "异常" }
];
// 运行模式
let runModelOptions = [
  { value: 1, label: "自动" },
  { value: 2, label: "手动" }
];
// 监控模式
let monitorModelOptions = [
  { value: 1, label: "windows命令" },
  { value: 2, label: "http" }
];
const rules = reactive<FormRules<RuleForm>>({
  serviceName: [{ required: true, message: "请输入名称", trigger: "blur" }]
  // sn: [{ required: true, message: "请输入sn", trigger: "blur" }],
  // boxNum: [{ required: true, message: "请输入箱号", trigger: "blur" }],
  // channelNum: [{ required: true, message: "请输入通道号", trigger: "blur" }]
});
// 方法区
onBeforeMount(() => {
  if (rowData?.value && title.value == "编辑") {
    ruleForm.value = rowData.value as any;
  } else {
  }
});
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let url = title.value == "编辑" ? service_updateService : service_addService;
      const res: any = await url(ruleForm.value);
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
