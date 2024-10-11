<template>
  <div>
    <div class="realTimeData-box p-20 my-12">
      <div class="fs-14" style="color: #999999">采集时间：{{ parameterOfApparatus.DataTime }}</div>
      <div v-loading="loading" element-loading-text="读取中...">
        <div style="width: 350px; margin: 0 auto">
          <div class="mb-8 fs-14">
            <span class="labelClass">组别：</span>
            <el-input v-model="parameterOfApparatus.group" class="parameter-box mr-12" type="text" />
          </div>

          <div class="mb-8 fs-14">
            <span class="labelClass">连锁号：</span>
            <el-input v-model="parameterOfApparatus.chainNumber" class="parameter-box mr-12" type="text" />
          </div>

          <div class="mb-8 fs-14">
            <span class="labelClass">起点：</span>
            <el-input v-model="parameterOfApparatus.startPoint" class="parameter-box mr-12" type="text" />
          </div>

          <div class="mb-8 fs-14">
            <span class="labelClass">终点：</span>
            <el-input v-model="parameterOfApparatus.endPoint" class="parameter-box mr-12" type="text" />
          </div>

          <div class="mb-16 fs-14">
            <span class="labelClass">休止时间：</span>
            <el-input v-model.number="parameterOfApparatus.restHour" class="parameter-box" type="text" /> 时
            <el-input v-model.number="parameterOfApparatus.restMin" class="parameter-box" type="text" /> 分
          </div>

          <div class="mb-16 fs-14">
            <span class="labelClass">润滑时间：</span>
            <el-input v-model.number="parameterOfApparatus.lubTime" class="parameter-box mx-8" type="text" /> 秒
          </div>

          <div class="mb-16 fs-14">
            <span class="labelClass">润滑油量：</span>
            <el-input v-model.number="parameterOfApparatus.lubOil" class="parameter-box mr-12" type="text" /> ml
          </div>

          <div class="mb-16 fs-14">
            <span class="labelClass">补油时间：</span>
            <el-input
              v-model.number="parameterOfApparatus.refuelingTime"
              oninput="value=value.replace(/^0+(\d)|[^\d]+/g,'')"
              class="parameter-box mx-8"
              type="text"
            />
            秒
          </div>
        </div>
        <div style="text-align: center">
          <el-button color="#095C98" type="primary" class="mr-12" @click="getDeviceParam()"> 读取 </el-button>
          <el-button color="#095C98" type="primary" @click="settingUpFun()"> 设置 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="setParameterAtl3k">
// 参数设置(ATL3000)
import { ref, toRefs } from "vue";
import { pump_OperatePump, pump_getPumpParams } from "@/api/online/anlageuebersicht";
import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps({
  setParameters: {
    type: Object
  }
});
const { setParameters }: any = toRefs(props);
let loading = ref(false);
// 普通参数设置
let parameterOfApparatus: any = ref({
  DataTime: "", // 采集时间
  group: "", //组别
  chainNumber: "", //连锁号
  startPoint: "", //起点
  endPoint: "", //终点
  restHour: "", // 休止时
  restMin: "", // 休止分
  lubTime: "", // 润滑时长
  lubOil: "", // 润滑油量
  refuelingTime: "" //补油时间
});
// 读取(下发指令)
const getDeviceParam = () => {
  ElMessageBox.prompt("组别:", "", {
    confirmButtonText: "确定"
    // cancelButtonText: "Cancel"
    // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      open(value);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      });
    });
};

const open = async val => {
  const res: any = await pump_OperatePump({
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
    type: 5, //ATL3000 操作
    group: val
  });
  if (res.code == "200") {
    loading.value = true;
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
    type: 1 //普通参数设置
  });
  if (res.code == "200") {
    parameterOfApparatus.value = Object.assign(res.data);
  } else {
    ElMessage.error(res?.message);
  }
  loading.value = false;
};

// 设置
const settingUpFun = async () => {
  if (parameterOfApparatus.value.refuelingTime == "" || parameterOfApparatus.value.refuelingTime == undefined) {
    ElMessage.warning("请填写补油时间");
    return;
  }
  let result = {};
  let parameters = {
    gatewaySn: setParameters.value["GatewaySn"],
    pumpStationType: setParameters?.value.PumpStationType,
    plcAddress: setParameters?.value.PlcAddress,
    type: 4 //ATL3000普通参数设置
  };
  // let variableData = parameterOfApparatus.value;
  // delete variableData["DataTime"];
  let variableData = JSON.parse(JSON.stringify(parameterOfApparatus.value));
  delete variableData["DataTime"];
  result = { ...parameters, ...variableData };
  const res: any = await pump_OperatePump(result);
  if (res.code == "200") {
    ElMessage.success(res?.message);
  } else {
    ElMessage.error(res?.message);
  }
};
getPumpParams(); //获取数据
</script>
<style scoped lang="scss">
.labelClass {
  display: inline-block;
  width: 100px;
  text-align: left;
}
.parameter-box {
  width: 100px;
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
  :deep(.el-input__inner) {
    text-align: center;
  }
}
</style>
