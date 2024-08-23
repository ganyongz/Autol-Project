<template>
  <!-- 第一个 停电检测 -->
  <div style="height: calc(100% - 15px)">
    <!-- 二级标题 -->
    <dv-border-box-11>
      <div>
        <!-- 状态统计 -->
        <div style="display: flex">
          <div style="width: 100%">
            <div>
              <dv-border-box-5 :color="['#225762', '#225762']" style="top: 80px; left: 40px; width: 280px; height: 40px">
                <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">
                  🌗状态统计
                </div>
              </dv-border-box-5>
            </div>
            <div>
              <dv-border-box-8 style="top: 90px; left: 40px; width: 370px; height: 230px; color: #ffffff">
                <div style="padding: 20px; font-size: 18px; font-weight: 700; color: #ffffff">
                  <!-- 表格 -->
                  总数：{{ statistics?.allNum }}
                  <div style="display: flex; text-align: center">
                    <div>
                      <dv-decoration-9 style="width: 140px; height: 140px; margin-right: 10px">
                        <div color-green font-600 class="content" bg="~ dark/0">
                          {{ Number((statistics?.online / statistics?.allNum) * 100).toFixed(1) }}%
                        </div>
                      </dv-decoration-9>
                      <p>在线数：{{ statistics?.online }}</p>
                    </div>
                    <div>
                      <dv-decoration-9 style="width: 140px; height: 140px" :color="['#cc0000', 'red']">
                        <div color-red font-600 class="content">
                          {{ Number((statistics?.offline / statistics?.allNum) * 100).toFixed(1) }}%
                        </div>
                      </dv-decoration-9>
                      <p>离线数：{{ statistics?.offline }}</p>
                    </div>
                  </div>
                </div>
              </dv-border-box-8>
            </div>
          </div>
          <!-- 监测 -->
          <div style="width: 100%">
            <div>
              <dv-border-box-5 :color="['#225762', '#225762']" style="top: 80px; left: 40px; width: 280px; height: 40px">
                <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">👁‍🗨监测</div>
              </dv-border-box-5>
            </div>

            <div>
              <dv-border-box-8 style="top: 90px; left: 40px; width: 370px; height: 230px; color: #ffffff">
                <div style="padding: 10px; font-size: 16px; font-weight: 500">
                  <div style="display: grid; grid-template-columns: 1fr 1fr">
                    <dv-active-ring-chart :config="conf" style="width: 220px; height: 220px" />
                    <div style="position: absolute; top: 60px; right: 20px">
                      <div class="jiance">
                        <p class="circle1"></p>
                        <p>润滑系统：{{ screenDatas?.All.lubNum }}</p>
                      </div>
                      <br />
                      <div class="jiance">
                        <p class="circle2"></p>
                        <p>状态监测：{{ screenDatas?.All.vibNum }}</p>
                      </div>
                      <br />
                      <div class="jiance">
                        <p class="circle3"></p>
                        <p>油液监测：{{ screenDatas?.All.oilNum }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </dv-border-box-8>
            </div>
          </div>
        </div>
        <!-- 地球 -->
        <div>
          <dv-border-box-8
            style="position: absolute; right: 0; bottom: 30px; left: 0; width: 90%; height: 580px; margin: auto; color: #ffffff"
          >
            <div style="padding: 20px; font-size: 18px; font-weight: 700; color: #ffffff; text-align: -webkit-center">
              <diqiu />
            </div>
          </dv-border-box-8>
        </div>
      </div>
    </dv-border-box-11>
  </div>
</template>

<script setup lang="ts">
import diqiu from "@/views/dataScreen/components/diqiu.vue";
// import lineTable from "/@/components/FirstComponent/lineTable.vue";
// import capsuleChart from "/@/components/FirstComponent/capsuleChart.vue";

// import ringChart from "/@/components/FirstComponent/ringChart.vue";
// import rowTable from "/@/components/FirstComponent/rowTable.vue";
import { ref, reactive, toRefs, watch } from "vue";
import { ElMessage } from "element-plus";
import { screen_CockpitOnlinePointStatistics } from "@/api/dataScreen";
const props = defineProps({
  screenDatas: {
    type: Object
    // default: () => {}
  }
});
let { screenDatas } = toRefs(props);
// 获取状态统计数据
let statistics = ref();
const getDatas1 = async () => {
  let res: any = await screen_CockpitOnlinePointStatistics({});
  if (res.code == "200") {
    statistics.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
};
let conf = reactive({
  lineWidth: 18,
  digitalFlopStyle: {
    fill: "pink",
    fontSize: 18
  },
  color: ["#3333ff", "#ffcc66", "#cc6633"],
  showOriginValue: true,
  data: [
    {
      name: "润滑系统",
      value: 10
    },
    {
      name: "油液监测",
      value: 10
    },
    {
      name: "状态检测",
      value: 10
    }
  ]
});
watch(
  () => screenDatas?.value?.All,
  newVal => {
    if (newVal) {
      conf.data[0].value = newVal.lubNum;
      conf.data[1].value = newVal.oilNum;
      conf.data[2].value = newVal.vibNum;
    }
  },
  { immediate: true, deep: true }
);
// 调用
getDatas1();
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中，如果需要的话 */
  height: 100px; /* 或者其他高度 */
}
.jiance {
  display: -webkit-inline-box;
  .circle1 {
    width: 15px;
    height: 15px;
    background: #3333ff;
    border-radius: 100%;
  }
  .circle2 {
    width: 15px;
    height: 15px;
    background: #ffcc66;
    border-radius: 100%;
  }
  .circle3 {
    width: 15px;
    height: 15px;
    background: #cc6633;
    border-radius: 100%;
  }
}
</style>
