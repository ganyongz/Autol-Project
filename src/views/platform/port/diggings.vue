<template>
  <div class="dataScreen-container">
    <div class="dataScreen-content" ref="dataScreenRef">
      <div class="portContainer">
        <!-- 风力发电驾驶舱 -->
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
          <div class="portNavigation" style="border: 1px solid green; border-radius: 10px" @click="inquireEquipByStatus(0)">
            <el-row :gutter="20">
              <el-col :span="10">
                <img style="width: 100%; height: 100px" src="@/views/platform/port/images/crusherGreen.png" alt="图片" />
              </el-col>
              <el-col :span="14">
                <p>监测总数</p>
                <p>{{ allNum }}</p>
              </el-col>
            </el-row>
          </div>

          <div class="portNavigation" style="border: 1px solid red; border-radius: 10px" @click="inquireEquipByStatus(3)">
            <el-row :gutter="20">
              <el-col :span="10">
                <img style="width: 100%; height: 100px" src="@/views/platform/port/images/crusherRed.png" alt="图片" />
              </el-col>
              <el-col :span="14">
                <p>报警数量</p>
                <p>{{ dangerNum }}</p>
              </el-col>
            </el-row>
          </div>

          <div class="portNavigation" style="border: 1px solid yellow; border-radius: 10px" @click="inquireEquipByStatus(2)">
            <el-row :gutter="20">
              <el-col :span="10">
                <img style="width: 100%; height: 100px" src="@/views/platform/port/images/crusherYellow.png" alt="图片" />
              </el-col>
              <el-col :span="14">
                <p>预警数量</p>
                <p>{{ waringNum }}</p>
              </el-col>
            </el-row>
          </div>

          <div class="portNavigation" style="border: 1px solid yellowgreen; border-radius: 10px" @click="inquireEquipByStatus(1)">
            <el-row :gutter="20">
              <el-col :span="10">
                <img style="width: 100%; height: 100px" src="@/views/platform/port/images/crusherGreen.png" alt="图片" />
              </el-col>
              <el-col :span="14">
                <p>正常数量</p>
                <p>{{ normalNum }}</p>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="container">
          <div class="item1" v-for="item in equipDatas" :key="item" @click="ToTargetPage(item)">
            <el-row :gutter="20">
              <el-col :span="10">
                <img
                  v-if="item?.alarmLevel == '2'"
                  style="width: 75%; height: 7rem"
                  src="@/views/platform/port/images/crusherRed.png"
                  alt="图片"
                />
                <img
                  v-else-if="item?.alarmLevel == '1'"
                  style="width: 75%; height: 7rem"
                  src="@/views/platform/port/images/crusherYellow.png"
                  alt="图片"
                />
                <img v-else style="width: 75%; height: 7rem" src="@/views/platform/port/images/crusherGreen.png" alt="图片" />
              </el-col>
              <el-col :span="14">
                <p>{{ item.name }}</p>
                <div class="container1">
                  <div class="text" v-if="item?.LubStatus !== null && item?.LubStatus == '2'">
                    润滑<span class="dot dotRed"></span>
                  </div>
                  <div class="text" v-if="item?.LubStatus !== null && item?.LubStatus == '1'">
                    润滑<span class="dot dotYellow"></span>
                  </div>
                  <div class="text" v-if="item?.LubStatus !== null && item?.LubStatus == '0'">
                    润滑<span class="dot dotGreen"></span>
                  </div>
                  <div class="text" v-if="item?.LubStatus !== null && item?.LubStatus == '9'">
                    润滑<span class="dot dotGray"></span>
                  </div>

                  <div class="text" v-if="item?.OilStatus !== null && item?.OilStatus == '2'">
                    油液<span class="dot dotRed"></span>
                  </div>
                  <div class="text" v-if="item?.OilStatus !== null && item?.OilStatus == '1'">
                    油液<span class="dot dotYellow"></span>
                  </div>
                  <div class="text" v-if="item?.OilStatus !== null && item?.OilStatus == '0'">
                    油液<span class="dot dotGreen"></span>
                  </div>
                  <div class="text" v-if="item?.OilStatus !== null && item?.OilStatus == '9'">
                    油液<span class="dot dotGray"></span>
                  </div>

                  <div class="text" v-if="item?.VibStatus !== null && item?.VibStatus == '2'">
                    振动<span class="dot dotRed"></span>
                  </div>
                  <div class="text" v-if="item?.VibStatus !== null && item?.VibStatus == '1'">
                    振动<span class="dot dotYellow"></span>
                  </div>
                  <div class="text" v-if="item?.VibStatus !== null && item?.VibStatus == '0'">
                    振动<span class="dot dotGreen"></span>
                  </div>
                  <div class="text" v-if="item?.VibStatus !== null && item?.VibStatus == '9'">
                    振动<span class="dot dotGray"></span>
                  </div>
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
                  <div>
                    <div>润滑统计</div>
                    <div ref="chartRef1" style="width: 15rem; height: 240px; padding: 10px"></div>
                  </div>
                  <div style="flex: 1; padding: 5px"><alarmInfoLub :key="tplKey" :transmit-datas="lubDataList" /></div>
                </div>
              </dv-border-box12>
            </el-col>

            <el-col :span="8">
              <dv-border-box12>
                <div style="display: flex; align-items: center; height: 100%; font-size: 20px; text-align: center">
                  <div>
                    <div>油液统计</div>
                    <div ref="chartRef2" style="width: 15rem; height: 240px; padding: 10px"></div>
                  </div>
                  <div style="flex: 1; padding: 10px"><alarmInfoOil :key="tplKey" :transmit-datas="oilDataList" /></div>
                </div>
              </dv-border-box12>
            </el-col>

            <el-col :span="8">
              <dv-border-box12>
                <div style="display: flex; align-items: center; height: 100%; font-size: 20px; text-align: center">
                  <div>
                    <div>振动统计</div>
                    <div ref="chartRef3" style="width: 15rem; height: 240px; padding: 10px"></div>
                  </div>
                  <div style="flex: 1; padding: 5px"><alarmInfoVib :key="tplKey" :transmit-datas="vibDataList" /></div>
                </div>
              </dv-border-box12>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="diggings">
