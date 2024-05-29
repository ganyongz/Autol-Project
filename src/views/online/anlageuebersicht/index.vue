<template>
  <div class="contentBox">
    <el-container>
      <el-header><div style="margin: 0 auto">#09风机</div></el-header>
      <el-container>
        <el-aside width="200px">
          <div class="outer">
            <div class="top-content">
              <p>综合分析：<span class="analyseRes">无评价</span></p>
              <p>智能诊断：<span class="analyseRes">无故障</span></p>
              <p>大数据预警：<span class="analyseRes">无预警</span></p>
              <p>趋势预测：--</p>
            </div>
            <div class="bottom-content">
              <p>0 天 0.97 小时</p>
              <p style="width: 50px; color: #0080ff; border-bottom: 1px solid"></p>
              <p style="font-size: 12px">本次运行时长</p>
              <!-- 分割 -->
              <p>181 天 3.97 小时</p>
              <p style="width: 50px; color: #0080ff; border-bottom: 1px solid"></p>
              <p style="font-size: 12px">运行总时长</p>
              <p style="font-size: 12px">数据更新时间 2024-05-27 10:36:49</p>
            </div>
          </div>
        </el-aside>
        <el-main style="position: relative; overflow: hidden">
          <el-card class="positioned-card" :style="{ top: cardTop + 'px', left: cardLeft + 'px' }">
            <template #header>
              <div>
                <span>风机振动</span>
              </div>
            </template>
            <p style="padding-left: 10px; font-size: 12px">风机轴承传入：<span style="color: #19be6b">3.01mm/s</span></p>
            <p style="padding-left: 10px; font-size: 12px">风机轴承传出：<span style="color: #19be6b">2.01mm/s</span></p>
          </el-card>

          <el-card class="positioned-card" :style="{ top: 100 + 'px', left: 750 + 'px' }">
            <template #header>
              <div>
                <span>电机</span>
              </div>
            </template>
            <p style="padding-left: 10px; font-size: 12px">电流：<span style="color: #19be6b">无数据</span></p>
            <p style="padding-left: 10px; font-size: 12px">频率：<span style="color: #19be6b">无数据</span></p>
          </el-card>

          <el-card class="positioned-card" :style="{ top: 600 + 'px', left: 1600 + 'px' }">
            <template #header>
              <div>
                <span>工艺通道</span>
              </div>
            </template>
            <p style="padding-left: 10px; font-size: 12px">风机轴承传入：<span style="color: #19be6b">无数据</span></p>
            <p style="padding-left: 10px; font-size: 12px">风机轴承传出：<span style="color: #19be6b">无数据</span></p>
          </el-card>

          <div>
            <img src="../images/dianji1.gif" alt="dianji1" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup name="anlageuebersicht">
import { ref } from "vue";
let cardTop = ref(100);
let cardLeft = ref(150);
</script>
<style scoped lang="scss">
.contentBox {
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
.outer {
  position: relative;
  height: 1000px;
  .analyseRes {
    color: #19be6b;
  }
}
.top-content {
  /* 顶部内容的样式 */
  // border: 1px solid red;
}
.bottom-content {
  position: absolute;
  bottom: 0;
  width: 100%;

  // border: 1px solid yellow;

  /* 底部内容的样式 */
}

// 卡片位置
.positioned-card {
  position: absolute; /* 绝对定位或固定定位也可以 */
  width: 200px;
  height: 120px;
}
:deep(.el-card__body) {
  padding: 0;
}
</style>
