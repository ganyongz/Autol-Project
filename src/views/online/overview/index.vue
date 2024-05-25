<template>
  <div class="flex flex-wrap gap-4 list">
    <el-card v-for="(item, index) in 28" :key="index" class="box-card" shadow="hover">
      <div class="left">
        <div>#{{ index }}机组</div>
        <img src="" alt="暂无图片" />
      </div>
      <div class="right">
        <el-button type="primary">正常</el-button>
        <p>震动检测最大值：100</p>
        <p>运行总时长：987h</p>
        <p>单次运行时长：1.25h</p>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="overview">
// import { ref } from "vue";
// let equipmentList = ref([]);
</script>
<style scoped lang="scss">
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-card {
    height: 170px;
    padding: 0;
    .el-card__body {
      height: 100% !important;
      padding: 5px !important;
    }
  }
}
.box-card {
  /* flex: 0 0 24% 该属性等价于 flex:none;width:24% */
  flex: 0 0 24%;
  height: 100%;
  margin-bottom: 10px;
  border-radius: 10px;
  transition: transform 0.3s; /* 放大缩小动画时间 */
}
.box-card:hover {
  transform: scale(1.1); /* 鼠标悬浮时放大卡片 */
}
.left {
  float: left;
  width: 200px;
  height: 140px;
}
.right {
  float: right;
  width: calc(100% - 200px);
  height: 140px;

  // border: 1px solid red;
}
</style>
