<template>
  <!-- 第一个 停电检测 -->
  <div>
    <!-- 二级标题 -->
    <dv-border-box-11 title="⭐分布" style="height: 930px">
      <div>
        <div>
          <dv-border-box-8 style="top: 90px; left: 40px; width: 90%; height: 500px; color: #ffffff">
            <div style="padding: 20px; font-size: 18px; font-weight: 700; color: #ffffff; text-align: -webkit-center">
              <diqiu />
            </div>
          </dv-border-box-8>
        </div>

        <!-- 下面 -->
        <div class="flex">
          <div style="width: 100%">
            <!-- 三级标题 -->
            <div>
              <dv-border-box-5 :color="['#225762', '#225762']" style="top: 120px; left: 40px; width: 200px; height: 40px">
                <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">
                  🕸 风力发电
                </div>
              </dv-border-box-5>
            </div>

            <div>
              <dv-border-box-8 style="top: 130px; left: 40px; width: 90%; height: 240px; color: #ffffff">
                <div style="padding: 10px; font-size: 16px; font-weight: 500">
                  <div style="display: grid; grid-template-columns: 1fr 1fr">
                    <div style="height: 220px; text-align: center; border: 1px solid #33ffff">暂无图片</div>
                    <div>
                      <p>润滑系统：34</p>
                      <p>状态监测：67</p>
                      <p>油压监测：135</p>
                    </div>
                  </div>
                </div>
              </dv-border-box-8>
            </div>
          </div>

          <div style="width: 100%">
            <!-- 三级标题 -->
            <div>
              <dv-border-box-5 :color="['#225762', '#225762']" style="top: 120px; left: 40px; width: 200px; height: 40px">
                <div style="padding-top: 8px; padding-left: 15px; font-size: 18px; font-weight: 700; color: #33ffff">
                  💡工程机械
                </div>
              </dv-border-box-5>
            </div>

            <div>
              <dv-border-box-8 style="top: 130px; left: 40px; width: 90%; height: 240px; color: #ffffff">
                <div style="padding: 10px; font-size: 16px; font-weight: 500">
                  <div style="display: grid; grid-template-columns: 1fr 1fr">
                    <div style="height: 220px; text-align: center; border: 1px solid #33ffff">暂无图片</div>
                    <div>
                      <p>润滑系统：90</p>
                      <p>状态监测：100</p>
                      <p>油压监测：110</p>
                    </div>
                  </div>
                </div>
              </dv-border-box-8>
            </div>
          </div>
        </div>
      </div>
    </dv-border-box-11>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
}
</style>

<script setup lang="ts">
import diqiu from "@/views/dataScreen/components/diqiu.vue";
// import lineTable from "/@/components/FirstComponent/lineTable.vue";
// import capsuleChart from "/@/components/FirstComponent/capsuleChart.vue";

// import ringChart from "/@/components/FirstComponent/ringChart.vue";
// import rowTable from "/@/components/FirstComponent/rowTable.vue";
</script>
