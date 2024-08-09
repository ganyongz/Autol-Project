<template>
  <div class="box">
    <el-button type="primary" @click="dialogVisible = true">新增</el-button>
    <!-- form表单 -->
    <el-dialog v-model="dialogVisible" title="ATL3000新增配置" width="700" :before-close="handleClose">
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
        <el-form-item label="箱体编号" prop="boxNum">
          <el-input v-model.number="ruleForm.boxNum" />
        </el-form-item>

        <el-form-item label="点位编号" prop="pointNum">
          <el-input v-model.number="ruleForm.pointNum" />
        </el-form-item>

        <el-form-item label="部位名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="累计油量" prop="cumulativeOil">
          <el-input v-model.number="ruleForm.cumulativeOil" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      :data="tableData"
      style="width: 100%"
      height="250"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="index" label="" width="50" />
      <el-table-column prop="name" label="部位名称" width="240" />
      <el-table-column prop="boxNum" label="箱体编号" />
      <el-table-column prop="pointNum" label="点位编号" />
      <el-table-column prop="cumulativeOil" label="累计油量(ml)" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)"> 编辑 </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import { atl_addAtl3000BoxConfig, atl_Atl3000BoxConfigList, atl_deleteAtl3000BoxConfig } from "@/api/system/functionPosition";
import { ElMessage } from "element-plus";
const props = defineProps({
  partId: {
    type: Number
  }
});
const { partId } = toRefs(props);

const tableData = ref();
// dialog
const dialogVisible = ref(false);
const handleClose = (done: () => void) => {
  done();
};
// form 表单
interface RuleForm {
  id: number | unknown;
  partId: number | unknown;
  boxNum: number | unknown;
  pointNum: number | unknown;
  name: string;
  cumulativeOil: number | unknown;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  id: undefined,
  partId: partId?.value,
  boxNum: undefined,
  pointNum: undefined,
  name: "",
  cumulativeOil: undefined
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入部位名称", trigger: "blur" }],
  partId: [{ required: true, message: "部件id不能为空", trigger: "blur" }],
  boxNum: [{ required: true, message: "请输入箱体编号", trigger: "blur" }],
  pointNum: [{ required: true, message: "请输入点位编号", trigger: "blur" }],
  cumulativeOil: [{ required: true, message: "请输入累计油量", trigger: "blur" }]
});
// 保存
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: any = await atl_addAtl3000BoxConfig(ruleForm);
      if (res.code == "200") {
        ElMessage.success("保存成功");
        getEquipPointList();
        dialogVisible.value = false;
      } else {
        ElMessage.error(res?.mssage);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 获取列表
const getEquipPointList = async () => {
  let res: any = await atl_Atl3000BoxConfigList({ partId: partId?.value });
  if (res.code == "200") {
    tableData.value = res.data as any;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
};
// 编辑
const handleEdit = (val: any) => {
  dialogVisible.value = true;
  ruleForm = Object.assign(val);
};
// 删除
const handleDelete = async (val: any) => {
  await useHandleData(atl_deleteAtl3000BoxConfig, { id: val.id }, `删除【${val.name}】`);
  getEquipPointList();
};
getEquipPointList();
</script>

<style lang="scss" scoped></style>
