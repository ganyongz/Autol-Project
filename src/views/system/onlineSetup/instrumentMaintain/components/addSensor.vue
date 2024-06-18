<template>
  <div>
    <!-- 新增、编辑传感器 -->
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
      <el-form-item label="传感器名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="传感器编码" prop="code">
        <el-input v-model="ruleForm.code" />
      </el-form-item>
      <el-form-item label="传感器类型" prop="sensorType">
        <el-select v-model="ruleForm.sensorType" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in sensorTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="传感器类型" prop="status">
        <el-select v-model="ruleForm.status" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="对应采集器通道号" prop="collectorChannelNum">
        <el-input v-model="ruleForm.collectorChannelNum" />
      </el-form-item>

      <el-form-item label="振动采集方向" prop="vibAxis">
        <el-input v-model="ruleForm.vibAxis" />
      </el-form-item>

      <el-form-item label="灵敏度" prop="sensitivity">
        <el-input v-model="ruleForm.sensitivity" />
      </el-form-item>

      <el-form-item label="电量" prop="power">
        <el-input v-model="ruleForm.power" />
      </el-form-item>

      <el-form-item label="传感器描述" prop="description">
        <el-input v-model="ruleForm.description" />
      </el-form-item>

      <div style="text-align: center">
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
        <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onBeforeMount } from "vue";
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
// 传感器类型枚举值
const sensorTypeOptions = [
  { value: 0, label: "无线" },
  { value: 1, label: "有线" }
];
// 传感器类型枚举值
const statusOptions = [
  { value: 0, label: "异常" },
  { value: 1, label: "初始" },
  { value: 2, label: "正常" },
  { value: 3, label: "传感器异常" }
];

interface RuleForm {
  id: string;
  code: string;
  name: string;
  collectorId: string;
  collectorChannelNum: number | null;
  sensorType: number | null;
  vibAxis: string;
  sensitivity: string;
  power: string;
  status: number | null;
  description: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  code: "",
  name: "",
  collectorId: "",
  collectorChannelNum: null,
  sensorType: null,
  vibAxis: "",
  sensitivity: "",
  power: "",
  status: null,
  description: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
});
// 方法区

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
  if (rowData?.value && title.value == "新增传感器") {
    debugger;
    ruleForm.value.collectorId = rowData.value.id;
  } else {
    //编辑
    console.log(rowData?.value, "数据呢----");
    ruleForm.value = rowData.value as any;
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
