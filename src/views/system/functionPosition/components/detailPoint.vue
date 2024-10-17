<template>
  <div style="width: 100%; padding: 10px">
    <!-- 测点 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
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

          <!-- <el-form-item label="振动类型" prop="vibType">
            <el-select v-model="ruleForm.vibType" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->

          <el-form-item label="测点类型" prop="pointType">
            <el-select v-model="ruleForm.pointType" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="绑定数据测点名称" prop="bindServerPointName">
            <el-col :span="16"><el-input v-model="ruleForm.bindServerPointName" disabled /></el-col>
            <el-col :span="8">
              <el-button type="primary" @click="addCollectorFun">绑定</el-button>
              <el-button type="info" @click="unBind">解绑</el-button>
            </el-col>
          </el-form-item>

          <el-form-item label="绑定数据测点类型" prop="serverPointType">
            <el-select v-model="ruleForm.serverPointType" placeholder="请选择" style="width: 100%" disabled>
              <el-option v-for="item in serverPointTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="报警策略" name="second">
        <alarmStrategy :node-data="nodeData" />
      </el-tab-pane>
    </el-tabs>
    <!-- 绑定数据测点 -->
    <myDialog :title="Ttitle" ref="myDialog1" draggable width="90%" :before-close="beforeClose1">
      <template #content>
        <bindTmp
          v-if="IsShowBindTmp"
          ref="bindRef"
          :row-data="ruleForm"
          :title="Ttitle"
          @close-dialog="closeDialog"
          @submit-form="submitForm"
        />
      </template>
    </myDialog>
  </div>
</template>
<script lang="ts" setup name="equipDetail">
import { reactive, ref, toRefs } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import alarmStrategy from "@/views/system/functionPosition/components/alarmStrategy.vue";
import {
  equipPoint_findById,
  equipPoint_addOrUpdate,
  equipPoint_deleteById,
  equipPoint_bindServerPointId,
  equipPoint_unbindingServerPointId
} from "@/api/system/functionPosition";
import bindTmp from "@/views/system/onlineSetup/instrumentMaintain/index.vue";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import mittBus from "@/utils/mittBus";
// 测点详情
const props = defineProps({
  nodeData: {
    type: Object,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    default: () => {}
  }
});
const { nodeData } = toRefs(props);
/**
const typeOptions = [
  { value: "Acceleration", label: "加速度" },
  { value: "Speed", label: "速度" },
  { value: "Displacement", label: "位移" }
]; //振动类型
*/
const pointTypeOptions = [
  { value: "Vib", label: "振动" },
  { value: "StartStop", label: "启停" },
  { value: "Temperature", label: "温度" },
  { value: "RotateSpeed", label: "转速" }
]; //测点类型
const serverPointTypeOptions = [
  { value: "VIB", label: "VIB" },
  { value: "MQTT", label: "MQTT" },
  { value: "TCP", label: "TCP" }
]; //绑定数据测点类型
interface RuleForm {
  id: string;
  name: string;
  code: string;
  partId: string; //部件id
  sort: number | undefined;
  pointType: string;
  // vibType: string;
  pointUnit: string;
  bindServerPointName: string;
  serverPointType: string;
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
  // vibType: "",
  pointUnit: "",
  bindServerPointName: "",
  serverPointType: ""
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }]
});
// 方法区
// 基本信息 和 报警策略 tab切换
const activeName = ref("first");
const handleClick = (tab: any, event: Event) => {
  console.log(tab, event);
};

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
    mittBus.emit("refreshLocationTree");
  } else {
    ElMessage.error(res?.message);
  }
};

// 获取详情
const getPointDetailFun = async () => {
  let res: any = await equipPoint_findById({ id: nodeData.value["id"] });
  if (res.code == "200") {
    let data = res.data as any;
    ruleForm.value = data;
    Object.assign(ruleForm.value, data);
    // ruleForm.name = data.name;
  } else {
    ElMessage.error(res?.message);
  }
};
// 删除测点
const deleteFun = async () => {
  await useHandleData(equipPoint_deleteById, { id: nodeData.value?.id }, `删除【${nodeData.value.name}】测点`);
  mittBus.emit("refreshLocationTree");
};
// 解绑数据测点
const unBind = async () => {
  // console.log(ruleForm.value);
  await useHandleData(equipPoint_unbindingServerPointId, { equipPointId: nodeData.value.id }, `解绑【${nodeData.value.name}】`);
  getPointDetailFun(); //获取详情
};
// 绑定数据测点
let bindRef = ref();
let rowData = ref();
let Ttitle = ref();
import myDialog from "@/components/dialog/myDialog.vue";
const myDialog1 = ref();
const IsShowBindTmp = ref(false);
const beforeClose1 = () => {
  IsShowBindTmp.value = false;
  myDialog1.value.close();
};
const addCollectorFun = () => {
  IsShowBindTmp.value = true;
  Ttitle.value = "绑定数据测点";
  rowData.value = nodeData.value;
  myDialog1.value.open();
};
//保存MQTT
const submitForm = async (val: any) => {
  let res: any = await equipPoint_bindServerPointId(val);
  if (res.code == "200") {
    getPointDetailFun();
    ElMessage.success("保存成功");
  } else {
    ElMessage.error(res?.message);
  }
  myDialog1.value.close();
  IsShowBindTmp.value = false;
};
const closeDialog = () => {
  // 取消
  myDialog1.value.close();
  IsShowBindTmp.value = false;
};

getPointDetailFun(); //获取详情
// 暴露
defineExpose({ ruleForm });
</script>
<style scoped lang=""></style>
