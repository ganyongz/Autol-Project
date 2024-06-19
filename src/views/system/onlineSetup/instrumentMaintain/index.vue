<template>
  <div>
    <!-- 仪器维护 -->
    <el-container>
      <el-aside width="300px">
        <el-tree
          style="max-width: 300px; height: 100%"
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
      </el-main>
    </el-container>
    <div style="text-align: center">
      <el-button type="primary" @click="SubmitEvent">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="instrumentMaintain">
import { ref, toRefs } from "vue";
import collector from "@/views/system/onlineSetup/instrumentMaintain/components/collector.vue";
import mqtt from "@/views/system/onlineSetup/instrumentMaintain/components/mqtt.vue";
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
const { rowData } = toRefs(props);
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
const emit = defineEmits(["closeDialog", "submitForm"]);
const SubmitEvent = () => {
  let obj = {
    equipPointId: rowData.value["id"],
    serverPointId:
      type.value == "MQTT" ? mqttRef.value["multipleSelection"][0].id : collectorRef.value["multipleSelection"][0].id, //待优化
    //  switch (type.value) {
    //   case MQTT:
    //   serverPointId:mqttRef.value["multipleSelection"][0].id
    //     break;

    //   default:
    //     break;
    // }
    serverPointType: type.value
  };
  emit("submitForm", obj);
};
</script>
<style scoped lang=""></style>
