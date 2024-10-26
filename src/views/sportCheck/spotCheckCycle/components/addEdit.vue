<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules1"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
    :disabled="title == '详情'"
  >
    <el-form-item label="周期名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>

    <el-form-item label="规则" prop="regulation">
      <el-select v-model="ruleForm.regulation" placeholder="请选择规则" style="width: 100%">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="任务间隔时间" prop="timeSpan">
      <el-input v-model="ruleForm.timeSpan" />
    </el-form-item>
    <el-form-item label="周期开始时间" prop="startTime">
      <el-date-picker
        v-model="ruleForm.startTime"
        type="datetime"
        placeholder="选择日期时间"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="周期结束时间" prop="endTime">
      <el-date-picker
        v-model="ruleForm.endTime"
        type="datetime"
        :default-time="['2024-01-27 23:59:59']"
        placeholder="选择日期时间"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
        @change="handleEndTime"
      ></el-date-picker>
    </el-form-item>

    <div style="text-align: center" v-if="title != '详情'">
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
      <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
// 点检巡检周期 新增/编辑
import { reactive, ref, toRefs, onBeforeMount } from "vue";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import { spotCheckCycle_addOrUpdate, spotCheckCycle_getInfoById } from "@/api/sportCheck/spotCheckCycle";
const props = defineProps({
  rowId: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: ""
  }
});
const { rowId, title } = toRefs(props);
interface RuleForm {
  id: string;
  name: string;
  regulation: number;
  timeSpan: string;
  startTime: string;
  endTime: string;
}
// 枚举值
const options = reactive([
  { value: 0, label: "跳过周六周日" },
  { value: 1, label: "本地节假日配置 + 自动跳过周六日" },
  { value: 2, label: "全年推送" }
]);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  name: "",
  regulation: 0,
  timeSpan: "",
  startTime: "",
  endTime: ""
});

const rules1 = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入周期名称", trigger: "blue" }],
  regulation: [{ required: true, message: "请选择规则", trigger: "change" }],
  timeSpan: [{ required: true, message: "请输入任务间隔时间", trigger: "blue" }],
  startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }]
});
// 方法区
const getInfoById = async () => {
  let res: any = await spotCheckCycle_getInfoById({ id: rowId.value });
  if (res.code == "200") {
    ruleForm.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
};
onBeforeMount(() => {
  if (rowId?.value && (title.value == "编辑" || title.value == "详情")) {
    getInfoById();
  } else {
  }
});
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await spotCheckCycle_addOrUpdate(ruleForm.value);
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

const handleEndTime = (val: any) => {
  if (ruleForm.value.startTime > val) {
    ElMessage.warning("结束时间不能早于开始时间");
    ruleForm.value.endTime = "";
  }
};

// 暴露
defineExpose({ ruleForm });
</script>
