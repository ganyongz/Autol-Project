<template>
  <div style="height: calc(100%)">
    <!-- 二级标题 -->
    <dv-border-box-11 style="width: 450px">
      <div>
        <!-- 三级标题 -->
        <!-- 1111 -->
        <!-- 三级标题 -->
        <div>
          <dv-border-box-5 :color="['#225762', '#225762']" style="top: 120px; left: 40px; width: 200px; height: 40px">
            <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">🕸 风力发电</div>
          </dv-border-box-5>
        </div>

        <div style="cursor: pointer" @click="ToTargetPage(1)">
          <dv-border-box-8 style="top: 130px; left: 40px; width: 400px; height: 240px; color: #ffffff">
            <div style="padding: 10px; font-size: 16px; font-weight: 500">
              <div style="display: grid; grid-template-columns: 1fr 1fr">
                <div style="height: 220px; text-align: center">
                  <img src="@/views/dataScreen/images/windElectricity.png" style="width: 100%; height: 100%" alt="风电图" />
                </div>
                <div class="showData">
                  <p>润滑系统：{{ screenDatas?.windPower.lubNum }}</p>
                  <p>状态监测：{{ screenDatas?.windPower.vibNum }}</p>
                  <p>油液监测：{{ screenDatas?.windPower.oilNum }}</p>
                </div>
              </div>
            </div>
          </dv-border-box-8>
        </div>

        <div style="width: 100%">
          <!-- 三级标题 -->
        </div>
        <!-- 2222 -->
        <div style="cursor: pointer" @click="ToTargetPage(2)">
          <!-- 三级标题 -- 港口 -->
          <div>
            <dv-border-box-5 :color="['#225762', '#225762']" style="top: 120px; left: 40px; width: 280px; height: 40px">
              <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">⚒️ 港口</div>
            </dv-border-box-5>
          </div>

          <div>
            <dv-border-box-8 style="top: 130px; left: 40px; width: 400px; height: 220px; color: #ffffff">
              <div style="padding: 10px; font-size: 16px; font-weight: 500">
                <div style="display: grid; grid-template-columns: 1fr 1fr">
                  <div style="height: 200px; text-align: center">
                    <img src="@/views/dataScreen/images/gangKou1.png" style="width: 100%; height: 100%" alt="港口" />
                  </div>
                  <div class="showData">
                    <p>润滑系统：{{ screenDatas?.port.lubNum }}</p>
                    <p>状态监测：{{ screenDatas?.port.vibNum }}</p>
                    <p>油液监测：{{ screenDatas?.port.oilNum }}</p>
                  </div>
                </div>
              </div>
            </dv-border-box-8>
          </div>
        </div>

        <div style="margin-left: 0">
          <!-- 三级标题 -->
          <div>
            <dv-border-box-5 :color="['#225762', '#225762']" style="top: 140px; left: 40px; width: 280px; height: 40px">
              <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">🍔食品</div>
            </dv-border-box-5>
          </div>

          <div>
            <dv-border-box-8 style="top: 140px; left: 40px; width: 400px; height: 220px; color: #ffffff">
              <div style="padding: 10px; font-size: 16px; font-weight: 500">
                <div style="display: grid; grid-template-columns: 1fr 1fr">
                  <div style="height: 200px; text-align: center">
                    <img src="@/views/dataScreen/images/shiPing.png" style="width: 100%; height: 100%" alt="食品" />
                  </div>
                  <div class="showData">
                    <p>润滑系统：{{ screenDatas?.food.lubNum }}</p>
                    <p>状态监测：{{ screenDatas?.food.vibNum }}</p>
                    <p>油液监测：{{ screenDatas?.food.oilNum }}</p>
                  </div>
                </div>
              </div>
            </dv-border-box-8>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </dv-border-box-11>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { toRefs } from "vue";
const props = defineProps({
  screenDatas: {
    type: Object
    // default: () => {}
  }
});
let { screenDatas } = toRefs(props);
const router = useRouter();
// 路由跳转 (跳转到对应模块)
const ToTargetPage = (tType: any) => {
  if (tType === 1) {
    //风电
    router.push({ path: "/platform/port/windPower", query: { type: tType } });
  }
  if (tType === 2) {
    //港口
    router.push({ path: "/platform/port/index", query: { type: tType } });
  }
};
</script>
<style scoped lang="scss">
.showData {
  margin-left: 10px;
}
.flex {
  display: flex;

  // .showData {
  //   margin-left: 10px;
  // }
}
</style>
