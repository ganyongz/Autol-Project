<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="ruleForm.type == 1 ? rules1 : rules2"
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
        <el-option label="超上限" :value="1" />
        <el-option label="超下限" :value="2" />
      </el-select>
    </el-form-item>

    <el-form-item label="低报" prop="lowValue">
      <el-input v-model.number="ruleForm.lowValue" />
    </el-form-item>
    <el-form-item label="低低报" prop="lowerValue">
      <el-input v-model.number="ruleForm.lowerValue" />
    </el-form-item>

    <el-form-item label="高报" prop="highValue">
      <el-input v-model.number="ruleForm.highValue" />
    </el-form-item>
    <el-form-item label="高高报" prop="higherValue">
      <el-input v-model.number="ruleForm.higherValue" />
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

const rules1 = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "change" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  highValue: [{ required: true, message: "请输入高报值", trigger: "blur" }],
  higherValue: [{ required: true, message: "请输入高高报值", trigger: "blur" }],
  lowerValue: [{ required: false }],
  lowValue: [{ required: false }]
});
const rules2 = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "change" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  lowerValue: [{ required: true, message: "请输入低低报值", trigger: "blur" }],
  lowValue: [{ required: true, message: "请输入低报值", trigger: "blur" }],
  highValue: [{ required: false }],
  higherValue: [{ required: false }]
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
  if (parseFloat(ruleForm.lowValue) <= parseFloat(ruleForm.lowerValue)) {
    ElMessage.warning("低低报的值要小于低报");
    return;
  }

  if (parseFloat(ruleForm.higherValue) <= parseFloat(ruleForm.highValue)) {
    ElMessage.warning("高高报要大于高报");
    return;
  }
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
