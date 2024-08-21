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
    <el-form-item label="阈值报警策略名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="ruleForm.type" placeholder="请选择类型">
        <el-option label="类型1" :value="1" />
        <el-option label="类型2" :value="2" />
      </el-select>
    </el-form-item>

    <el-form-item label="低报" prop="lowValue">
      <el-input v-model="ruleForm.lowValue" />
    </el-form-item>
    <el-form-item label="低低报" prop="lowerValue">
      <el-input v-model="ruleForm.lowerValue" />
    </el-form-item>

    <el-form-item label="高报" prop="highValue">
      <el-input v-model="ruleForm.highValue" />
    </el-form-item>
    <el-form-item label="高高报" prop="higherValue">
      <el-input v-model="ruleForm.higherValue" />
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
import { Threshold_addOrUpdate } from "@/api/system/Threshold";
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
  type: number;
  lowValue: string;
  lowerValue: string;
  highValue: string;
  higherValue: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  id: "",
  name: "",
  type: 1,
  lowValue: "",
  lowerValue: "",
  highValue: "",
  higherValue: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "blur" }]
});
// 方法区
onBeforeMount(() => {
  if (rowData?.value && title.value == "编辑") {
    console.log(rowData?.value, "数据呢----");
    ruleForm = rowData.value as any;
  } else {
  }
});
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await Threshold_addOrUpdate(ruleForm);
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
