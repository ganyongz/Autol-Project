<template>
  <div>
    <!-- 双线泵参数设置 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane label="普通参数" :name="1">
        <div class="realTimeData-box p-20 my-12">
          <div class="mb-12" style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <span style="color: #409eff">参数修改</span>
            </div>
            <div class="fs-14" style="color: #999999">采集时间：{{ parameterOfApparatus.DataTime }}</div>
          </div>
          <div>
            <div class="mb-16 fs-14">
              休止时间：
              <el-input v-model="parameterOfApparatus.pauseTime" class="parameter-box mr-12" type="text" /> 时
            </div>

            <div class="mb-16 fs-14">
              正转时间：
              <el-input v-model="parameterOfApparatus.forwardMin" class="parameter-box mr-12" type="text" /> 分
            </div>

            <div class="mb-16 fs-14">
              反转时间：
              <el-input v-model="parameterOfApparatus.reverseMin" class="parameter-box mr-12" type="text" /> 分
            </div>

            <div class="mb-16 fs-14">
              温控 (P4)：<el-input v-model="parameterOfApparatus.temperature" class="parameter-box mr-12" type="text" /> ℃
            </div>
            <div style="text-align: right">
              <el-button color="#095C98" type="primary" class="mr-12" @click="getDeviceParam()"> 读取 </el-button>
              <el-button color="#095C98" type="primary" @click="settingUpFun()"> 设置 </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 2 -->
      <el-tab-pane label="高级参数" :name="2">
        <div class="realTimeData-box p-20 my-12">
          <div class="mb-12" style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <span style="color: #409eff">高级参数</span>
            </div>
            <div class="fs-14" style="color: #999999">采集时间：{{ parameterOfApparatus.DataTime }}</div>
          </div>
          <div>
            <div class="mb-16 fs-14">
              <span class="labelClass">0H堵塞信号路数：</span>
              <el-input v-model="parameterOfApparatus.H0" class="parameter-box mr-12" type="text" />
            </div>

            <div class="mb-8 fs-14">
              <span class="labelClass">1H传感器模式：</span>
              <el-input v-model="parameterOfApparatus.H1" class="parameter-box mr-12" type="text" />
            </div>

            <div style="text-align: right">
              <el-button color="#095C98" type="primary" class="mr-12" @click="getDeviceParam()"> 读取 </el-button>
              <el-button color="#095C98" type="primary" @click="settingUpFun()"> 设置 </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 3 -->
      <el-tab-pane
        v-if="setParameters?.communicationVersion == 2 || setParameters?.communicationVersion == 3"
        label="设置上传频次"
        :name="3"
      >
        <div class="mb-16 fs-14">
          频次设置：
          <el-input v-model.number="Hour" class="parameter-box mr-8" type="text" /> 时
          <el-input v-model.number="Min" class="parameter-box mr-8" type="text" /> 分
          <el-input v-model.number="second" class="parameter-box mx-8" type="text" /> 秒
        </div>
        <div style="text-align: right">
          <el-button color="#095C98" type="primary" @click="settingFrequency()"> 设置 </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup name="setParameter2">
// 参数设置(双线)
import { ref, toRefs } from "vue";
import { pump_OperatePump, pump_getPumpParams } from "@/api/online/anlageuebersicht";
import { ElMessage } from "element-plus";
const props = defineProps({
  setParameters: {
    type: Object
  }
});
const { setParameters }: any = toRefs(props);
// console.log(setParameters, "--setParameters==");
const activeName = ref(1);
const handleClick = tab => {
  activeName.value = tab;
  if (activeName.value !== 3) {
    getPumpParams();
  }
  // console.log(activeName.value);
};

let parameterOfApparatus: any = ref({
  pauseTime: "", // 休止时
  forwardMin: "", // 正转时间 分
  reverseMin: "", // 反转时间 分
  temperature: "", // 低温保护阈值
  numberOfCycles: "", // 循环次数
  p6: "", // 保压时间
  t6: "", // 保压系数
  p7: "", // 7p换向压力值
  p8: "", // 8p超压报警压力值
  p9: "", // 泄压设定时间
  t9: "", // 泄压系数
  H0: "", // 0H堵塞信号通道数0H=2~4
  H1: "", // 1H=0不检测油压不检测霍尔 1H=1检测油压不检测霍尔 1H=2检测霍尔不检测油压 1H=3检测霍尔检测油压
  H2: "", //（ 2h泄压类型） 0不泄压 1泄压时间 2泄压系数）
  H3: "", //（3h保压类型） 0不保压 1保压时间 2保压系数）
  H4: "", //（4h休止时间单位=0小时 =1天）
  H5: "" // 5h液位检测  0 不检测 1检测
});

// 读取(下发指令) 双线
const getDeviceParam = async () => {
  const res: any = await pump_OperatePump({
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
    communicationVersion: setParameters?.value.communicationVersion, //版本号
    type: activeName.value == 1 ? 5 : 6
  });
  if (res.code == "200") {
    setTimeout(() => {
      getPumpParams();
    }, 3000);
  } else {
    ElMessage.error(res?.message);
  }
};
// 获取(实时)数据
const getPumpParams = async () => {
  const res: any = await pump_getPumpParams({
    partId: setParameters?.value.partId,
    type: activeName.value
  });
  if (res.code == "200") {
    parameterOfApparatus.value = Object.assign(res.data);
  } else {
    ElMessage.error(res?.message);
  }
};
// 频次设置
let Hour = ref();
let Min = ref();
let second = ref();
const settingFrequency = async () => {
  let result = {
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
    communicationVersion: setParameters?.value.communicationVersion, //版本号
    type: 9,
    Hour: Hour.value,
    Min: Min.value,
    second: second.value
  };
  const res: any = await pump_OperatePump(result);
  if (res.code == "200") {
    ElMessage.success(res?.message);
  } else {
    ElMessage.error(res?.message);
  }
};
// 设置
const settingUpFun = async () => {
  let result = {};
  let parameters = {
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
    communicationVersion: setParameters?.value.communicationVersion, //版本号
    type: activeName.value == 1 ? 7 : 8
  };
  delete parameterOfApparatus.value["DataTime"];
  result = { ...parameters, ...parameterOfApparatus.value };
  const res: any = await pump_OperatePump(result);
  if (res.code == "200") {
    ElMessage.success(res?.message);
  } else {
    ElMessage.error(res?.message);
  }
};
</script>
<style scoped lang="scss">
.labelClass {
  display: inline-block;
  width: 130px;
  text-align: right;
}
.parameter-box {
  width: 72px;
  height: 28px;
  color: #57c2ff;
  text-align: center;
  background: rgb(87 194 255 / 20%);
  border: 1px solid #22a4ee;
  outline: none;
}
.fs-14 {
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
