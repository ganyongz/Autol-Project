<template>
  <div>
    <!-- 新增、编辑Mqtt -->
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
      <el-form-item label="客户端ID" prop="clientId">
        <el-input v-model="ruleForm.clientId" />
      </el-form-item>
      <el-form-item label="MQTT服务地址" prop="ip">
        <el-input v-model="ruleForm.ip" />
      </el-form-item>

      <el-form-item label="端口" prop="prot">
        <el-input v-model="ruleForm.prot" />
      </el-form-item>

      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" />
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
const { rowData } = toRefs(props);
interface RuleForm {
  id: string;
  ip: string;
  prot: number | null;
  clientId: string;
  userName: string;
  password: string;
  source: string;
  remark: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  ip: "",
  prot: null,
  clientId: "",
  userName: "",
  password: "",
  source: "",
  remark: ""
});

const rules = reactive<FormRules<RuleForm>>({
  clientId: [{ required: true, message: "请输入客户端ID", trigger: "blur" }],
  ip: [{ required: true, message: "请输入MQTT服务地址", trigger: "blur" }],
  prot: [{ required: true, message: "请输入端口", trigger: "blur" }],
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
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
  ruleForm.value.id = rowData.value.id;
  if (rowData?.value && rowData.value.id) {
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
