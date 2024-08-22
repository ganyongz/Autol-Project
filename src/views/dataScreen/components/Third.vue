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
                  <p>润滑系统：{{ screenDatas?.engineering.lubNum }}</p>
                  <p>状态监测：{{ screenDatas?.engineering.vibNum }}</p>
                  <p>油液监测：{{ screenDatas?.engineering.oilNum }}</p>
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
                    <img src="@/views/dataScreen/images/kuangShan.png" style="width: 100%; height: 100%" alt="矿山" />
                  </div>
                  <div class="showData">
                    <p>润滑系统：{{ screenDatas?.mine.lubNum }}</p>
                    <p>状态监测：{{ screenDatas?.mine.vibNum }}</p>
                    <p>油液监测：{{ screenDatas?.mine.oilNum }}</p>
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
                    <p>润滑系统：{{ screenDatas?.cement.lubNum }}</p>
                    <p>状态监测：{{ screenDatas?.cement.vibNum }}</p>
                    <p>油液监测：{{ screenDatas?.cement.oilNum }}</p>
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

<script lang="ts" setup>
import { toRefs } from "vue";
const props = defineProps({
  screenDatas: {
    type: Object
    // default: () => {}
  }
});
let { screenDatas } = toRefs(props);
</script>
<style scoped lang="scss">
.showData {
  margin-left: 10px;
}
</style>
