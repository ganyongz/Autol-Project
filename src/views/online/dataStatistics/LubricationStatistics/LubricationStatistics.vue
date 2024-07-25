<template>
  <div class="table-box bg-color">
    <!-- 润滑、报警记录 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="润滑记录" name="first">
        <lubrication />
      </el-tab-pane>
      <el-tab-pane label="报警记录" name="second">
        <alarm />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup name="LubricationStatistics">
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import lubrication from "@/views/online/dataStatistics/LubricationStatistics/components/lubrication.vue";
import alarm from "@/views/online/dataStatistics/LubricationStatistics/components/alarm.vue";

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
