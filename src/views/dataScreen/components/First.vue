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

        <div style="cursor: pointer" @click="ToTargetPage">
          <dv-border-box-8 style="top: 130px; left: 40px; width: 400px; height: 240px; color: #ffffff">
            <div style="padding: 10px; font-size: 16px; font-weight: 500">
              <div style="display: grid; grid-template-columns: 1fr 1fr">
                <div style="height: 220px; text-align: center">
                  <img src="@/views/dataScreen/images/windElectricity.jpg" style="width: 100%; height: 100%" alt="风电图" />
                </div>
                <div class="showData">
                  <p>润滑系统：34</p>
                  <p>状态监测：67</p>
                  <p>油液监测：135</p>
                </div>
              </div>
            </div>
          </dv-border-box-8>
        </div>

        <div style="width: 100%">
          <!-- 三级标题 -->
        </div>
        <!-- 2222 -->
        <div style="cursor: pointer" @click="ToTargetPage">
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
                    <img src="@/views/dataScreen/images/gangKou.jpg" style="width: 100%; height: 100%" alt="港口" />
                  </div>
                  <div class="showData">
                    <p>润滑系统：100</p>
                    <p>状态监测：100</p>
                    <p>油液监测：100</p>
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
                    <img src="@/views/dataScreen/images/shiPing.jpg" style="width: 100%; height: 100%" alt="食品" />
                  </div>
                  <div class="showData">
                    <p>润滑系统：234</p>
                    <p>状态监测：676</p>
                    <p>油液监测：4567</p>
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
const router = useRouter();
const ToTargetPage = () => {
  //路由跳转
  router.push("/platform/port/index");
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
