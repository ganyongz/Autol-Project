<template>
  <div>
    <dv-active-ring-chart :config="conf" style="width: 300px; height: 300px" />
    <div style="display: flex; justify-content: space-around">
      <div style="color: green">{{ conf.data[0].name }}：{{ conf.data[0].value }}台</div>
      <div style="color: yellow">{{ conf.data[1].name }}：{{ conf.data[1].value }}台</div>
      <div style="color: red">{{ conf.data[2].name }}：{{ conf.data[2].value }}台</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";

const conf = reactive({
  lineWidth: 24,
  digitalFlopStyle: {
    fill: "pink"
  },
  data: [
    {
      name: "健康优",
      value: 98
    },
    {
      name: "健康良",
      value: 150
    },
    {
      name: "健康差",
      value: 62
    }
  ],
  numToFixed: 2
});
</script>
