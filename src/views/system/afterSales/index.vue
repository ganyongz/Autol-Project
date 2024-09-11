<template>
  <div>
    <div style="margin: 10px auto; text-align: center">
      <span style="display: inline-block; margin-right: 20px; color: green">售后联系人：{{ afterContacts }}</span>
      <span style="color: green">联系电话：{{ contactsPhone }}</span>
      <!-- 下载暂时隐藏（勿删） -->
      <el-button v-if="false" @click="downLoadFun">下载</el-button>
    </div>
    <iframe style="width: 100%; height: 1000px" :src="fileUrl" frameborder="0"></iframe>
  </div>
</template>
<script setup lang="ts" name="afterSales">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { afterSales_Info, afterSales_preview, afterSales_download } from "@/api/system/TenantManagement";
let ID = ref();
let afterContacts = ref(); //售后联系人
let contactsPhone = ref(); //联系电话
// 获取售后信息
const getAfterSalesInfo = async () => {
  let res: any = await afterSales_Info({});
  if (res.code == "200" && res.data && res.data.id) {
    ID.value = res.data.id;
    funPreview(res.data.id); //预览文件
    afterContacts.value = res.data.afterContacts;
    contactsPhone.value = res.data.contactsPhone;
  } else {
    ElMessage.error(res?.message);
  }
};
// 预览文件
let fileUrl = ref<string>("");
const funPreview = async (val: string) => {
  let res: any = await afterSales_preview({ tenantId: val });
  // 创建一个新的Blob URL
  fileUrl.value = window.URL.createObjectURL(new Blob([res], { type: "application/pdf" }));
};
// 下载
const downLoadFun = async () => {
  let res: any = await afterSales_download({ tenantId: ID.value });
  console.log(res);
  let url = window.URL.createObjectURL(new Blob([res], { type: "application/vnd.ms-excel" }));
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", "使用说明.pdf"); //对文件进行命名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); //下载完成移除元素
  window.URL.revokeObjectURL(url); //释放掉blob对象
};
getAfterSalesInfo();
</script>
<style lang="scss" scoped></style>
