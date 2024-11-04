<template>
  <div style="height: 600px">
    <div style="height: 550px">
      <el-steps :active="activeStep" finish-status="success">
        <el-step
          v-for="(item, index) in steps"
          :key="index"
          :title="item.title"
          :description="item.description"
          @click="stepClickHandler(index)"
        />
      </el-steps>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules1"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
        :disabled="title == '详情'"
        style="width: 40%; height: 500px"
        v-if="activeStep == 1"
      >
        <el-form-item label="点检任务名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>

        <el-form-item label="是否启用" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" />
        </el-form-item>
      </el-form>
      <div v-if="isTrue">
        <Second ref="child2" :spot-check-cycle-id="ruleForm.spotCheckCycleId" v-show="activeStep == 2" />
        <Third ref="child3" :bind-equip-ids="ruleForm.spotCheckPlanBindEquipAddItem.equipIds" v-show="activeStep == 3" />
        <Fourth
          ref="child4"
          :spot-check-item-ids="ruleForm.spotCheckPlanBindEquipAddItem.spotCheckItemIds"
          v-show="activeStep == 4"
        />
        <Fifth :user-ids="ruleForm.spotCheckPlanBindUser.userIds" ref="child5" v-show="activeStep == 5" />
      </div>
    </div>
    <div style="margin-top: 45px; text-align: center">
      <el-button type="primary" @click="stepFun('minus', activeStep)" v-if="activeStep !== 1"> 上一步 </el-button>
      <el-button @click="resetForm()">取消</el-button>
      <el-button type="primary" @click="stepFun('plus', activeStep)" v-if="activeStep !== 5"> 下一步 </el-button>
      <el-button type="primary" @click="submitForm()" v-if="activeStep == 5"> 完成 </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 点检巡检周期 新增/编辑
import { reactive, ref, toRefs, onBeforeMount } from "vue";
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";
import { task_addOrUpdate, task_getInfoById } from "@/api/sportCheck/task";
import Second from "@/views/sportCheck/task/components/second.vue";
import Third from "@/views/sportCheck/task/components/third.vue";
import Fourth from "@/views/sportCheck/task/components/fourth.vue";
import Fifth from "@/views/sportCheck/task/components/fifth.vue";
let isTrue = ref(true);
const props = defineProps({
  rowId: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: ""
  }
});
const { rowId, title } = toRefs(props);
interface RuleForm {
  id: string;
  name: string;
  status: number;
  remark: string;
  spotCheckCycleId: string;
  spotCheckPlanBindEquipAddItem: {
    equipIds: string[];
    spotCheckItemIds: string[];
  };
  spotCheckPlanBindUser: {
    userIds: string[];
  };
}
// 枚举值
const options = reactive([
  { value: 0, label: "否" },
  { value: 1, label: "是" }
]);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
let ruleForm = ref<RuleForm>({
  id: "",
  name: "",
  status: 1,
  remark: "",
  spotCheckCycleId: "",
  spotCheckPlanBindEquipAddItem: {
    equipIds: [],
    spotCheckItemIds: []
  },
  spotCheckPlanBindUser: {
    userIds: []
  }
});

const rules1 = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入周期名称", trigger: "blue" }],
  status: [{ required: true, message: "请选择是否启用", trigger: "change" }]
});
// 方法区
const getInfoById = async () => {
  isTrue.value = false;
  let res: any = await task_getInfoById({ id: rowId.value });
  if (res.code == "200") {
    ruleForm.value = res.data;
    isTrue.value = true;
  } else {
    ElMessage.error(res?.message);
  }
};
onBeforeMount(() => {
  if (rowId?.value && (title.value == "编辑" || title.value == "详情")) {
    getInfoById();
  } else {
  }
});
let child2 = ref();
let child3 = ref();
let child4 = ref();
let child5 = ref();
const emit = defineEmits(["closeDialog", "submitForm"]);
const submitForm = async () => {
  ruleForm.value.spotCheckCycleId =
    child2.value.multipleSelection && child2.value.multipleSelection.length > 0
      ? child2.value.multipleSelection.map(obj => obj.id)[0]
      : "";
  ruleForm.value.spotCheckPlanBindEquipAddItem.equipIds = Object.values(child3.value.checkedArrIds);
  ruleForm.value.spotCheckPlanBindEquipAddItem.spotCheckItemIds =
    child4.value.multipleSelection && child4.value.multipleSelection.length > 0
      ? child4.value.multipleSelection.map(obj => obj.id)
      : [];

  ruleForm.value.spotCheckPlanBindUser.userIds =
    child5.value.multipleSelection && child5.value.multipleSelection.length > 0
      ? child5.value.multipleSelection.map(obj => obj.id)
      : [];
  delete ruleForm.value?.spotCheckCycle;
  const res: any = await task_addOrUpdate(ruleForm.value);
  if (res.code == "200") {
    ElMessage.success("保存成功");
    emit("submitForm");
  } else {
    ElMessage.error(res?.message);
  }
};

const resetForm = () => {
  emit("closeDialog");
};

// 步骤条 start
const activeStep = ref(1); // 当前激活的步骤索引
const steps = [
  { title: "点检任务", description: "点检任务基本信息" },
  { title: "点检周期", description: "点检周期绑定" },
  { title: "设备关联", description: "为所有选中设备添加相同点检项" },
  { title: "点检项关联", description: "设备与点检任务绑定" },
  { title: "点检人关联", description: "点检人与点检任务绑定" }
];
const stepClickHandler = (index: number) => {
  // 当点击步骤时，更新当前激活的步骤索引
  activeStep.value = index + 1;
  // 在这里可以添加更多的逻辑，如滚动到相应的内容区域等
};
const stepFun = (type: string, val: number) => {
  if (type == "plus") {
    //下一步
    activeStep.value = val + 1;
  } else {
    // 上一步
    activeStep.value = val - 1;
  }
};
// 步骤条 end

// 暴露
defineExpose({ ruleForm });
</script>
