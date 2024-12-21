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
        <el-select v-model="ruleForm.type" placeholder="请选择用户类型" style="width: 95%">
          <el-option label="超级管理员" :value="1" :disabled="userStore.userInfo?.type == 2 || userStore.userInfo?.type == 3" />
          <el-option label="管理员" :value="2" :disabled="userStore.userInfo?.type == 3" />
          <el-option label="普通用户" :value="3" />
        </el-select>
        <el-tooltip placement="bottom" effect="light">
          <template #content>
            超级管理员拥有所有菜单权限和数据权限，<br />管理员拥有大部分菜单权限，但无数据权限，<br />普通用户默认无菜单和数据权限
          </template>
          <el-badge class="item" value="?" :offset="[10, 5]"> </el-badge>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.phone" autocomplete="off" />
      </el-form-item>

      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.password" autocomplete="off" type="password" show-password />
      </el-form-item>

      <el-form-item label="真实姓名" :label-width="formLabelWidth">
        <el-input v-model="ruleForm.realName" autocomplete="off" />
      </el-form-item>

      <!-- <el-form-item label="绑定租户" :label-width="formLabelWidth" v-if="userStore.userInfo?.type == 1">
        <el-select v-model="ruleForm.tenantId" filterable placeholder="请选择" clearable style="width: 100%">
          <el-option v-for="item in options" :key="item?.id" :label="item?.name" :value="item?.id" />
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item> -->

      <el-form-item label="是否停用" :label-width="formLabelWidth">
        <el-switch
          v-model="ruleForm.isDisabled"
          inline-prompt
          :active-value="0"
          :inactive-value="1"
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
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
// console.log(userStore.userInfo?.type, "用户信息");
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
  // tenantId: string;
}
let ruleForm = reactive({
  id: "",
  userName: "",
  realName: "",
  password: "",
  type: 1,
  isDisabled: 0, // 0启用，1禁用
  sex: 0,
  phone: "",
  isDelete: 0
  // tenantId: ""
});
const rules = reactive<FormRules<RuleForm>>({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  phone: [
    { required: true, pattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/, message: "请输入正确的电话号码", trigger: "blur" }
  ]
});
onBeforeMount(() => {
  // getUserList({ pageNum: 1, pageSize: 1000 });
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
        ElMessage.error(res?.message);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 绑定租户
// const options = ref();
// const getUserList = async (params: any) => {
//   const res: any = await Tenant_List(params);
//   if (res.code == "200") {
//     // console.log(res);
//     options.value = res.data.records;
//   } else {
//     ElMessage.error(res?.message);
//   }
// };
</script>
<style scoped lang=""></style>
