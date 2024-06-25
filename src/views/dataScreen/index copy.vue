<template>
  <div class="dataScreen-container">
    <div class="dataScreen-content" ref="dataScreenRef">
      <div class="dataScreen-header">
        <div class="header-lf">
          <span class="header-screening" @click="router.push(HOME_URL)">首页</span>
        </div>
        <div class="header-ct">
          <div class="header-ct-title">
            <span>智慧润滑大数据可视化展示平台</span>
            <!-- <div class="header-ct-warning">平台高峰预警信息（2条）</div> -->
          </div>
        </div>
        <div class="header-ri">
          <span class="header-time">当前时间：{{ time }}</span>
        </div>
      </div>
      <div class="dataScreen-main">
        <div class="dataScreen-lf">
          <div class="dataScreen-top">
            <div class="dataScreen-main-title">
              <span>报警信息</span>
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <div class="dataScreen-main-chart" style="margin-left: 30px; text-align: center">
              <!-- <RealTimeAccessChart /> -->
              <baojingxinxi />
            </div>
          </div>

          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>启停统计</span>
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <div class="dataScreen-main-chart">
              <qitingtongji />
              <!-- <AgeRatioChart /> -->
            </div>
          </div>
        </div>
        <div class="dataScreen-ct">
          <div class="dataScreen-map">
            <!-- <div class="dataScreen-map-title">风电大图</div> -->
            <img src="./images/fd.png" alt="暂未显示图片" />
            <!-- <ChinaMapChart /> -->
          </div>
          <!-- <div class="dataScreen-cb">
            <div class="dataScreen-main-title">
              <span>行业增量趋势图</span>
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <div class="dataScreen-main-chart">放组件</div>
          </div> -->
        </div>
        <div class="dataScreen-rg">
          <div class="dataScreen-top">
            <div class="dataScreen-main-title">
              <span>状态统计</span>
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <div class="dataScreen-main-chart">
              <zhuangtaitongji />
              <!-- <HotPlateChart /> -->
            </div>
          </div>
          <div class="dataScreen-bottom">
            <div class="dataScreen-main-title">
              <span>本月润滑统计</span>
              <img src="./images/dataScreen-title.png" alt="" />
            </div>
            <div class="dataScreen-main-chart">
              <runhuatongji />
              <!-- <PlatformSourceChart /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dataScreen">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { HOME_URL } from "@/config";
import { useRouter } from "vue-router";

// import AgeRatioChart from "./components/AgeRatioChart.vue";
// import AnnualUseChart from "./components/AnnualUseChart.vue";
// import ChinaMapChart from "./components/ChinaMapChart.vue";
// import HotPlateChart from "./components/HotPlateChart.vue";
// import MaleFemaleRatioChart from "./components/MaleFemaleRatioChart.vue";
// import OverNext30Chart from "./components/OverNext30Chart.vue";
// import PlatformSourceChart from "./components/PlatformSourceChart.vue";
// import RealTimeAccessChart from "./components/RealTimeAccessChart.vue";
import baojingxinxi from "@/views/dataScreen/components/baojingxinxi.vue";
import qitingtongji from "@/views/dataScreen/components/qitingtongji.vue";
import zhuangtaitongji from "@/views/dataScreen/components/zhuangtaitongji.vue";
import runhuatongji from "@/views/dataScreen/components/runhuatongji.vue";

import dayjs from "dayjs";

const router = useRouter();
const dataScreenRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    dataScreenRef.value.style.width = `2900px`;
    dataScreenRef.value.style.height = `1300px`;
  }
  window.addEventListener("resize", resize);
});

// 设置响应式
const resize = () => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
  }
};

// 根据浏览器大小推断缩放比例
const getScale = (width = 2900, height = 1300) => {
  let ww = window.innerWidth / width;
  let wh = window.innerHeight / height;
  return ww < wh ? ww : wh;
};

// 获取当前时间
let timer: NodeJS.Timer | null = null;
let time = ref<string>(dayjs().format("YYYY年MM月DD HH:mm:ss"));
timer = setInterval(() => {
  time.value = dayjs().format("YYYY年MM月DD HH:mm:ss");
}, 1000);

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  clearInterval(timer as unknown as number);
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
