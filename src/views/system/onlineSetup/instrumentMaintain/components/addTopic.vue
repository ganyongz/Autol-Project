<template>
  <div>
    <!-- 新增、编辑 Topic -->
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="主题" prop="topic">
        <el-input v-model="ruleForm.topic" />
      </el-form-item>

      <!-- <el-form-item label="mqtt服务id" prop="mqttServerId">
        <el-input v-model="ruleForm.mqttServerId" />
      </el-form-item> -->

      <el-form-item label="主题类型" prop="topicType">
        <el-select v-model="ruleForm.topicType" placeholder="请选择主题类型">
          <el-option v-for="item in topicTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="特征值类型" prop="featureType">
        <el-select v-model="ruleForm.featureType" placeholder="请选择特征值类型">
          <el-option v-for="item in featureTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="QoS等级" prop="qos">
        <el-select v-model="ruleForm.qos" placeholder="请选择QoS等级">
          <el-option v-for="item in QoSOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark" />
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
import { topicTypeOptions, QoSOptions, featureTypeOptions } from "./mqttOptions";
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
  name: string;
  mqttServerId: string;
  featureType: number | null;
  topic: string;
  topicType: string;
  qos: number | null;
  remark: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  name: "",
  mqttServerId: "",
  featureType: null,
  topic: "",
  topicType: "",
  qos: null,
  remark: ""
});

const rules = reactive<FormRules<RuleForm>>({
  topic: [{ required: true, message: "请输入主题", trigger: "blur" }]
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
  if (rowData?.value && title.value == "新增") {
    ruleForm.value.mqttServerId = rowData.value.id;
  } else {
    //编辑
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
