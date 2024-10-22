<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"> 全选 </el-checkbox>
    <el-checkbox-group v-model="selectedValues">
      <el-checkbox v-for="item in data" :key="item.id" :label="item.label" :value="item.value">
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
    <div style="text-align: center">
      <el-button type="primary" @click="resetForm">关闭</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, toRefs } from "vue";
const emit = defineEmits(["closeDialog"]);
const props = defineProps({
  selectedVal: {
    type: String
    // default: () => {}
  }
});
let { selectedVal } = toRefs(props);
const data = ref([
  { id: "1", label: "数据时间", value: "dataTime" },
  { id: "2", label: "油液温度", value: "oilTemperature" },
  { id: "3", label: "水活性", value: "waterActivity" },
  { id: "4", label: "含水量", value: "moistureContent" },
  { id: "5", label: "粘度", value: "viscosity" },
  { id: "6", label: "密度", value: "density" },
  { id: "7", label: "介电常数", value: "dielectricConstant" },
  { id: "8", label: "污染度标准", value: "contaminationStandard" },
  { id: "9", label: "＞1μm颗粒数", value: "particles1" },
  { id: "10", label: "＞2μm颗粒数", value: "particles2" },
  { id: "11", label: "＞5μm颗粒数", value: "particles5" },
  { id: "12", label: "＞10μm颗粒数", value: "particles10" },
  { id: "13", label: "＞15μm颗粒数", value: "particles15" },
  { id: "14", label: "＞20μm颗粒数", value: "particles20" },
  { id: "15", label: "＞50μm颗粒数", value: "particles50" },
  { id: "16", label: "＞100μm颗粒数", value: "particles100" },
  { id: "17", label: "污染度等级", value: "contaminationLevel" },
  { id: "18", label: "铁磁总颗粒", value: "ironParticlesNum" },
  { id: "19", label: "非铁磁总颗粒", value: "notIronParticlesNum" },
  { id: "20", label: "金属磨粒壳体温度", value: "housingTemperature" },
  { id: "15", label: "60s铁磁浓度", value: "ironParticlesConcentration60s" },
  { id: "21", label: "60s非铁磁浓度", value: "notIronParticlesConcentration60s" },
  { id: "22", label: "铁磁浓度", value: "ironParticlesConcentration" },
  { id: "23", label: "非铁磁浓度", value: "notIronParticlesConcentration" },
  { id: "24", label: "油液流速", value: "oilFlowRate" },
  { id: "25", label: "运行状态", value: "runStatus" }
]);

const selectedValues = ref([]);
selectedValues.value = selectedVal.value ? JSON.parse(selectedVal.value) : [];
const checkAll = ref(false);
const isIndeterminate = ref(false);

const handleCheckAllChange = val => {
  if (val) {
    selectedValues.value = data.value.map(item => item.value);
    console.log(selectedValues.value);
  } else {
    selectedValues.value = [];
  }
  isIndeterminate.value = false;
};

// 计算属性，用于确定全选复选框的不确定状态
const checkedCount = ref(0);
watch(selectedValues, newVal => {
  checkedCount.value = newVal.length;
  isIndeterminate.value = checkedCount.value > 0 && checkedCount.value < data.value.length;
});
const resetForm = () => {
  emit("closeDialog");
};
// 暴露
defineExpose({ selectedValues });
</script>
