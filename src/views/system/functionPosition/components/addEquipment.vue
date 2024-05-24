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
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>

    <el-form-item label="设备编码" prop="code">
      <el-input v-model="ruleForm.code" />
    </el-form-item>
    <el-form-item label="排序字段" prop="sort">
      <el-input v-model="ruleForm.sort" />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model.number="ruleForm.remark" />
    </el-form-item>
    <el-form-item label="所属部门" prop="deptId">
      <el-tree-select
        v-if="showSelect"
        v-model="ruleForm.deptId"
        :data="deptData"
        check-strictly
        :render-after-expand="false"
        :props="defaultProps"
        style="width: 240px"
      />
    </el-form-item>

    <el-form-item label="振动系统" prop="useVib">
      <el-radio-group v-model="ruleForm.useVib" class="ml-4">
        <el-radio :value="0" size="large">不使用</el-radio>
        <el-radio :value="1" size="large">使用</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="润滑系统" prop="useLub">
      <el-radio-group v-model="ruleForm.useLub" class="ml-4">
        <el-radio :value="0" size="large">不使用</el-radio>
        <el-radio :value="1" size="large">使用</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="油液系统" prop="useOil">
      <el-radio-group v-model="ruleForm.useOil" class="ml-4">
        <el-radio :value="0" size="large">不使用</el-radio>
        <el-radio :value="1" size="large">使用</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="设备图片" prop="equipImageUrl">
      <!-- <el-input v-model="ruleForm.equipImageUrl" /> -->
      <el-upload
        class="avatar-uploader"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
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
// import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from "element-plus";
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
  installLocationId: string;
  name: string;
  equipImageUrl: string;
  remark: string;
  code: string;
  deptId: string;
  sort: number | undefined;
  useVib: number;
  useLub: number;
  useOil: number;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  installLocationId: "",
  name: "",
  equipImageUrl: "",
  remark: "",
  code: "",
  deptId: "",
  sort: undefined,
  useVib: 0,
  useLub: 0,
  useOil: 0
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
// 上传
const imageUrl = ref("");

const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

// 获取部门
import { getDepartTree } from "@/api/system/departmentManage";
const defaultProps = {
  children: "children",
  label: "name",
  value: "id"
};
let deptData = reactive([]);
let showSelect = ref(true);
const departTreeFun = async () => {
  let res: any = await getDepartTree();
  showSelect.value = false;
  if (res.code == "200") {
    deptData = res.data;
    showSelect.value = true;
  } else {
    ElMessage.error(res?.mssage);
  }
};
onBeforeMount(() => {
  departTreeFun();
  ruleForm.installLocationId = rowData.value.id;
  if (rowData?.value && title.value == "编辑") {
    console.log(rowData?.value, "数据呢----");
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
