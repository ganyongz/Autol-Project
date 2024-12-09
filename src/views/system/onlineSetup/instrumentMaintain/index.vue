<template>
  <div style="overflow: hidden">
    <!-- 仪器维护 -->
    <el-container style="height: auto; overflow: hidden">
      <el-aside style="width: 200px; background-color: var(--el-bg-color)">
        <el-tree
          style="width: 100%"
          :data="data"
          node-key="label"
          :default-checked-keys="['采集器']"
          :current-node-key="currentKey"
          :props="defaultProps"
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <collector ref="collectorRef" v-if="type == 'Collector'" :point-detail="rowData" />
        <mqtt ref="mqttRef" v-if="type == 'MQTT'" :point-detail="rowData" />
        <plc-management ref="plcRef" v-if="type == 'PlcChannel'" :point-detail="rowData" />
      </el-main>
    </el-container>
    <div style="text-align: center" v-if="title === '绑定数据测点'">
      <el-button type="primary" @click="SubmitEvent">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="instrumentMaintain">
import { ref, toRefs } from "vue";
import collector from "@/views/system/onlineSetup/instrumentMaintain/components/collector.vue";
import mqtt from "@/views/system/onlineSetup/instrumentMaintain/components/mqtt.vue";
import plcManagement from "@/views/system/plcManagement/index.vue";
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
const currentKey = ref("采集器");
interface Tree {
  label: string;
  children?: Tree[];
  type: string;
}
let type = ref("Collector");
const handleNodeClick = (data: Tree) => {
  type.value = data.type;
};
const data: Tree[] = [
  {
    label: "采集器",
    children: [],
    type: "Collector"
  },
  {
    label: "MQTT",
    children: [],
    type: "MQTT"
  },
  {
    label: "PLC",
    children: [],
    type: "PlcChannel"
  }
];
const defaultProps = {
  children: "children",
  label: "label",
  type: "type"
};
// 保存勾选数据
const mqttRef = ref();
const collectorRef = ref();
let plcRef = ref();
const emit = defineEmits(["closeDialog", "submitForm"]);
const SubmitEvent = () => {
  let tType = ref("");
  switch (type.value) {
    case "MQTT":
      tType.value = mqttRef.value["multipleSelection"][0].id;
      break;
    case "Collector":
      tType.value = collectorRef.value["multipleSelection"][0].id;
      break;
    case "PlcChannel":
      tType.value = plcRef.value["radioId"];
      break;

    default:
      break;
  }
  let obj = {
    equipPointId: rowData.value["id"],
    serverPointId: tType.value,
    serverPointType: type.value
  };
  emit("submitForm", obj);
};
</script>
<style scoped lang="scss">
:deep(.el-divider--horizontal) {
  margin: 10px 0;
}
.el-main {
  --el-main-padding: 10px;
}
</style>
