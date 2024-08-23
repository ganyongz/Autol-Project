<template>
  <div class="main-box" style="overflow: auto">
    <dv-scroll-board :config="config" style="width: 98%; height: 280px" @mouseover="mouseoverHandler" @click="clickHandler" />
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs } from "vue";
let props = defineProps({
  transmitDatas: {
    type: Array
  }
});
let { transmitDatas } = toRefs(props);
console.log(transmitDatas);
const config = ref({
  header: ["部件名称", "报警等级"],
  data: [
    ["#1", "低报"],
    ["#2", "低低报"],
    ["#3", "高报"],
    ["#4", "高报"],
    ["#5", "低报"],
    ["#6", "高高报"],
    ["#7", "低低报"],
    ["#8", "高报"],
    ["#9", "高报"],
    ["#10", "低报"]
  ],
  index: false,
  // columnWidth: [50],
  align: ["center"]
});

const mouseoverHandler = (e: any) => {
  console.log(e);
};

const clickHandler = (e: any) => {
  console.log(e);
};
</script>
