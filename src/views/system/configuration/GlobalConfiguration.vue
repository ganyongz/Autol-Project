<template>
  <div class="box">
    <div style="text-align: right">
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <el-row class="row-bg" :gutter="20" justify="left">
      <el-col :span="4"> 文件默认保存路径:<el-input v-model="formInline1.value" placeholder="请输入" clearable /> </el-col>
      <el-col :span="4"> 数据刷新时间(s):<el-input v-model="formInline2.value" placeholder="请输入" clearable /> </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="GlobalConfiguration">
// 系统配置
import { config_setConfig, config_getConfig } from "@/api/system/configuration";
import { ref } from "vue";
import { ElMessage } from "element-plus";
let formInline1 = ref({
  keyName: "File_Default_Path",
  value: ""
});
let formInline2 = ref({
  keyName: "Data_Refresh_time",
  value: ""
});
let formArray = ref();
// 保存
const submit = async () => {
  formArray.value = [formInline1.value, formInline2.value];
  const res: any = await config_setConfig(formArray.value);
  if (res.code == "200") {
    getConfig();
  } else {
    ElMessage.error(res?.message);
  }
};
// 获取配置项
const getConfig = async () => {
  const res: any = await config_getConfig({});
  if (res.code == "200") {
    if (res.data) {
      res.data.forEach(datum => {
        if (datum.keyName === "File_Default_Path") {
          formInline1.value.keyName = "File_Default_Path";
          formInline1.value.value = datum.value;
        }
        if (datum.keyName === "Data_Refresh_time") {
          formInline2.value.keyName = "Data_Refresh_time";
          formInline2.value.value = datum.value;
        }
      });
    }
  } else {
    ElMessage.error(res?.message);
  }
};

// 调用
getConfig();
</script>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