// 矿山
import { ref, onBeforeUnmount, onMounted } from "vue";
import alarmInfoLub from "@/views/platform/port/components/alarmInfoLub.vue";
import alarmInfoOil from "@/views/platform/port/components/alarmInfoOil.vue";
import alarmInfoVib from "@/views/platform/port/components/alarmInfoVib.vue";
import { industry_industryCockpitEquipList, industry_industryCockpitAlarmPart } from "@/api/dataScreen";
import dayjs from "dayjs";
import { HOME_URL } from "@/config";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import * as echarts from "echarts";
const router = useRouter();
const ToTargetPage = (val: any) => {
  // router.push(`/online/anlageuebersicht/index?id=${val}`);
  router.push({ path: "/online/anlageuebersicht/partDetail", query: { id: val.id, name: val.name } });
};
const dataScreenRef = ref<HTMLElement | null>(null);
// 1 润滑
const chartRef1 = ref<HTMLElement | null>(null);
let chartInstance1: echarts.ECharts | null = null;
function setChartOption1() {
  let option = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "0%",
      left: "center",
      textStyle: {
        color: "#ffffff"
      }
    },
    series: [
      {
        name: "润滑统计",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 0, name: "正常" },
          { value: 0, name: "预警" },
          { value: 0, name: "报警" }
        ]
      }
    ]
  };
  chartInstance1?.setOption(option);
}
// 2 油液
const chartRef2 = ref<HTMLElement | null>(null);
let chartInstance2: echarts.ECharts | null = null;
function setChartOption2() {
  let option = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "0%",
      left: "center",
      textStyle: {
        color: "#ffffff"
      }
    },
    series: [
      {
        name: "油液统计",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 0, name: "正常" },
          { value: 0, name: "预警" },
          { value: 0, name: "报警" }
        ]
      }
    ]
  };
  chartInstance2?.setOption(option);
}
// 3 振动
const chartRef3 = ref<HTMLElement | null>(null);
let chartInstance3: echarts.ECharts | null = null;
function setChartOption3() {
  let option = {
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "0%",
      left: "center",
      textStyle: {
        color: "#ffffff"
      }
    },
    series: [
      {
        name: "振动统计",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 0, name: "正常" },
          { value: 0, name: "预警" },
          { value: 0, name: "报警" }
        ]
      }
    ]
  };
  chartInstance3?.setOption(option);
}
onMounted(() => {
  // 1.润滑
  chartInstance1 = echarts.init(chartRef1.value!);
  setChartOption1();
  // 2.油液
  chartInstance2 = echarts.init(chartRef2.value!);
  setChartOption2();
  // 3.油液
  chartInstance3 = echarts.init(chartRef3.value!);
  setChartOption3();
  getEquipList(); //设备列表
  getIndustryCockpitAlarmPart(); //报警列表
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
// 状态筛选
let status = ref(0);
const inquireEquipByStatus = (val: number) => {
  status.value = val;
  getEquipList();
};
//报警部件列表
let tplKey = ref(1);
let lubDataList = ref();
let oilDataList = ref();
let vibDataList = ref();
const getIndustryCockpitAlarmPart = async () => {
  // if (route.query.type) {
  let res: any = await industry_industryCockpitAlarmPart({
    industryType: 5 //1 风电设备 2港口设备 3食品设备 4工程机械 5矿山 6水泥
  });
  if (res.code == "200") {
    // -> 数据处理 <- 0正常，1预警 2危险
    const levelMap = {
      1: "预警",
      2: "危险"
    };
    // 1.润滑
    if (res.data?.lubDataList) {
      lubDataList.value = res.data?.lubDataList.map(item => ({
        ...item,
        alarmLevel: levelMap[item.alarmLevel] || "未知" // 如果没有匹配的映射，则使用 '未知'
      }));
    }
    chartInstance1?.setOption({
      series: [
        {
          data: [
            { value: res.data?.lubNormalNum, name: "正常", itemStyle: { color: "#00FF00" } },
            { value: res.data?.lubAlarmNum, name: "预警", itemStyle: { color: "yellow" } },
            { value: res.data?.lubDangerNum, name: "报警", itemStyle: { color: "#FF0000" } }
          ]
        }
      ]
    });
    // 2.油液
    if (res.data?.oilDataList) {
      oilDataList.value = res.data?.oilDataList.map(item => ({
        ...item,
        alarmLevel: levelMap[item.alarmLevel] || "未知"
      }));
    }
    chartInstance2?.setOption({
      series: [
        {
          data: [
            { value: res.data?.oilNormalNum, name: "正常", itemStyle: { color: "#00FF00" } },
            { value: res.data?.oilAlarmNum, name: "预警", itemStyle: { color: "yellow" } },
            { value: res.data?.oilDangerNum, name: "报警", itemStyle: { color: "#FF0000" } }
          ]
        }
      ]
    });
    // 3.振动
    if (res.data?.vibDataList) {
      vibDataList.value = res.data?.vibDataList.map(item => ({
        ...item,
        alarmLevel: levelMap[item.alarmLevel] || "未知"
      }));
    }
    chartInstance3?.setOption({
      series: [
        {
          data: [
            { value: res.data?.vibNormalNum, name: "正常", itemStyle: { color: "#00FF00" } },
            { value: res.data?.vibAlarmNum, name: "预警", itemStyle: { color: "yellow" } },
            { value: res.data?.vibDangerNum, name: "报警", itemStyle: { color: "#FF0000" } }
          ]
        }
      ]
    });
    tplKey.value += 1;
  } else {
    ElMessage.error(res?.message);
  }
  // }
};

// 获取设备列表
let allNum = ref(0);
let normalNum = ref(0);
let waringNum = ref(0);
let dangerNum = ref(0);
let equipDatas = ref();
const getEquipList = async () => {
  // if (route.query.type) {
  let res: any = await industry_industryCockpitEquipList({
    industryType: 5, //1 风电设备 2港口设备 3食品设备 4工程机械 5矿山 6水泥
    status: status.value //状态 0全部 1正常 2预警 3报警
  });
  if (res.code == "200") {
    equipDatas.value = res.data.data;
    allNum.value = res.data.allNum;
    normalNum.value = res.data.normalNum;
    waringNum.value = res.data.waringNum;
    dangerNum.value = res.data.dangerNum;
  } else {
    ElMessage.error(res?.message);
  }
  // }
};

// 调用
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
      height: 130px;
      padding: 10px;
      margin: 20px;
      color: #ffffff;
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
  height: 140px;
  padding: 10px;
  margin: 10px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  border: 1px solid #cccccc;
  border-radius: 10px;
  .el-row {
    // margin-top: -10px;
  }
}
.container1 {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center;
}
.text {
  margin-left: 10px; /* 文字与圆圈间的间距 */
  .dot {
    display: inline-block;
    width: 15px; /* 圆圈的宽度 */
    height: 15px; /* 圆圈的高度 */
    margin-right: 5px; /* 圆圈之间的间距 */
    margin-left: 3px;
    border-radius: 50%; /* 圆形效果 */
  }
  .dotRed {
    background-color: red; /* 圆圈的颜色 */
  }
  .dotYellow {
    background-color: yellow;
  }
  .dotGreen {
    background-color: #6dd775;
  }
  .dotGray {
    background-color: gray;
  }
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
