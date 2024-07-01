<template>
  <div demo-bg>
    <dv-scroll-board :config="config" style="width: 100%; height: 300px" @mouseover="mouseoverHandler" @click="clickHandler" />
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
const config = reactive({
  header: ["设备名称", "测点位置", "报警时间"],
  data: [
    ["#1", "行1列2", "2024-07-01 19:54:25"],
    ["#2", "行2列2", "2024-07-01 19:54:25"],
    ["#3", "行3列2", "2024-07-01 19:54:25"],
    ["#4", "行4列2", "2024-07-01 19:54:25"],
    ["#5", "行5列2", "2024-07-01 19:54:25"],
    ["#6", "行6列2", "2024-07-01 19:54:25"],
    ["#7", "行7列2", "2024-07-01 19:54:25"],
    ["#8", "行8列2", "2024-07-01 19:54:25"],
    ["#9", "行9列2", "2024-07-01 19:54:25"],
    ["#10", "行10列2", "2024-07-01 19:54:25"]
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
