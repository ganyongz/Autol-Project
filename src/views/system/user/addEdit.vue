<template>
  <el-dialog
    :model-value="visible"
    :title="dynamicTitle"
    width="500"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="ruleForm" ref="ruleFormRef" :rules="rules">
      <el-form-item label="用户名称" prop="userName" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.userName" autocomplete="off" />
      </el-form-item>

      <el-form-item label="用户类型" :label-width="formLabelWidth">
        <el-select v-model="ruleForm.type" placeholder="请选择用户类型">
          <el-option label="超级管理员" :value="1" />
          <el-option label="租户管理员" :value="2" />
          <el-option label="租户下普通用户" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.phone" autocomplete="off" />
      </el-form-item>

      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.password" autocomplete="off" type="password" show-password />
      </el-form-item>

      <el-form-item label="真实姓名" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.realName" autocomplete="off" />
      </el-form-item>

      <el-form-item label="绑定租户" :label-width="formLabelWidth">
        <el-select
          :disabled="ruleForm.type !== 1"
          v-model="ruleForm.tenantId"
          filterable
          placeholder="请选择"
          clearable
          style="width: 100%"
        >
          <el-option v-for="item in options" :key="item?.id" :label="item?.name" :value="item?.id" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item> -->

      <el-form-item label="是否停用" :label-width="formLabelWidth">
        <el-switch
          v-model="ruleForm.isDisabled"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
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
import { addOrUpdateUser } from "@/api/system/user";
import { Tenant_List } from "@/api/system/TenantManagement"; //租户管理list
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
  userName: string;
  realName: string;
  password: string;
  type: number;
  isDisabled: number;
  sex: number;
  phone: string;
  isDelete: number;
  tenantId: string;
}
let ruleForm = reactive({
  id: "",
  userName: "",
  realName: "",
  password: "",
  type: 1,
  isDisabled: 1,
  sex: 0,
  phone: "",
  isDelete: 0,
  tenantId: ""
});
const rules = reactive<FormRules<RuleForm>>({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }]
});
onBeforeMount(() => {
  getUserList({ pageNum: 1, pageSize: 1000 });
  if (dynamicTitle.value == "编辑") {
    ruleForm = rowData.value as any;
    console.log("数据来了", rowData.value);
  } else {
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
      const res: any = await addOrUpdateUser(ruleForm);
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
// 绑定租户
const options = ref();
const getUserList = async (params: any) => {
  const res: any = await Tenant_List(params);
  if (res.code == "200") {
    // console.log(res);
    options.value = res.data.records;
  } else {
    ElMessage.error(res?.mssage);
  }
};
</script>
<style scoped lang=""></style>
