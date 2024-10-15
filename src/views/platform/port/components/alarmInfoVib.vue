<template>
  <div class="main-box" style="overflow: auto">
    <dv-scroll-board :config="config" style="width: 98%; height: 280px" @mouseover="mouseoverHandler" @click="clickHandler" />
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs } from "vue";
let props = defineProps({
  transmitDatas: {
    type: Array,
    default: () => [{ partName: "", alarmLevel: "" }]
  }
});
let { transmitDatas } = toRefs(props);
// 检查数组不为空，然后使用 .map() 方法提取 partName 和 alarmLevel
const dataArray =
  transmitDatas?.value.length > 0 ? transmitDatas?.value.map((item: any) => [item.partName, item.alarmLevel]) : [];
const config = ref({
  header: ["部件名称", "报警等级"],
  data: [],
  index: false,
  // columnWidth: [50],
  align: ["center"],
  headerBGC: "rgb(10, 39, 50)"
});
config.value.data = dataArray as any;
const mouseoverHandler = (e: any) => {
  console.log(e);
};

const clickHandler = (e: any) => {
  console.log(e);
};
</script>
