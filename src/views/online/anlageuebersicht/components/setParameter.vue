<template>
  <div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane label="普通参数" :name="1">
        <div class="realTimeData-box p-20 my-12">
          <div class="mb-12" style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <!-- <img src="../../../assets/images/icons/ic_cs.png" class="mr-1" alt=""> -->
              <span style="color: #409eff">参数修改</span>
            </div>
            <div class="fs-14" style="color: #999999">采集时间：{{ parameterOfApparatus.DataTime }}</div>
          </div>
          <div>
            <div class="mb-16 fs-14">
              休止时间 (P1)：
              <el-input v-model="parameterOfApparatus.cycH" class="parameter-box mr-8" type="text" />时
              <el-input v-model="parameterOfApparatus.cycM" class="parameter-box mx-8" type="text" />分
            </div>

            <div class="mb-16 fs-14">
              润滑时间 (P3)：
              <el-input v-model="parameterOfApparatus.runM" class="parameter-box mr-8" type="text" />分
              <el-input v-model="parameterOfApparatus.runS" class="parameter-box mx-8" type="text" />秒
            </div>
            <div class="mb-16 fs-14">
              温控 (P4)：<el-input v-model="parameterOfApparatus.temperature" class="parameter-box mr-12" type="text" />℃
            </div>
            <div class="mb-8 fs-14">
              信号检测 (P2)：<el-input v-model="parameterOfApparatus.signal" class="parameter-box mr-12" type="text" />
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
              <!-- <img src="../../../assets/images/icons/ic_cs.png" class="mr-1" alt=""> -->
              <span style="color: #409eff">高级参数</span>
            </div>
            <div class="fs-14" style="color: #999999">采集时间：{{ backgroundParameter.DataTime }}</div>
          </div>
          <div>
            <div class="mb-16 fs-14">
              0H油压信号输入形式：<el-input v-model="backgroundParameter.h0" class="parameter-box mr-12" type="text" />
            </div>

            <div class="mb-8 fs-14">
              1H故障状态：<el-input v-model="backgroundParameter.h1" class="parameter-box mr-12" type="text" />
            </div>

            <div class="mb-8 fs-14">
              2H报警检测：<el-input v-model="backgroundParameter.h2" class="parameter-box mr-12" type="text" />
            </div>

            <div class="mb-8 fs-14">
              3H报警检测：<el-input v-model="backgroundParameter.h3" class="parameter-box mr-12" type="text" />
            </div>

            <div style="text-align: right">
              <el-button color="#095C98" type="primary" class="mr-12" @click="getDeviceParam()"> 读取 </el-button>
              <el-button color="#095C98" type="primary" @click="settingUpFun()"> 设置 </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup name="setParameter">
// 参数设置(普通泵)
import { ref, toRefs } from "vue";
import { pump_OperatePump, pump_getPumpParams, pump_setPumpParams } from "@/api/online/anlageuebersicht";
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
  getPumpParams();
  // console.log(activeName.value);
};

let parameterOfApparatus: any = ref({
  cycH: "", // 休止时
  cycM: "", // 休止分
  runM: "", // 润滑分
  runS: "", // 润滑秒
  temperature: undefined, // 温度
  signal: "", // 信号检测
  DataTime: "" // 采集时间
});
// 后台参数
const backgroundParameter: any = ref({
  DataTime: "", // 采集时间
  h0: "",
  h1: "",
  h2: "",
  h3: ""
});
// 读取(下发指令)
const getDeviceParam = async () => {
  const res: any = await pump_OperatePump({
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
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
    if (activeName.value == 1) {
      parameterOfApparatus.value = Object.assign(res.data);
    } else {
      backgroundParameter.value = res.data;
    }
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
    type: activeName.value == 1 ? 5 : 6
  };
  if (activeName.value == 1) {
    delete parameterOfApparatus.value["DataTime"];
    delete backgroundParameter.value["DataTime"];
    result = { ...parameters, ...parameterOfApparatus.value };
  } else {
    result = { ...parameters, ...backgroundParameter.value };
  }
  const res: any = await pump_setPumpParams(result);
  if (res.code == "200") {
    ElMessage.error(res?.message);
  } else {
    ElMessage.error(res?.message);
  }
};
</script>
<style scoped lang="scss">
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
