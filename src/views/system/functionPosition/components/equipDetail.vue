<template>
  <div>
    <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
    <el-button type="danger" @click="deleteFun">删除</el-button>
    <el-button type="success" plain @click="submitForm(ruleFormRef)">添加部件</el-button>
    <p>基础信息</p>
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item label="设备编码" prop="code">
        <el-input v-model="ruleForm.code" />
      </el-form-item>
      <el-form-item label="排序字段" prop="sort">
        <el-input v-model="ruleForm.sort" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model.number="ruleForm.remark" />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-tree-select
          v-if="showSelect"
          v-model="ruleForm.deptId"
          :data="deptData"
          check-strictly
          :render-after-expand="false"
          :props="defaultProps"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="振动系统" prop="useVib">
        <el-radio-group v-model="ruleForm.useVib" class="ml-4">
          <el-radio :value="0" size="large">不使用</el-radio>
          <el-radio :value="1" size="large">使用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="润滑系统" prop="useLub">
        <el-radio-group v-model="ruleForm.useLub" class="ml-4">
          <el-radio :value="0" size="large">不使用</el-radio>
          <el-radio :value="1" size="large">使用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="油液系统" prop="useOil">
        <el-radio-group v-model="ruleForm.useOil" class="ml-4">
          <el-radio :value="0" size="large">不使用</el-radio>
          <el-radio :value="1" size="large">使用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="设备图片" prop="equipImageUrl">
        <!-- <el-input v-model="ruleForm.equipImageUrl" /> -->
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <!-- <div style="text-align: center">
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
        <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
      </div> -->
    </el-form>
  </div>
</template>

<script lang="ts" setup name="equipDetail">
import { reactive, ref, toRefs } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { equip_equipInfo, equip_addOrUpdate, equip_deleteById } from "@/api/system/functionPosition";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import type { UploadProps } from "element-plus";
// 设备详情
const props = defineProps({
  nodeData: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const { nodeData } = toRefs(props);
console.log(nodeData.value, "父级传来的数据");
interface RuleForm {
  id: string;
  installLocationId: string;
  name: string;
  equipImageUrl: string;
  remark: string;
  code: string;
  deptId: string;
  sort: number | undefined;
  useVib: number;
  useLub: number;
  useOil: number;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive<RuleForm>({
  id: "",
  installLocationId: "",
  name: "",
  equipImageUrl: "",
  remark: "",
  code: "",
  deptId: "",
  sort: undefined,
  useVib: 0,
  useLub: 0,
  useOil: 0
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
});
// 方法区
const submitForm = async (formEl: FormInstance | undefined) => {
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
  // 添加设备
  let res: any = await equip_addOrUpdate(ruleForm);
  if (res.code == "200") {
    ElMessage.success("保存成功");
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 上传
const imageUrl = ref("");

const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

// 获取部门
import { getDepartTree } from "@/api/system/departmentManage";
const defaultProps = {
  children: "children",
  label: "name",
  value: "id"
};
let deptData = reactive([]);
let showSelect = ref(true);
const departTreeFun = async () => {
  let res: any = await getDepartTree();
  showSelect.value = false;
  if (res.code == "200") {
    deptData = res.data;
    showSelect.value = true;
    getEquipDetailFun();
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 获取详情
const getEquipDetailFun = async () => {
  let res: any = await equip_equipInfo({ id: nodeData.value["id"] });
  if (res.code == "200") {
    let data = res.data as any;
    ruleForm.id = data.id;
    ruleForm.installLocationId = data.installLocationId;
    ruleForm.name = data.name;
    ruleForm.equipImageUrl = data.equipImageUrl;
    ruleForm.remark = data.remark;
    ruleForm.code = data.code;
    ruleForm.deptId = data.deptId;
    ruleForm.sort = data.sort;
    ruleForm.useVib = data.useVib;
    ruleForm.useLub = data.useLub;
    ruleForm.useOil = data.useOil;
  } else {
    ElMessage.error(res?.mssage);
  }
};
// 删除设备
const deleteFun = async () => {
  await useHandleData(equip_deleteById, { id: nodeData.value?.id }, `删除【${nodeData.value.name}】设备`);
};
departTreeFun();
// 暴露
defineExpose({ ruleForm });
</script>
<style scoped lang=""></style>
