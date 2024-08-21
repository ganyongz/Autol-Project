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
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="角色类型" prop="type">
      <el-select v-model="ruleForm.type" placeholder="请选择角色类型">
        <el-option label="管理员" :value="1" />
        <el-option label="普通用户" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否禁用" prop="isDisabled">
      <el-select v-model="ruleForm.isDisabled" placeholder="是否禁用">
        <el-option label="正常" :value="0" />
        <el-option label="禁用" :value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="描述" prop="description">
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
import { addOrUpdate } from "@/api/system/roleManage";
const props = defineProps({
  rowData: {
    type: Object
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
  type: string[];
  description: string;
  isDisabled: number;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  id: "",
  name: "",
  type: ["2"],
  description: "",
  isDisabled: 0
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
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
      const res: any = await addOrUpdate(ruleForm);
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
