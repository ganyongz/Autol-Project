<template>
  <div style="height: calc(100%)">
    <!-- 二级标题 -->
    <dv-border-box-11 style="width: 450px">
      <div>
        <!-- 三级标题 -->
        <div>
          <dv-border-box-5 :color="['#225762', '#225762']" style="top: 120px; left: 40px; width: 200px; height: 40px">
            <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">💡工程机械</div>
          </dv-border-box-5>
        </div>

        <div>
          <dv-border-box-8 style="top: 130px; left: 40px; width: 400px; height: 240px; color: #ffffff">
            <div style="padding: 10px; font-size: 16px; font-weight: 500">
              <div style="display: grid; grid-template-columns: 1fr 1fr">
                <div style="height: 220px; text-align: center">
                  <img src="@/views/dataScreen/images/gongchengjixie.png" style="width: 100%; height: 100%" alt="工程机械" />
                </div>
                <div class="showData">
                  <p>润滑系统：90</p>
                  <p>状态监测：100</p>
                  <p>油液监测：110</p>
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
                    <img src="@/views/dataScreen/images/kuangShan1.jpg" style="width: 100%; height: 100%" alt="矿山" />
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
      </div>
    </dv-border-box-11>
  </div>
</template>

<script lang="ts" setup></script>
<style scoped lang="scss">
.showData {
  margin-left: 10px;
}
</style>
