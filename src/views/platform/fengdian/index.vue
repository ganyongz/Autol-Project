<template>
  <!-- <div> -->
  <el-row :gutter="10" class="container">
    <el-col :span="16" style="height: 100%; border: 1px solid red">
      <div class="box" style="width: 100%; height: 60%; border: 1px solid green">
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
              <el-button type="primary">正常</el-button>
              <p>震动检测最大值：100</p>
              <p>运行总时长：987h</p>
              <p>单次运行时长：1.25h</p>
            </div>
          </el-card>
        </div>
      </div>
      <div style="width: 100%; height: 40%; border: 1px solid green"></div>
    </el-col>
    <el-col :span="8" style="height: 100%; border: 1px solid yellow"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <!-- </div> -->
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
body,
html {
  height: 100%;
  padding: 0;
  margin: 0;
}
.container {
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
  border: 1px solid yellow;
  .box-1 {
    width: 400px;
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
    border: 1px solid red;
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
</style>
