<template>
  <div>
    <!-- 测点详情 -->
    <el-button type="primary" @click="submitEquipment(ruleFormRef)">保存</el-button>
    <el-button type="danger" @click="deleteFun">删除</el-button>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px; margin-left: 30px"
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
      <el-form-item label="振动类型" prop="vibType">
        <el-select v-model="ruleForm.vibType" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="测点类型" prop="pointType">
        <el-select v-model="ruleForm.pointType" placeholder="请选择" style="width: 240px">
          <el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="equipDetail">
import { reactive, ref, toRefs } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { equipPoint_findById, equipPoint_addOrUpdate, equipPoint_deleteById } from "@/api/system/functionPosition";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
// 测点详情
const props = defineProps({
  nodeData: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const { nodeData } = toRefs(props);
console.log(nodeData.value, "父级传来的数据");
const typeOptions = [
  { value: "Acceleration", label: "加速度" },
  { value: "Speed", label: "速度" },
  { value: "Displacement", label: "位移" }
]; //振动类型
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
  vibType: string;
  pointUnit: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref({
  id: "",
  name: "",
  code: "",
  partId: "",
  sort: undefined,
  pointType: "",
  vibType: "",
  pointUnit: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
});
// 方法区
// 保存测点
const submitEquipment = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      saveForm();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const saveForm = async () => {
  // 编辑测点
  let res: any = await equipPoint_addOrUpdate(ruleForm.value);
  if (res.code == "200") {
    ElMessage.success("保存成功");
  } else {
    ElMessage.error(res?.mssage);
  }
};

// 获取详情
const getPointDetailFun = async () => {
  let res: any = await equipPoint_findById({ id: nodeData.value["id"] });
  if (res.code == "200") {
    let data = res.data as any;
    ruleForm.value = data;
    Object.assign(ruleForm.value, data);
    console.log(ruleForm.value, "看看结果");

    // ruleForm.name = data.name;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除测点
const deleteFun = async () => {
  await useHandleData(equipPoint_deleteById, { id: nodeData.value?.id }, `删除【${nodeData.value.name}】测点`);
};
getPointDetailFun(); //获取详情
// 暴露
defineExpose({ ruleForm });
</script>
<style scoped lang=""></style>
