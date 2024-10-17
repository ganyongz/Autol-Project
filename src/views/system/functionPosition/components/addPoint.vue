<template>
  <div>
    <!-- 编辑或新增测点 -->
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
      <el-form-item label="测点名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="测点编码" prop="code">
        <el-input v-model="ruleForm.code" />
      </el-form-item>

      <el-form-item label="测点单位" prop="pointUnit">
        <el-input v-model="ruleForm.pointUnit" />
      </el-form-item>

      <el-form-item label="测点排序" prop="sort">
        <el-input v-model="ruleForm.sort" />
      </el-form-item>
      <!-- <el-form-item label="振动类型" prop="vibType">
        <el-select v-model="ruleForm.vibType" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="测点类型" prop="pointType">
        <el-select v-model="ruleForm.pointType" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
const { rowData, title } = toRefs(props);
/**
const typeOptions = [
  { value: "Acceleration", label: "加速度" },
  { value: "Speed", label: "速度" },
  { value: "Displacement", label: "位移" }
]; //振动类型
*/
const pointTypeOptions = [
  { value: "Vib", label: "振动" },
  { value: "StartStop", label: "启停" },
  { value: "Temperature", label: "温度" },
  { value: "RotateSpeed", label: "转速" }
]; //测点类型

interface RuleForm {
  id: string;
  name: string;
  code: string;
  partId: string; //部件id
  sort: number | undefined;
  pointType: string;
  // vibType: string;
  pointUnit: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  name: "",
  code: "",
  partId: "",
  sort: undefined,
  pointType: "",
  // vibType: "",
  pointUnit: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入测点名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入测点编码", trigger: "blur" }],
  pointUnit: [{ required: true, message: "请输入测点单位", trigger: "blur" }],
  sort: [{ required: true, message: "请输入振动类型", trigger: "blur" }],
  // vibType: [{ required: true, message: "请选择振动类型", trigger: "change" }],
  pointType: [{ required: true, message: "请选择测点类型", trigger: "change" }]
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
  if (rowData?.value && title.value == "编辑测点") {
    ruleForm.value = rowData.value as any;
  } else {
    //新增
    ruleForm.value.partId = rowData.value.id;
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
