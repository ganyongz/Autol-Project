<template>
  <div class="box">
    <img
      v-if="title == '基本分析'"
      width="100%"
      height="100%"
      src="@/views/online/anlageuebersicht/images/jibenfenxi.png"
      alt="图片"
    />
    <img
      v-if="title == '趋势分析'"
      width="100%"
      height="100%"
      src="@/views/online/anlageuebersicht/images/qushifenxi.png"
      alt="图片"
    />
  </div>
</template>

<script setup lang="ts" name="analyses">
import { toRefs } from "vue";
const props = defineProps({
  title: {
    type: String,
    default: ""
  }
});
const { title } = toRefs(props);
</script>

<style lang="scss" scoped>
// .box {
// }
</style>
