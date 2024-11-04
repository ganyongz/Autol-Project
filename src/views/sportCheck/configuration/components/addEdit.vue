<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules1"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
    :disabled="title == '详情'"
  >
    <el-form-item label="巡检内容" prop="content">
      <el-input v-model="ruleForm.content" />
    </el-form-item>

    <el-form-item label="是否需要上传图片">
      <el-radio-group v-model="ruleForm.needPhoto">
        <el-radio :value="0">否</el-radio>
        <el-radio :value="1">是</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="是否需输入文本">
      <el-radio-group v-model="ruleForm.needText">
        <el-radio :value="0">否</el-radio>
        <el-radio :value="1">是</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="是否需要设置单位">
      <el-radio-group v-model="ruleForm.needValue">
        <el-radio :value="0">否</el-radio>
        <el-radio :value="1">是</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="单位" prop="valueUnit" :required="isRequired">
      <el-input v-model="ruleForm.valueUnit" />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="ruleForm.remark" />
    </el-form-item>

    <div style="text-align: center" v-if="title != '详情'">
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
      <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onBeforeMount, watch } from "vue";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import { configuration_getInfoById, configuration_addOrUpdate } from "@/api/sportCheck/configuration";
const props = defineProps({
  rowId: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: ""
  }
});
const { rowId, title } = toRefs(props);
interface RuleForm {
  id: string;
  content: string;
  needPhoto: number;
  needText: number;
  needValue: number;
  valueUnit: string;
  remark: string;
}
const isRequired = ref(true);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  content: "",
  needPhoto: 0,
  needText: 0,
  needValue: 0,
  valueUnit: "",
  remark: ""
});
watch(
  () => ruleForm.value.needValue,
  newVal => {
    if (newVal == 1) {
      isRequired.value = true;
    } else {
      isRequired.value = false;
      ruleForm.value.valueUnit = "";
    }
  },
  { deep: true, immediate: true }
);
const rules1 = reactive<FormRules<RuleForm>>({
  content: [{ required: true, message: "请输入名称", trigger: "blue" }],
  valueUnit: [{ required: isRequired.value, message: "请输入单位", trigger: "blue" }]
});
// 方法区
const getInfoById = async () => {
  let res: any = await configuration_getInfoById({ id: rowId.value });
  if (res.code == "200") {
    ruleForm.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
};
onBeforeMount(() => {
  if (rowId?.value && (title.value == "编辑" || title.value == "详情")) {
    getInfoById();
  } else {
  }
});
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await configuration_addOrUpdate(ruleForm.value);
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
