<template>
  <div class="portContainer">
    <!-- 港口驾驶舱 -->
    <div class="portOutLine">
      <el-tree-select v-model="selectValue" :data="selectData" :render-after-expand="false" />
      <div class="portNavigation" style="background-color: green">
        <el-row :gutter="20">
          <el-col :span="10">
            <img style="width: 100%; height: 100px" src="@/views/platform/port/images/fengji2.png" alt="图片" />
          </el-col>
          <el-col :span="14">
            <p>监测总数</p>
            <p>2897</p>
          </el-col>
        </el-row>
      </div>

      <div class="portNavigation" style="background-color: red">
        <el-row :gutter="20">
          <el-col :span="10">
            <img style="width: 100%; height: 100px" src="@/views/platform/port/images/fengji2.png" alt="图片" />
          </el-col>
          <el-col :span="14">
            <p>故障数量</p>
            <p>19</p>
          </el-col>
        </el-row>
      </div>

      <div class="portNavigation" style="background-color: yellow">
        <el-row :gutter="20">
          <el-col :span="10">
            <img style="width: 100%; height: 100px" src="@/views/platform/port/images/fengji2.png" alt="图片" />
          </el-col>
          <el-col :span="14">
            <p>预警数量</p>
            <p>897</p>
          </el-col>
        </el-row>
      </div>

      <div class="portNavigation" style="background-color: green">
        <el-row :gutter="20">
          <el-col :span="10">
            <img style="width: 100%; height: 100px" src="@/views/platform/port/images/fengji2.png" alt="图片" />
          </el-col>
          <el-col :span="14">
            <p>正常数量</p>
            <p>1978</p>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="container">
      <div class="item1" v-for="item in 50" :key="item" @click="ToTargetPage(item)">
        <el-row :gutter="20">
          <el-col :span="10">
            <img style="width: 80%; height: 75px" src="@/views/platform/port/images/fengji2.png" alt="图片" />
          </el-col>
          <el-col :span="14">
            <p># {{ item }}号机</p>
            <div class="container1">
              <div class="text">润滑</div>
              <span class="dot"></span>
              <div class="text">油液</div>
              <span class="dot"></span>
              <div class="text">振动</div>
              <span class="dot"></span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bottomBox">
      <el-row :gutter="20" style="height: 100%">
        <el-col :span="8">
          <dv-border-box12>
            <div style="display: flex; align-items: center; height: 100%; padding: 10px; font-size: 20px; text-align: center">
              <div style="width: 30%; padding: 10px">
                <p>润滑报警部件数量</p>
                <p>19</p>
              </div>
              <div style="flex: 1; padding: 5px"><alarmInfo /></div>
            </div>
          </dv-border-box12>
        </el-col>

        <el-col :span="8">
          <dv-border-box12>
            <div style="display: flex; align-items: center; height: 100%; font-size: 20px; text-align: center">
              <div style="width: 30%; padding: 10px">
                <p>油液报警部件数量</p>
                <p>8</p>
              </div>
              <div style="flex: 1; padding: 10px"><alarmInfo /></div>
            </div>
          </dv-border-box12>
        </el-col>

        <el-col :span="8">
          <dv-border-box12>
            <div style="display: flex; align-items: center; height: 100%; font-size: 20px; text-align: center">
              <div style="width: 30%; padding: 10px">
                <p>振动报警部件数量</p>
                <p>12</p>
              </div>
              <div style="flex: 1; padding: 5px"><alarmInfo /></div>
            </div>
          </dv-border-box12>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts" name="cockpit">
import { ref } from "vue";
import alarmInfo from "@/views/platform/fengdian/components/alarmInfo.vue";
import { useRouter } from "vue-router";
const router = useRouter();
let selectValue = ref("哈巴河风电场");
let selectData = ref([
  {
    value: "1",
    label: "龙源电力集团"
  },
  {
    value: "2",
    label: "哈巴河风电场"
  },
  {
    value: "3",
    label: "海口国投洋浦港"
  }
]);
const ToTargetPage = (val: any) => {
  // console.log(val);
  router.push(`/online/anlageuebersicht/index?id=${val}`);
};
</script>

<style>
.portContainer {
  width: 100%;
  height: calc(100%);
  overflow: hidden;
  background: url("@/views/dataScreen/images/big_bg01.png") no-repeat;
  background-position: center;
  background-size: 100% 100%;
  .portOutLine {
    float: left;
    width: 300px;
    height: 70%;
    overflow-x: auto;
    border: 1px solid #009688;
    border-radius: 5px;
    .portNavigation {
      box-sizing: border-box; /* 防止padding导致宽度超出100% */
      width: calc(90% - 10px); /* 假设间隔为10px */
      height: 120px;
      padding: 10px;
      margin: 20px;
      color: #000000;
      text-align: center;
      cursor: pointer;
      border-radius: 10px;
      opacity: 0.6;
    }
    .el-select__wrapper {
      background-color: #000000;
    }
    .el-select__placeholder {
      color: #009688;
    }
  }
  .bottomBox {
    height: 29%;
    margin-top: 10px;
    color: #ffffff;
  }
}
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-star;
  height: 70%;
  margin-left: 300px;
  overflow-x: auto;
  border: 1px solid #009688;
}
.item1 {
  box-sizing: border-box; /* 防止padding导致宽度超出100% */
  width: calc(25% - 20px); /* 假设间隔为10px */
  height: 100px;
  padding: 10px;
  margin: 10px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  border: 1px solid #cccccc;
  .el-row {
    margin-top: -10px;
  }
}
.container1 {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center;
}
.dot {
  width: 15px; /* 圆圈的宽度 */
  height: 15px; /* 圆圈的高度 */
  margin-right: 5px; /* 圆圈之间的间距 */
  margin-left: 3px;
  background-color: #6dd775; /* 圆圈的颜色 */
  border-radius: 50%; /* 圆形效果 */
}
.text {
  margin-left: 10px; /* 文字与圆圈间的间距 */
}

/* 适配小屏幕设备 */

@media (width <= 1600px) {
  .item1 {
    width: calc(50% - 20px);
    margin-bottom: 10px;
  }
}

@media (width <= 768px) {
  .item1 {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
