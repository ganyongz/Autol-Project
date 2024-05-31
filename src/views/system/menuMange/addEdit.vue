<template>
  <el-dialog
    :model-value="visible"
    :title="dynamicTitle"
    width="500"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <!-- 菜单按钮的新增或编辑 -->
    <el-form :model="ruleForm" ref="ruleFormRef" :rules="rules">
      <el-form-item label="名称" prop="title" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.title" autocomplete="off" />
      </el-form-item>

      <el-form-item label="别称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.name" autocomplete="off" />
      </el-form-item>

      <el-form-item label="类型" :label-width="formLabelWidth">
        <el-select v-model="ruleForm.iconType" placeholder="请选择类型">
          <el-option label="菜单" :value="0" />
          <el-option label="按钮" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="路由" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.url" autocomplete="off" />
      </el-form-item>

      <el-form-item label="等级" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.sort" autocomplete="off" />
      </el-form-item>

      <el-form-item label="图标" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.icon" autocomplete="off" />
      </el-form-item>

      <el-form-item label="父级id" :label-width="formLabelWidth" readonly>
        <el-input v-model="ruleForm.parentId" autocomplete="off" />
      </el-form-item>

      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.description" autocomplete="off" />
      </el-form-item>

      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-switch
          v-model="ruleForm.isActive"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog1(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submit(ruleFormRef)">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps, defineEmits, toRefs, onBeforeMount } from "vue";
import { addOrUpdate } from "@/api/system/menuMange";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
const ruleFormRef = ref<FormInstance>();
const formLabelWidth = "140px";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dynamicTitle: {
    type: String,
    default: "新增"
  },
  rowData: {
    type: Object,
    default: null
  }
});
let { visible, dynamicTitle, rowData } = toRefs(props);
interface RuleForm {
  id: string;
  name: string;
  title: string;
  url: string;
  parentId: string;
  sort: number;
  icon: string;
  iconType: number;
  isActive: boolean;
  description: string;
}
let ruleForm = reactive({
  id: "",
  name: "",
  title: "",
  url: "",
  parentId: "-1",
  sort: 0,
  icon: "",
  iconType: 0,
  isActive: true,
  description: ""
});
const rules = reactive<FormRules<RuleForm>>({
  title: [{ required: true, message: "请输入名称", trigger: "blur" }]
});
onBeforeMount(() => {
  if (dynamicTitle.value == "编辑") {
    ruleForm = rowData.value as any;
  } else if (dynamicTitle.value == "新增下级") {
    ruleForm.parentId = rowData.value.id;
    console.log("数据来了", rowData.value);
  }
});
// 关闭
const emit = defineEmits(["closeDialog", "submitForm"]);
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const closeDialog1 = (formEl: FormInstance | undefined) => {
  console.log("取消了");

  if (!formEl) return;
  formEl.resetFields();
  emit("closeDialog");
};
const closeDialog = () => {
  emit("closeDialog");
};
// 保存
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      delete ruleForm["buttons"];
      delete ruleForm["children"];
      let params = ruleForm;
      const res: any = await addOrUpdate(params);
      if (res.code == "200") {
        emit("submitForm");
        formEl.resetFields();
      } else {
        ElMessage.error(res?.mssage);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style scoped lang=""></style>
