<template>
  <el-form :model="ruleForm" label-width="auto" style="max-width: 600px">
    <el-form-item label="设备备注">
      <el-input v-model="ruleForm.equipRemark" readonly />
    </el-form-item>
    <el-form-item label="设备分类">
      <el-select v-model="ruleForm.classify" placeholder="Select" style="width: 100%" disabled>
        <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="设备名称">
      <el-input v-model="ruleForm.equipName" readonly />
    </el-form-item>
    <el-form-item label="设备编码">
      <el-input v-model="ruleForm.code" readonly />
    </el-form-item>
    <el-form-item label="点检项备注">
      <el-input v-model="ruleForm.spotCheckItemRemark" readonly />
    </el-form-item>
    <el-form-item label="点检图">
      <el-input v-model="ruleForm.photo" readonly />
    </el-form-item>
    <el-form-item label="点检记录">
      <el-input v-model="ruleForm.remark" readonly />
    </el-form-item>
    <el-form-item label="点检时间">
      <el-input v-model="ruleForm.spotCheckTime" readonly />
    </el-form-item>
    <el-form-item label="设备图">
      <el-input v-model="ruleForm.equipImageurl" readonly />
    </el-form-item>
    <el-form-item label="巡检内容">
      <el-input v-model="ruleForm.content" readonly />
    </el-form-item>
    <el-form-item label="超期时间/分">
      <el-input v-model="ruleForm.timeOut" readonly />
    </el-form-item>
    <el-form-item label="点检任务备注">
      <el-input v-model="ruleForm.spotCheckPlanRemark" readonly />
    </el-form-item>
    <el-form-item label="点检任务名称">
      <el-input v-model="ruleForm.spotCheckPlanName" readonly />
    </el-form-item>
    <el-form-item label="点检记录创建时间">
      <el-input v-model="ruleForm.createTime" readonly />
    </el-form-item>
    <el-form-item label="设备状态">
      <el-select v-model="ruleForm.equipStatus" placeholder="Select" style="width: 100%" disabled>
        <el-option v-for="item in equipStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否需要上传输入值">
      <el-select v-model="ruleForm.needValue" placeholder="Select" style="width: 100%" disabled>
        <el-option v-for="item in needOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否需要上传文本">
      <el-select v-model="ruleForm.needText" placeholder="Select" style="width: 100%" disabled>
        <el-option v-for="item in needOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="点检项单位">
      <el-input v-model="ruleForm.valueUnit" readonly />
    </el-form-item>
    <el-form-item label="点检记录">
      <el-input v-model="ruleForm.text" readonly />
    </el-form-item>
    <el-form-item label="传感器数值">
      <el-input v-model="ruleForm.value" readonly />
    </el-form-item>
    <el-form-item label="点检状态">
      <el-select v-model="ruleForm.status" placeholder="Select" style="width: 100%" disabled>
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="点检任务创建时间">
      <el-input v-model="ruleForm.spotCheckPlanCreateTime" readonly />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { spotCheckLog_detail } from "@/api/sportCheck/sportCheckLog";
const props = defineProps({
  rowId: {
    type: String,
    default: null
  }
});
const { rowId } = toRefs(props);
// 枚举值
const classifyOptions = reactive([
  { value: 1, label: "风电设备" },
  { value: 2, label: "港口设备" },
  { value: 3, label: "食品设备" },
  { value: 4, label: "工程机械" },
  { value: 5, label: "矿山" },
  { value: 6, label: "水泥" }
]);
const equipStatusOptions = reactive([
  { value: 0, label: "未点检" },
  { value: 1, label: "异常" },
  { value: 2, label: "正常" },
  { value: 3, label: "上报维修" }
]);
const needOptions = reactive([
  { value: 0, label: "不需要" },
  { value: 1, label: "需要" }
]);
const statusOptions = reactive([
  { value: 0, label: "为点检" },
  { value: 1, label: "已点检" },
  { value: 2, label: "超期未点检" },
  { value: 3, label: "已推送" }
]);
let ruleForm = ref({
  equipRemark: "",
  classify: null,
  equipName: "",
  code: "",
  spotCheckItemRemark: "",
  photo: "",
  remark: "",
  spotCheckTime: "",
  equipImageurl: "",
  content: "",
  timeOut: "",
  spotCheckPlanRemark: "",
  spotCheckPlanName: "",
  createTime: "",
  equipStatus: "",
  needValue: "",
  needText: "",
  valueUnit: "",
  text: "",
  value: "",
  status: "",
  spotCheckPlanCreateTime: ""
});
// 方法区
const getInfoById = async () => {
  let res: any = await spotCheckLog_detail({ id: rowId.value });
  if (res.code == "200") {
    ruleForm.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
};
getInfoById();
</script>

<style lang="scss" scoped></style>
