<template>
  <div class="dataScreen-container">
    <div class="dataScreen-content" ref="dataScreenRef">
      <div class="portContainer">
        <!-- 港口驾驶舱 -->
        <div class="dataScreen-header">
          <div class="header-lf">
            <span class="header-screening" @click="router.push(HOME_URL)">首页</span>
          </div>
          <div class="header-ct">
            <div class="header-ct-title">
              <span>DIMS智慧管理平台</span>
            </div>
          </div>
          <div class="header-ri">
            <span class="header-time">当前时间：{{ time }}</span>
          </div>
        </div>
        <div class="portOutLine">
          <el-tree-select v-model="selectValue" :data="selectData" :render-after-expand="false" :props="defaultProps" />
          <div class="portNavigation" style="background-color: green">
            <el-row :gutter="20">
              <el-col :span="10">
                <img style="width: 100%; height: 100px" src="@/views/platform/port/images/fengjiRed.png" alt="图片" />
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
                <img style="width: 75%" src="@/views/platform/port/images/gangkouRed.png" alt="图片" />
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
    </div>
  </div>
</template>

<script setup lang="ts" name="cockpit">
import { ref, onBeforeUnmount, onMounted } from "vue";
import alarmInfo from "@/views/platform/fengdian/components/alarmInfo.vue";
import { industry_industryCockpitDropDown } from "@/api/dataScreen";
import dayjs from "dayjs";
import { HOME_URL } from "@/config";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
let selectValue = ref();
const defaultProps = {
  value: "id",
  label: "platformName"
};
let selectData = ref();
const ToTargetPage = (val: any) => {
  router.push(`/online/anlageuebersicht/index?id=${val}`);
};
const dataScreenRef = ref<HTMLElement | null>(null);
// let screenDatas = ref();
const getDatas = async () => {
  let res: any = await industry_industryCockpitDropDown({});
  if (res.code == "200") {
    selectData.value = res.data;
  } else {
    ElMessage.error(res?.message);
  }
};
onMounted(() => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
    dataScreenRef.value.style.width = `1920px`;
    dataScreenRef.value.style.height = `1080px`;
  }
  window.addEventListener("resize", resize);
});
// 设置响应式
const resize = () => {
  if (dataScreenRef.value) {
    dataScreenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
  }
};

// 根据浏览器大小推断缩放比例
const getScale = (width = 1920, height = 1080) => {
  let ww = window.innerWidth / width;
  let wh = window.innerHeight / height;
  return ww < wh ? ww : wh;
};
// 获取当前时间
let timer: NodeJS.Timer | null = null;
let time = ref<string>(dayjs().format("YYYY年MM月DD HH:mm:ss"));
timer = setInterval(() => {
  time.value = dayjs().format("YYYY年MM月DD HH:mm:ss");
}, 1000);
onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  clearInterval(timer as unknown as number);
});
// 调用
getDatas();
</script>

<style lang="scss" scoped>
@import "@/views/platform/port/index.scss";
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
    height: 60%;
    margin-top: 50px;
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
  height: 60%;
  margin-top: 50px;
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
// @media (width <= 1600px) {
//   .item1 {
//     width: calc(50% - 20px);
//     margin-bottom: 10px;
//   }
// }

// @media (width <= 768px) {
//   .item1 {
//     width: 100%;
//     margin-bottom: 10px;
//   }
// }
</style>
