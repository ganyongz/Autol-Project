<template>
  <div>
    <!-- 二级标题 -->
    <dv-border-box-11 style="width: 450px; height: 960px">
      <div>
        <!-- 三级标题 -->
        <div>
          <dv-border-box-5 :color="['#225762', '#225762']" style="top: 80px; left: 40px; width: 280px; height: 40px">
            <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">👁‍🗨监测</div>
          </dv-border-box-5>
        </div>

        <div>
          <dv-border-box-8 style="top: 90px; left: 40px; width: 400px; height: 230px; color: #ffffff">
            <div style="padding: 10px; font-size: 16px; font-weight: 500">
              <div style="display: grid; grid-template-columns: 1fr 1fr">
                <dv-active-ring-chart :config="conf" style="width: 220px; height: 220px" />
                <div style="position: absolute; top: 60px; right: 20px">
                  <div class="jiance">
                    <p class="circle1"></p>
                    <p>润滑系统：1098</p>
                  </div>
                  <br />
                  <div class="jiance">
                    <p class="circle2"></p>
                    <p>油液监测：150</p>
                  </div>
                  <br />
                  <div class="jiance">
                    <p class="circle3"></p>
                    <p>状态监测：262</p>
                  </div>
                </div>
              </div>
            </div>
          </dv-border-box-8>
        </div>
        <div>
          <!-- 三级标题 -->
          <div>
            <dv-border-box-5 :color="['#225762', '#225762']" style="top: 120px; left: 40px; width: 280px; height: 40px">
              <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">🗻 矿山</div>
            </dv-border-box-5>
          </div>

          <div>
            <dv-border-box-8 style="top: 130px; left: 40px; width: 400px; height: 220px; color: #ffffff">
              <div style="padding: 10px; font-size: 16px; font-weight: 500">
                <div style="display: grid; grid-template-columns: 1fr 1fr">
                  <div style="height: 200px; text-align: center">
                    <img src="@/views/dataScreen/images/kuangShan.jpg" style="width: 100%; height: 100%" alt="矿山" />
                  </div>
                  <div class="showData">
                    <p>润滑系统：11</p>
                    <p>状态监测：32</p>
                    <p>油液监测：56</p>
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
              <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">🌟水泥</div>
            </dv-border-box-5>
          </div>

          <div>
            <dv-border-box-8 style="top: 140px; left: 40px; width: 400px; height: 220px; color: #ffffff">
              <div style="padding: 10px; font-size: 16px; font-weight: 500">
                <div style="display: grid; grid-template-columns: 1fr 1fr">
                  <div style="height: 200px; text-align: center">
                    <img src="@/views/dataScreen/images/shuiNi.png" style="width: 100%; height: 100%" alt="水泥" />
                  </div>
                  <div class="showData">
                    <p>润滑系统：80</p>
                    <p>状态监测：13</p>
                    <p>油液监测：287</p>
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
import { reactive } from "vue";
const conf = reactive({
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
      value: 1098
    },
    {
      name: "油液监测",
      value: 150
    },
    {
      name: "状态检测",
      value: 262
    }
  ]
});
</script>
<style scoped lang="scss">
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
.showData {
  margin-left: 10px;
}
</style>
