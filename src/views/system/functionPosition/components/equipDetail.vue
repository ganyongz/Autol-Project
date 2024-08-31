<template>
  <div>
    <!-- 设备 -->
    <el-button type="primary" @click="submitEquipment(ruleFormRef)">保存</el-button>
    <el-button type="danger" @click="deleteFun">删除</el-button>
    <el-button type="success" plain @click="addUnitFun(ruleForm)">添加部件</el-button>
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
      <el-form-item label="设备分类" prop="classify">
        <el-select v-model="ruleForm.classify" class="m-2" placeholder="请选择">
          <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="设备图片" prop="equipImageUrl">
        <!-- <el-input v-model="ruleForm.equipImageUrl" /> -->
        <!-- <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload> -->
        <UploadImg :key="uploadImgKey" v-model:image-id="ruleForm.equipImageUrl" :file-size="5">
          <template #tip> 上传图片最大为 5M </template>
        </UploadImg>
      </el-form-item>
    </el-form>
    <myDialog :title="title" ref="myDialog1" draggable width="700px" :before-close="beforeClose1">
      <template #content>
        <addUnit
          v-if="IsShowAdd"
          ref="addEditRoleRef"
          :row-data="rowData"
          :title="title"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
  </div>
</template>

<script lang="ts" setup name="equipDetail">
import { reactive, ref, toRefs } from "vue";
import mittBus from "@/utils/mittBus";
import { useHandleData } from "@/hooks/useHandleData";
import { equip_equipInfo, equip_addOrUpdate, equip_deleteById, equipPart_addOrUpdate } from "@/api/system/functionPosition";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import myDialog from "@/components/dialog/myDialog.vue";
import addUnit from "@/views/system/functionPosition/components/addUnit.vue";
import UploadImg from "@/components/Upload/Img.vue";
// 设备详情
const props = defineProps({
  nodeData: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const { nodeData } = toRefs(props);
// console.log(nodeData.value, "父级传来的数据设备---000");
interface RuleForm {
  id: string;
  installLocationId: string;
  name: string;
  equipImageUrl: string;
  remark: string;
  code: string;
  deptId: string;
  sort: number | null;
  classify: number | undefined;
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
  sort: 1,
  classify: undefined
});
const classifyOptions = [
  { value: 1, label: "风电设备" },
  { value: 2, label: "港口设备" },
  { value: 3, label: "食品设备" },
  { value: 4, label: "工程机械" },
  { value: 5, label: "矿山" },
  { value: 6, label: "水泥" }
];
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  classify: [{ required: true, message: "请输选择设备分类", trigger: "change" }],
  sort: [{ required: true, message: "排序字段不能为空", trigger: "blur" }]
});
// 方法区
// 保存设备
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
  // 添加设备
  let res: any = await equip_addOrUpdate(ruleForm);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    mittBus.emit("refreshLocationTree");
  } else {
    ElMessage.error(res?.message);
  }
};
// 上传
// const imageUrl = ref("");

// const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
//   imageUrl.value = URL.createObjectURL(uploadFile.raw!);
// };

// const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
//   if (rawFile.size / 1024 / 1024 > 2) {
//     ElMessage.error("Avatar picture size can not exceed 2MB!");
//     return false;
//   }
//   return true;
// };

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
    ElMessage.error(res?.message);
  }
};
// 获取详情
let uploadImgKey = ref<number>(1);
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
    ruleForm.classify = data.classify;
    uploadImgKey.value += 1;
  } else {
    ElMessage.error(res?.message);
  }
};
// 删除设备
const deleteFun = async () => {
  await useHandleData(equip_deleteById, { id: nodeData.value?.id }, `删除【${nodeData.value.name}】设备`);
  mittBus.emit("refreshLocationTree");
};
// 添加部件
const addUnitFun = (row: any) => {
  if (row.id) {
    IsShowAdd.value = true;
    rowData.value = row;
    myDialog1.value.open();
  } else {
    ElMessage.error("请选择一个功能位置");
  }
};
// 新增部件
let addEditRoleRef = ref();
let rowData = ref();
let title = ref("新增部件");
const myDialog1 = ref();
const IsShowAdd = ref(false);
const beforeClose1 = () => {
  IsShowAdd.value = false;
  myDialog1.value.close();
};
const closeDialog = () => {
  // 取消
  myDialog1.value.close();
  IsShowAdd.value = false;
};
const submitForm = async () => {
  // 添加设备
  let res: any = await equipPart_addOrUpdate(addEditRoleRef.value.ruleForm);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    mittBus.emit("refreshLocationTree");
  } else {
    ElMessage.error(res?.message);
  }
  myDialog1.value.close();
  IsShowAdd.value = false;
};
departTreeFun();
// 暴露
defineExpose({ ruleForm });
</script>
<style scoped lang=""></style>
