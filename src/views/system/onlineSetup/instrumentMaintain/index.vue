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
        <collector v-if="type == 'type1'" />
        <mqtt v-if="type == 'type2'" />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="instrumentMaintain">
import { ref } from "vue";
import collector from "@/views/system/onlineSetup/instrumentMaintain/components/collector.vue";
import mqtt from "@/views/system/onlineSetup/instrumentMaintain/components/mqtt.vue";
const currentKey = ref("采集器");
interface Tree {
  label: string;
  children?: Tree[];
  type: string;
}
let type = ref("type1");
const handleNodeClick = (data: Tree) => {
  console.log(data);
  type.value = data.type;
};
const data: Tree[] = [
  {
    label: "采集器",
    children: [],
    type: "type1"
  },
  {
    label: "MQTT",
    children: [],
    type: "type2"
  }
];
const defaultProps = {
  children: "children",
  label: "label",
  type: "type"
};
</script>
<style scoped lang=""></style>
