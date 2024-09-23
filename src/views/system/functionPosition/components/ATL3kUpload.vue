<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    action="#"
    :limit="1"
    :http-request="handleHttpUpload"
    :on-exceed="handleExceed"
    :auto-upload="false"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>
    <el-button class="ml-3" style="margin-left: 0.75rem" type="success" @click="submitUpload">上传文件</el-button>
    <template #tip>
      <div class="el-upload__tip text-red">每次限传一个文件</div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
// atl3000上传
import { ref } from "vue";
import { genFileId, ElMessage } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
// import { afterSales_fileUpload } from "@/api/system/TenantManagement";
import { atl_Import } from "@/api/system/functionPosition";
const emit = defineEmits(["closeDialog"]);
const upload = ref<UploadInstance>();
// let props = defineProps({
//   tenantId: {
//     type: String,
//     default: ""
//   }
// });
// let { tenantId } = toRefs(props);
const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const submitUpload = () => {
  upload.value!.submit();
};
// 上传文件
const handleHttpUpload = async (options: any) => {
  let formData = new FormData();
  formData.append("file", options.file);
  // formData.append("tenantId", tenantId.value);
  try {
    let result: any = await atl_Import(formData);
    if (result.code == "200") {
      ElMessage.success("上传成功");
    } else {
      ElMessage.error(result?.message);
    }
    emit("closeDialog");
  } catch (error) {
    options.onError(error as any);
  }
};
</script>
