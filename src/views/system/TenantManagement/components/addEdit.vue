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
    <el-form-item label="租户名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>

    <el-form-item label="租户授权过期时间" prop="expirationTime">
      <el-date-picker
        v-model="ruleForm.expirationTime"
        type="datetime"
        placeholder="请选择时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>

    <el-form-item label="驾驶舱菜单路径" prop="cockpitMenuUrl">
      <el-input v-model="ruleForm.cockpitMenuUrl" />
    </el-form-item>

    <el-form-item label="Logo图片路径" prop="logoUrl">
      <UploadImg :key="uploadImgKey" v-model:image-id="ruleForm.logoUrl" :file-size="5">
        <template #tip> 上传图片最大为 5M </template>
      </UploadImg>
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
import UploadImg from "@/components/Upload/Img.vue";
import { Tenant_addOrUpdate } from "@/api/system/TenantManagement";
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
let uploadImgKey = ref<number>(1);
interface RuleForm {
  id: string;
  name: string;
  type: number;
  expirationTime: string;
  cockpitMenuUrl: string;
  logoUrl: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  id: "",
  name: "",
  type: 1,
  expirationTime: "",
  cockpitMenuUrl: "",
  logoUrl: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  expirationTime: [{ required: true, message: "请设定租户授权过期时间", trigger: "change" }]
  // cockpitMenuUrl: [{ required: true, message: "请输入驾驶舱菜单路径", trigger: "blur" }]
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
      const res: any = await Tenant_addOrUpdate(ruleForm);
      if (res.code == "200") {
        ElMessage.success("保存成功");
        emit("submitForm");
      } else {
        ElMessage.error(res?.mssage);
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
