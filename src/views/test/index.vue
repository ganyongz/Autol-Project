<template>
  <div>
    single-file-component{{ count }}

    <el-button @click="getListFun">发送请求</el-button>
  </div>
</template>

<script setup lang="ts" name="test">
import { ref } from "vue";
import { getListApi } from "@/api/modules/login";
import { ElMessage } from "element-plus";
const count = ref(0);
function increment() {
  count.value++;
}
increment();
let prams = {
  pageNum: 1,
  pageSize: 10
};
const getListFun = async () => {
  const res: any = await getListApi(prams);
  if (res.code == "200") {
    console.log(res.data);
    ElMessage.success(res?.mssage);
  } else {
    ElMessage.error(res?.mssage);
  }

  console.log("2222", res);
};
</script>

<style scoped></style>
