<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="休止时间 (P1)：">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="润滑时间 (P3)：">
      <el-input v-model="form.region" />
    </el-form-item>

    <el-form-item label="温控 (P4)：">
      <el-input v-model="form.date1" />
    </el-form-item>

    <el-form-item label="信号检测 (P2)：">
      <el-input v-model="form.date2" />
    </el-form-item>

    <el-form-item style="text-align: center">
      <el-button type="primary">读取</el-button>
      <el-button type="primary" @click="onSubmit">设置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
const emit = defineEmits(["closeDialog", "submitForm"]);

// do not use same name with ref
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: ""
});

const onSubmit = () => {
  emit("closeDialog");
};
</script>
