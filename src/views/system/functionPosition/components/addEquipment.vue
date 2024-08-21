<template>
  <div>
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
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="设备分类">
        <el-select v-model="ruleForm.classify" class="m-2" placeholder="请选择">
          <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="设备图片" prop="equipImageUrl">
        <!-- <el-input v-model="ruleForm.equipImageUrl" /> -->
        <!-- <el-upload
          class="avatar-uploader"
          :action="upload_uploadImage"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload> -->
        <UploadImg v-model:image-id="ruleForm.equipImageUrl" :file-size="5">
          <template #tip> 上传图片最大为 5M </template>
        </UploadImg>
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
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
// import type { UploadProps } from "element-plus";
import { upload_uploadImage } from "@/api/upload";
console.log(upload_uploadImage, "上传接口");
// let url = "192.168.1.139:8901/File/uploadImage";
import UploadImg from "@/components/Upload/Img.vue";
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
const classifyOptions = [
  { value: 1, label: "风电设备" },
  { value: 2, label: "港口设备" },
  { value: 3, label: "食品设备" },
  { value: 4, label: "工程机械" },
  { value: 5, label: "矿山" },
  { value: 6, label: "水泥" }
];
interface RuleForm {
  installLocationId: string;
  name: string;
  equipImageUrl: string;
  remark: string;
  code: string;
  deptId: string;
  sort: number | undefined;
  classify: number | undefined;
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
  classify: undefined
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
// const imageUrl = ref("");

// const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
//   imageUrl.value = URL.createObjectURL(uploadFile.raw!);
// };

// const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
//   console.log(rawFile);

// if (rawFile.size / 1024 / 1024 > 2) {
//   ElMessage.error("Avatar picture size can not exceed 2MB!");
//   return false;
// }
// return true;
// };

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
    ElMessage.error(res?.message);
  }
};
onBeforeMount(() => {
  departTreeFun();
  ruleForm.installLocationId = rowData.value.id;
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
