<template>
  <div class="container1">
    <el-row :gutter="10" style="width: 100%; height: 100%">
      <el-col :span="16" style="height: 100%">
        <div class="box" style="width: 100%; height: 60%">
          <div class="box-1">
            <dv-decoration-11 style="width: 200px; height: 45px">
              <div color-green font-600 bg="~ dark/0">xxxxxx风场</div>
            </dv-decoration-11>
            <!-- <dv-decoration7 style="width: 150px; height: 30px">
            <div color-white font-300>Decoration</div>
          </dv-decoration7> -->
            <el-card class="bocCard">
              <el-row :gutter="20">
                <el-col :span="6" style="width: 100px; height: 120px; border: 1px solid #afafaf">相关图片</el-col>
                <el-col :span="18" style="text-align: center">
                  <p>监测风机总数</p>
                  <p>2088 台</p>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="bocCard">
              <el-row :gutter="20">
                <el-col :span="6" style="width: 100px; height: 120px; border: 1px solid #afafaf">相关图片</el-col>
                <el-col :span="18" style="text-align: center">
                  <p>故障报警风机</p>
                  <p>2 台</p>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="bocCard">
              <el-row :gutter="20">
                <el-col :span="6" style="width: 100px; height: 120px; border: 1px solid #afafaf">相关图片</el-col>
                <el-col :span="18" style="text-align: center">
                  <p>预警报警风机</p>
                  <p>1 台</p>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="bocCard">
              <el-row :gutter="20">
                <el-col :span="6" style="width: 100px; height: 120px; border: 1px solid #afafaf">相关图片</el-col>
                <el-col :span="18" style="text-align: center">
                  <p>注意待观测风机</p>
                  <p>1 台</p>
                </el-col>
              </el-row>
            </el-card>
          </div>
          <!-- 风机卡片列表 -->
          <div class="box-2">
            <el-card v-for="it in 15" :key="it['id']" class="box-card" shadow="hover">
              <div class="left">
                <img :src="it['equipImageUrl']" height="100px" width="100%" alt="暂无图片" />
              </div>
              <div class="right">
                <div style="display: flex; justify-content: space-between">
                  <p>#{{ it }}机组</p>
                  <p>
                    <el-icon><View /></el-icon>
                  </p>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px">
                  <span>组轴承</span><el-icon><Flag /></el-icon> <span>齿轮箱</span><el-icon><Flag /></el-icon>
                  <span>发电机</span>
                  <el-icon><Flag /></el-icon>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        <!-- 健康统计 -->
        <div class="healthStatistics" style="width: 100%; height: 40%">
          <!-- <alarmInfo /> -->
          <div class="healthBox">
            <dv-decoration-11 style="width: 350px; height: 45px">
              <div color-green font-600 bg="~ dark/0">主轴承健康统计</div>
            </dv-decoration-11>
            <healthBearing />
          </div>
          <div class="healthBox">
            <dv-decoration-11 style="width: 350px; height: 45px">
              <div color-green font-600 bg="~ dark/0">齿轮箱健康统计</div>
            </dv-decoration-11>
            <healthGearCase />
          </div>
          <div class="healthBox">
            <dv-decoration-11 style="width: 350px; height: 45px">
              <div color-green font-600 bg="~ dark/0">发电机健康统计</div>
            </dv-decoration-11>
            <healthDynamo />
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="height: 100%" class="rightBox">
        <div class="rightSmallBox">
          <dv-decoration-11 style="width: 200px; height: 45px">
            <div color-green font-600 bg="~ dark/0">报警测点统计</div>
          </dv-decoration-11>
          <AlarmPoint />
        </div>

        <div class="rightSmallBox">
          <dv-decoration-11 style="width: 200px; height: 45px">
            <div color-green font-600 bg="~ dark/0">当前状态统计</div>
          </dv-decoration-11>
          <CurrentState />
        </div>

        <div class="rightSmallBox">
          <dv-decoration-11 style="width: 200px; height: 45px">
            <div color-green font-600 bg="~ dark/0">报警信息</div>
          </dv-decoration-11>
          <alarmInfo />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import AlarmPoint from "@/views/platform/fengdian/components/AlarmPoint.vue";
import CurrentState from "@/views/platform/fengdian/components/CurrentState.vue";
import alarmInfo from "@/views/platform/fengdian/components/alarmInfo.vue";
import healthBearing from "@/views/platform/fengdian/components/healthBearing.vue";
import healthGearCase from "@/views/platform/fengdian/components/healthGearCase.vue";
import healthDynamo from "@/views/platform/fengdian/components/healthDynamo.vue";
</script>

<style scoped lang="scss">
body,
html {
  height: 100%;
  padding: 0;
  margin: 0;
}
.container1 {
  bottom: 0;
  width: 100%;

  /* display: flex; */
  height: 100%;
  padding: 0;
  margin: 0;
  background-image: url("./images/bg_fd2.jpg");
  background-repeat: repeat; /* 让背景图平铺 */
  background-position: center; /* 背景图居中 */
  background-size: cover; /* 背景图覆盖整个页面 */
}
.box {
  display: flex;
  color: #ffffff;
  .box-1 {
    width: 400px;
    margin-right: 30px;
    :deep .el-card {
      color: #ffffff;

      // background-color: rgb(0 255 221 / 10%);
    }
    .bocCard {
      max-width: 390px;
      height: 21%;
      min-height: 100px;
      margin: 10px auto;
      background-color: transparent;
    }
  }
  .box-2 {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: space-between;
    overflow-x: auto;
    .el-card {
      min-width: 390px;
      height: 170px;
      padding: 0;
      margin-bottom: 10px;
      color: #ffffff;
      background-color: transparent;
      opacity: 0.5;
      .el-card__body {
        height: 100% !important;
        padding: 5px !important;
      }
    }
  }
}
.left {
  float: left;
  width: 100px;
  height: 140px;
}
.right {
  float: right;
  width: calc(100% - 100px);
  height: 140px;
}

// 健康统计
.healthStatistics {
  display: flex;
  justify-content: center;
  .healthBox {
    width: 33%;
    color: #ffffff;
    text-align: -webkit-center;
  }
}

// 右侧
.rightBox {
  height: 100%;
  color: #ffffff;
  .rightSmallBox {
    height: 33%;
    min-height: 320px;
  }
}
</style>
