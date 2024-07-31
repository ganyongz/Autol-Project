<template>
  <div class="table-box bg-color">
    <!-- 润滑、报警记录 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="润滑记录" name="first">
        <lubrication :part-id="partId" />
      </el-tab-pane>
      <el-tab-pane label="报警记录" name="second">
        <alarm v-if="activeName == 'second'" :part-id="partId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup name="LubricationStatistics">
import { ref, onMounted } from "vue";
import type { TabsPaneContext } from "element-plus";
import lubrication from "@/views/online/dataStatistics/LubricationStatistics/components/lubrication.vue";
import alarm from "@/views/online/dataStatistics/LubricationStatistics/components/alarm.vue";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route.query.partId);
let partId = ref();
onMounted(() => {
  partId.value = route.query.partId;
});

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>
<style scoped lang="scss">
.bg-color {
  background-color: var(--el-fill-color-blank);
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
</style>
