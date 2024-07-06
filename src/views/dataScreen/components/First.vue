<template>
  <div>
    <!-- 二级标题 -->
    <dv-border-box-11 style="width: 450px; height: 960px">
      <div>
        <!-- 三级标题 -->
        <div>
          <dv-border-box-5 :color="['#225762', '#225762']" style="top: 80px; left: 40px; width: 280px; height: 40px">
            <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">🌗状态统计</div>
          </dv-border-box-5>
        </div>
        <div>
          <dv-border-box-8 style="top: 90px; left: 40px; width: 400px; height: 230px; color: #ffffff">
            <div style="padding: 20px; font-size: 18px; font-weight: 700; color: #ffffff">
              <!-- 表格 -->
              总数：1817
              <div style="display: flex; text-align: center">
                <div>
                  <dv-decoration-9 style="width: 140px; height: 140px; margin-right: 10px">
                    <div color-green font-600 class="content" bg="~ dark/0">96%</div>
                  </dv-decoration-9>
                  <p>在线数：1798</p>
                </div>
                <div>
                  <dv-decoration-9 style="width: 140px; height: 140px" :color="['#cc0000', 'red']">
                    <div color-red font-600 class="content">4%</div>
                  </dv-decoration-9>
                  <p>离线数：19</p>
                </div>
              </div>
            </div>
          </dv-border-box-8>
        </div>
        <div>
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
                    <p>油压监测：100</p>
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
                    <p>油压监测：4567</p>
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

<script lang="ts" setup></script>
<style scoped lang="scss">
.showData {
  margin-left: 10px;
}
</style>
