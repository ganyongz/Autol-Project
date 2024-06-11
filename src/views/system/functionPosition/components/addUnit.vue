<template>
  <div>
    <!-- 新增部件 -->
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
interface RuleForm {
  equipId: string; //所属设备id
  name: string;
  description: string;
  remark: string;
  code: string;
  sort: number | undefined;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  equipId: "",
  name: "",
  description: "",
  remark: "",
  code: "",
  sort: undefined
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
