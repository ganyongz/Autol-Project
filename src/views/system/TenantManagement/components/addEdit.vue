<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px; height: 600px; overflow-y: auto"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="租户名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>

    <el-form-item label="平台名称" prop="platformName">
      <el-input v-model="ruleForm.platformName" />
    </el-form-item>

    <el-form-item label="租户授权过期时间" prop="expirationTime">
      <el-date-picker
        v-model="ruleForm.expirationTime"
        type="datetime"
        placeholder="请选择时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="驾驶舱菜单路径" prop="cockpitMenuUrl">
      <el-input v-model="ruleForm.cockpitMenuUrl" />
    </el-form-item>

    <el-form-item label="售后联系人" prop="afterContacts">
      <el-input v-model="ruleForm.afterContacts" />
    </el-form-item>

    <el-form-item label="售后联系电话" prop="contactsPhone">
      <el-input v-model="ruleForm.contactsPhone" />
    </el-form-item>

    <el-form-item label="Logo图片路径" prop="logoUrl">
      <UploadImg :key="uploadImgKey" v-model:image-id="ruleForm.logoUrl" :file-size="5">
        <template #tip> 上传图片最大为 5M </template>
      </UploadImg>
    </el-form-item>
    <el-form-item label="登录背景图" prop="loginBackgroundImageId">
      <UploadImg :key="loginImgKey" v-model:image-id="ruleForm.loginBackgroundImageId" :file-size="5">
        <template #tip> 上传图片最大为 5M </template>
      </UploadImg>
    </el-form-item>

    <div style="padding: 10px; margin-bottom: 10px; border: 1px dashed gray; border-radius: 5px">
      <el-form-item label="租户数据库ip" prop="dbIp">
        <el-input v-model="ruleForm.dbIp" />
      </el-form-item>
      <el-form-item label="租户数据库端口" prop="dbPort">
        <el-input v-model="ruleForm.dbPort" />
      </el-form-item>
      <el-form-item label="租户数据库名" prop="dbName">
        <el-input v-model="ruleForm.dbName" />
      </el-form-item>
      <el-form-item label="租户数据库用户名" prop="dbUserName">
        <el-input v-model="ruleForm.dbUserName" />
      </el-form-item>
      <el-form-item label="租户数据库密码" prop="dbPassword">
        <el-input v-model="ruleForm.dbPassword" />
      </el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="createDB">创建数据库</el-button>
        <el-button type="primary" @click="testDB">测试连接</el-button>
      </div>
    </div>

    <div style="text-align: center">
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
      <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onBeforeMount } from "vue";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import { Tenant_addOrUpdate, Tenant_createDB, Tenant_testDBConnect } from "@/api/system/TenantManagement";
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
let uploadImgKey = ref<number>(1);
let loginImgKey = ref<number>(1);
interface RuleForm {
  id: string;
  name: string;
  platformName: string;
  type: number;
  expirationTime: string;
  cockpitMenuUrl: string;
  logoUrl: string;
  loginBackgroundImageId: string;
  afterContacts: string;
  contactsPhone: string;
  dbIp: string;
  dbPort: number | null;
  dbName: string;
  dbUserName: string;
  dbPassword: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  id: "",
  name: "",
  platformName: "",
  type: 1,
  expirationTime: "",
  cockpitMenuUrl: "",
  logoUrl: "",
  loginBackgroundImageId: "",
  afterContacts: "",
  contactsPhone: "",
  dbIp: "",
  dbPort: null,
  dbName: "",
  dbUserName: "",
  dbPassword: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  expirationTime: [{ required: true, message: "请设定租户授权过期时间", trigger: "change" }],
  platformName: [
    { required: true, message: "请输入平台名称", trigger: "blur" },
    { min: 1, max: 20, message: "长度1 ~ 20", trigger: "blur" }
  ],
  afterContacts: [{ required: true, message: "请输入售后联系人", trigger: "blur" }],
  contactsPhone: [{ required: true, message: "请输入售后联系电话", trigger: "blur" }]
});
// 方法区
onBeforeMount(() => {
  if (rowData?.value && title.value == "编辑") {
    ruleForm = rowData.value as any;
  } else {
  }
});
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await Tenant_addOrUpdate(ruleForm);
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
// 创建数据库
const createDB = async () => {
  let params = {
    dbIp: ruleForm.dbIp,
    dbPort: ruleForm.dbPort,
    dbName: ruleForm.dbName,
    dbUserName: ruleForm.dbUserName,
    dbPassword: ruleForm.dbPassword
  };
  const res: any = await Tenant_createDB(params);
  if (res.code == "200") {
    ElMessage.success(res?.message);
  } else {
    ElMessage.error(res?.message);
  }
};
// 测试连接数据库
const testDB = async () => {
  let params = {
    dbIp: ruleForm.dbIp,
    dbPort: ruleForm.dbPort,
    dbName: ruleForm.dbName,
    dbUserName: ruleForm.dbUserName,
    dbPassword: ruleForm.dbPassword
  };
  const res: any = await Tenant_testDBConnect(params);
  if (res.code == "200") {
    ElMessage.success(res?.message);
  } else {
    ElMessage.error(res?.message);
  }
};
// 暴露
defineExpose({ ruleForm });
</script>
